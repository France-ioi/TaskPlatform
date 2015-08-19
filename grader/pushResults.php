<?php

/*
 * Return url for graderQueue, expects a JWE token as 'sToken' in POST.
 */

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (!isset($_POST['sToken'])) {
   error_log('missing sToken POST variable.');
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken POST variable.'));
   exit;
}

require_once "../shared/connect.php";
require_once "../shared/TokenParser.php";
require_once "../shared/common.inc.php";

$tokenParser = new TokenParser($config->graderqueue->own_private_key,
   $config->graderqueue->own_name,
   'private',
   $config->graderqueue->public_key,
   $config->graderqueue->name,
   'public'
   );

$tokenParams = $tokenParser->decodeJWES($_POST['sToken']);
if (!$tokenParams) {
   error_log('cannot decrypt token.');
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot decrypt token.'));
   exit;
}

// get task
$stmt =$db->prepare('SELECT tm_tasks.* from tm_tasks
   JOIN tm_submissions ON tm_submissions.idTask = tm_tasks.ID
   WHERE tm_submissions.ID = :idSubmission;');
$stmt->execute(array('idSubmission' => $tokenParams['sTaskName']));
$task = $stmt->fetch();

if (!$task) {
   error_log('cannot find task corresponding to submission '.$tokenParams['sTaskName']);
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find task corresponding to submission '.$tokenParams['sTaskName']));
   exit;
}

// get name -> ID correspondance for tasks_tests:
$stmt =$db->prepare('SELECT tm_tasks_tests.sName, tm_tasks_tests.ID from tm_tasks_tests 
   JOIN tm_submissions ON tm_submissions.idTask = tm_tasks_tests.idTask 
   WHERE tm_submissions.ID = :idSubmission and ((tm_tasks_tests.sGroupType = \'Evaluation\' or tm_tasks_tests.sGroupType = \'Example\') or (tm_tasks_tests.sGroupType = \'User\' and tm_tasks_tests.idUser = tm_submissions.idUser and tm_tasks_tests.idPlatform = tm_submissions.idPlatform));');
$stmt->execute(array('idSubmission' => $tokenParams['sTaskName']));
$allTests = $stmt->fetchAll();
$testsNameID = array();

foreach ($allTests as $test) {
   $testsNameID[$test['sName']] = $test['ID'];
}

$graderResults = $tokenParams['sResultData'];

$nbTestsPassed = 0;
$iScoreTotal = 0;
$nbTestsTotal = 0;
$bCompilError = false;
$sErrorMsg = '';

// TODO: handle subtasks (currently no substask is used)

$minScoreToValidateTest = intval($task['iMinScoreForSuccessGlobal']);

// there are as many executions as there are sources to evaluate, so here
// we use only one:
foreach ($graderResults['executions'][0]['testsReports'] as $testReport) {
   $nbTestsTotal = $nbTestsTotal + 1;
   $iErrorCode = 1;
   if (!isset($testReport['checker'])) {
      $bCompilError = true;
      $iErrorCode = 6;
      // TODO: not sure about this part
      if (isset($testReport['execution'])) {
         $sErrorMessage = $testReport['execution']['stderr']['data'];
      } else {
         $sErrorMessage = $testReport['sanitizer']['stderr']['data'];
      }
      break; // ?
   } else {
      $iScore = intval(strtok($testReport['checker']['stdout']["data"], "\n")); // TODO: make a score field in the json
      if ($iScore > $minScoreToValidateTest) {
         $nbTestsPassed = $nbTestsPassed + 1;
         $iErrorCode = 0;
      }
      $iTimeMs = $testReport['checker']['timeTakenMs'];
      $iMemoryKb = $testReport['checker']['memoryUsedKb'];
      $iScoreTotal = $iScoreTotal + $iScore;
      $idTest = $testsNameID[$testReport['name']];
      if (!$idTest) {
         error_log('cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']);
         echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']));
         exit;
      }
      $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, idTest, iScore, iTimeMs, iMemoryKb, iErrorCode) values (:idSubmission, :idTest, :iScore, :iTimeMs, :iMemoryKb, :iErrorCode);');
      $stmt->execute(array('idSubmission' => $tokenParams['sTaskName'], 'idTest' => $idTest, 'iScore' => $iScore, 'iTimeMs' => $iTimeMs, 'iMemoryKb' => $iMemoryKb, 'iErrorCode' => $iErrorCode));
   }
}

if ($nbTestsTotal) {
   $iScore = round($iScoreTotal / $nbTestsTotal); // TODO: ???
} else {
   $iScore = 0;
}

$bCompilError = $bCompilError ? 1 : 0;

$stmt = $db->prepare('UPDATE tm_submissions SET nbTestsPassed = :nbTestsPassed, iScore = :iScore, nbTestsTotal = :nbTestsTotal, bCompilError = :bCompilError, sErrorMsg = :sErrorMsg, bEvaluated = \'1\' WHERE id = :sName');
$stmt->execute(array('sName' => $tokenParams['sTaskName'], 'nbTestsPassed' => $nbTestsPassed, 'iScore' => $iScore, 'nbTestsTotal' => $nbTestsTotal, 'bCompilError' => $bCompilError, 'sErrorMsg' => $sErrorMsg));
