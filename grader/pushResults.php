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
$stmt =$db->prepare('SELECT tm_tasks.*, tm_submissions.sReturnUrl, tm_submissions.idUser from tm_tasks
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
$stmt =$db->prepare('SELECT tm_tasks_tests.sName, tm_tasks_tests.ID, tm_tasks_tests.sGroupType, tm_tasks_tests.iRank, tm_tasks_tests.sOutput from tm_tasks_tests 
   JOIN tm_submissions ON tm_submissions.idTask = tm_tasks_tests.idTask 
   WHERE tm_submissions.ID = :idSubmission and ((tm_tasks_tests.sGroupType = \'Evaluation\' or tm_tasks_tests.sGroupType = \'Submission\') or (tm_tasks_tests.sGroupType = \'User\' and tm_tasks_tests.idUser = tm_submissions.idUser and tm_tasks_tests.idPlatform = tm_submissions.idPlatform));');
$stmt->execute(array('idSubmission' => $tokenParams['sTaskName']));
$allTests = $stmt->fetchAll();
$testsByName = array();

// This is a bit odd: when submitting answer for evaluation, the resulting
// json contains the names of the tests, but when the submission is with user tests,
// it contains names like id-xxx where xxx is the ID of the tm_task_test
foreach ($allTests as $test) {
   if ($test['sGroupType'] == 'Submission') {
      $testsByName['id-'.$test['ID']] = $test;
   } else {
      $testsByName[$test['sName']] = $test;
   }
}

$graderResults = $tokenParams['sResultData'];

//file_put_contents('/tmp/json', json_encode($tokenParams));
//file_put_contents('/tmp/tests', json_encode($allTests));

$nbTestsPassed = 0;
$iScoreTotal = 0;
$nbTestsTotal = 0;
$bCompilError = false;
$sCompilMsg = isset($graderResults['solutions'][0]['compilationExecution']['stderr']) ? $graderResults['solutions'][0]['compilationExecution']['stderr']['data'] : '';
$sErrorMsg = '';
$iScore = 0;


// TODO: handle subtasks (currently no substask is used)

$minScoreToValidateTest = intval($task['iTestsMinSuccessScore']);

if ($graderResults['solutions'][0]['compilationExecution']['exitCode'] != 0) {
   $bCompilError = true;
} else {
   // there are as many executions as there are sources to evaluate, so here
   // we use only one:
   foreach ($graderResults['executions'][0]['testsReports'] as $testReport) {
      $nbTestsTotal = $nbTestsTotal + 1;
      $test = $testsByName[$testReport['name']];
      if (!$test) {
         error_log('cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']);
         echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']));
         exit;
      }
      if (!isset($testReport['checker'])) {
         $iErrorCode = 6;
         if (isset($testReport['execution'])) {
            // test produces an error in the code
            $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, idTest, iScore, iTimeMs, iMemoryKb, iErrorCode, sErrorMsg, sExpectedOutput) values (:idSubmission, :idTest, :iScore, :iTimeMs, :iMemoryKb, :iErrorCode, :sErrorMsg, :sExpectedOutput);');
            $stmt->execute(array('idSubmission' => $tokenParams['sTaskName'], 'idTest' => $test['ID'], 'iScore' => 0, 'iTimeMs' => $testReport['execution']['timeTakenMs'], 'iMemoryKb' => $testReport['execution']['memoryUsedKb'], 'iErrorCode' => $iErrorCode, 'sExpectedOutput' => $test['sOutput'], 'sErrorMsg' => $testReport['execution']['stderr']['data']));
         } else {
            $sErrorMessage = $testReport['sanitizer']['stderr']['data'];
            break; // TODO: ?
         }
      } else {
         $iScore = intval(strtok($testReport['checker']['stdout']["data"], "\n")); // TODO: make a score field in the json
         $iErrorCode = $testReport['checker']['exitSig'];
         if ($iScore >= $minScoreToValidateTest) {
            $nbTestsPassed = $nbTestsPassed + 1;
         } else if ($iErrorCode == 0) {
            $iErrorCode = 1;
         }
         $iScoreTotal = $iScoreTotal + $iScore;
         $sOutput = rtrim($testReport['execution']['stdout']["data"]);
         $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, idTest, iScore, iTimeMs, iMemoryKb, iErrorCode, sOutput, sExpectedOutput, sErrorMsg) values (:idSubmission, :idTest, :iScore, :iTimeMs, :iMemoryKb, :iErrorCode, :sOutput, :sExpectedOutput, :sErrorMsg);');
         $stmt->execute(array('idSubmission' => $tokenParams['sTaskName'], 'idTest' => $test['ID'], 'iScore' => $iScore, 'iTimeMs' => $testReport['execution']['timeTakenMs'], 'iMemoryKb' => $testReport['execution']['memoryUsedKb'], 'iErrorCode' => $iErrorCode, 'sOutput' => $sOutput, 'sExpectedOutput' => $test['sOutput'], 'sErrorMsg' => $testReport['execution']['stderr']['data']));
      }
   }
   if ($nbTestsTotal) {
      $iScore = round($iScoreTotal / $nbTestsTotal); // TODO: ???
   } else {
      $iScore = 0;
   }
}

$stmt = $db->prepare('UPDATE tm_submissions SET nbTestsPassed = :nbTestsPassed, iScore = :iScore, nbTestsTotal = :nbTestsTotal, bCompilError = :bCompilError, sCompilMsg = :sCompilMsg, sErrorMsg = :sErrorMsg, bEvaluated = \'1\' WHERE id = :sName');
$stmt->execute(array('sName' => $tokenParams['sTaskName'], 'nbTestsPassed' => $nbTestsPassed, 'iScore' => $iScore, 'nbTestsTotal' => $nbTestsTotal, 'bCompilError' => $bCompilError, 'sErrorMsg' => $sErrorMsg, 'sCompilMsg' => $sCompilMsg));

function sendResultsToReturnUrl($idItem, $idUser, $score, $idSubmission, $returnUrl) {
   $tokenGenerator = getPlatformTokenGenerator();
   $scoreToken = generateScoreToken($idItem, $idUser, $idSubmission, $score, $tokenGenerator);
   $postParams = [
      'action' => 'graderReturn',
      'score' => $score,
      'message' => '',
      'scoreToken' => $scoreToken
   ]
   // TODO: what should the command return?
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $returnUrl);
   curl_setopt($ch, CURLOPT_POST, 1);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
   curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postParams));
   curl_close ($ch);
}

if ($task['sReturnUrl']) {
   sendResultsToReturnUrl($task['sTextId'], $task['idUser'], $iScore, $tokenParams['sTaskName'], $task['sReturnUrl']);
}

echo json_encode(array('bSuccess' => true));
