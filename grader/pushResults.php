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
   exit();
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
$stmt =$db->prepare('SELECT tm_tasks.*, tm_submissions.sReturnUrl, tm_submissions.sMode, tm_submissions.idUser from tm_tasks
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

$stmt = $db->query("SELECT iVersion FROM `synchro_version`");
$iVersion = $stmt->fetchColumn();

$nbTestsPassed = 0;
$iScoreTotal = 0;
$nbTestsTotal = 0;
$bCompilError = false;
$sCompilMsg = isset($graderResults['solutions'][0]['compilationExecution']['stderr']) ? $graderResults['solutions'][0]['compilationExecution']['stderr']['data'] : '';
$sErrorMsg = '';
$iScore = 0;

function getRandomID() {
   $rand = (string) mt_rand(100000, 999999999);
   $rand .= (string) mt_rand(1000000, 999999999);
   return $rand;
}

function createNewTest($idSubmission, $testName) {
   global $testsByName, $db, $iVersion;
   // get maxRank:
   $stmt =$db->prepare('SELECT MAX(tm_tasks_tests.iRank) from tm_tasks_tests 
   JOIN tm_submissions ON tm_submissions.idTask = tm_tasks_tests.idTask 
   WHERE tm_submissions.ID = :idSubmission and tm_tasks_tests.sGroupType = \'Evaluation\';');
   $stmt->execute(['idSubmission' => $idSubmission]);
   $maxRank = $stmt->fetchColumn();
   $stmt =$db->prepare('SELECT tm_submissions.idTask from tm_submissions WHERE tm_submissions.ID = :idSubmission;');
   $stmt->execute(['idSubmission' => $idSubmission]);
   $idTask = $stmt->fetchColumn();
   if (!$maxRank) {
      $maxRank = 0;
   }
   $stmt = $db->prepare('INSERT INTO tm_tasks_tests (ID, idTask, sGroupType, iRank, bActive, sName, iVersion) values (:ID, :idTask, \'Evaluation\', :iRank, 1, :sName, :iVersion)');
   $ID = getRandomID();
   $stmt->execute(['ID' => $ID, 'idTask' => $idTask, 'iRank' => $maxRank+1, 'sName' => $testName, 'iVersion' => $iVersion]);
   $testsByName[$testName] = [
      'sName' => $testName,
      'ID' => $ID,
      'sGroupType' => 'Evaluation',
      'iRank' => $maxRank+1,
      'sOutput' => '',
      'iVersion' => $iVersion
   ];
}


if ($task['bTestMode']) {

   $sCompilMsg = '';
   $nbTestsFailedTotal = 0;
   $invalidTests = [];
   foreach ($graderResults['executions'] as $execution) {
      $nbTestsTotal = $nbTestsTotal + 1;
      if (!isset($testsByName[$execution['name']])) {
         createNewTest($tokenParams['sTaskName'], $execution['name']);
      }
      $test = $testsByName[$execution['name']];
      $nbTestFailed = 0;
      foreach ($execution['testsReports'] as $testReport) {
         $testName = substr($testReport['name'], 5);
         if (!isset($testReport['checker'])) {
            if (!isset($invalidTests[$testName])) {
               $invalidTests[$testName] = true;
               $bCompilError = true;
               $thisCompilMsg = $testReport['sanitizer']['stdout']['data'];
               $sCompilMsg .= "\nErreur dans le test ".$testName.":\n".$thisCompilMsg;
            }
         } else {
            $outData = $testReport['checker']['stdout']["data"];
            $indexNL = strpos($outData, "\n");
            if (!$indexNL) {
               $iScore = intval($outData);
            } else {
               $iScore = intval(substr($outData, 0, $indexNL));
            }
            if ($iScore == '0') {
               $nbTestFailed += 1;
            }
         }
      }
      if ($nbTestFailed) {
         $nbTestsFailedTotal = $nbTestsFailedTotal + 1;
         $iScore = 100;
         $iErrorCode = 0;
         $sLog = $nbTestFailed.' de vos tests permet'.(($nbTestFailed>1)?'tent':'').' de détecter l\'erreur de cette solution.';
      } else {
         $iScore = 0;
         $iErrorCode = 1;
         $sLog = 'Aucun de vos tests ne permet de détecter l\'erreur de cette solution.';
      }
      $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, iErrorCode, idTest, iScore, sLog, iVersion) values (:idSubmission, :iErrorCode, :idTest, :iScore, :sLog, :iVersion);');
      $stmt->execute(array(
         'idSubmission' => $tokenParams['sTaskName'], 
         'idTest' => $test['ID'], 
         'iScore' => $iScore, 
         'iErrorCode' => $iErrorCode, 
         'sLog' => $sLog,
         'iVersion' => $iVersion
      ));
   }
   $iScore = 100 * $nbTestsFailedTotal / $nbTestsTotal;
   $bSuccess = ($nbTestsFailedTotal == $nbTestsTotal);

   $stmt = $db->prepare('UPDATE tm_submissions SET nbTestsPassed = :nbTestsPassed, iScore = :iScore, nbTestsTotal = :nbTestsTotal, bCompilError = :bCompilError, bSuccess = :bSuccess, sCompilMsg = :sCompilMsg, sErrorMsg = :sErrorMsg, bEvaluated = \'1\' WHERE id = :sName');
   $stmt->execute(array('sName' => $tokenParams['sTaskName'], 'nbTestsPassed' => $nbTestsFailedTotal, 'iScore' => $iScore, 'nbTestsTotal' => $nbTestsTotal, 'bCompilError' => $bCompilError, 'sErrorMsg' => '', 'sCompilMsg' => $sCompilMsg, 'bSuccess' => $bSuccess));

} else {

   // TODO: handle subtasks (currently no substask is used)

   $minScoreToValidateTest = intval($task['iTestsMinSuccessScore']);

   if ($graderResults['solutions'][0]['compilationExecution']['exitCode'] != 0) {
      $bCompilError = true;
   } else {
      // there are as many executions as there are sources to evaluate, so here
      // we use only one:
      foreach ($graderResults['executions'][0]['testsReports'] as $testReport) {
         $nbTestsTotal = $nbTestsTotal + 1;
         if (!isset($testsByName[$testReport['name']])) {
            if (substr($testReport['name'], 0, 3) == 'id-') {
               error_log('cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']);
               echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find test '.$testReport['name'].'for submission '.$tokenParams['sTaskName']));
               exit;
            }
            createNewTest($tokenParams['sTaskName'], $testReport['name']);
         }
         $test = $testsByName[$testReport['name']];
         $iErrorCode = $testReport['execution']['exitSig'];
         if (!$iErrorCode) {$iErrorCode = 1;}
         if (!isset($testReport['checker'])) {
            if (isset($testReport['execution'])) {
               $bCompilError = true;
               $sErrorMsg = $testReport['execution']['stderr']['data'];
               $sCompilMsg = $testReport['execution']['stderr']['data'];
               // test produces an error in the code
               $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, idTest, iScore, iTimeMs, iMemoryKb, iErrorCode, sErrorMsg, sExpectedOutput, iVersion) values (:idSubmission, :idTest, :iScore, :iTimeMs, :iMemoryKb, :iErrorCode, :sErrorMsg, :sExpectedOutput, :iVersion);');
               $stmt->execute(array('idSubmission' => $tokenParams['sTaskName'], 'idTest' => $test['ID'], 'iScore' => 0, 'iTimeMs' => $testReport['execution']['timeTakenMs'], 'iMemoryKb' => $testReport['execution']['memoryUsedKb'], 'iErrorCode' => $iErrorCode, 'sExpectedOutput' => $test['sOutput'], 'sErrorMsg' => $testReport['execution']['stderr']['data'], 'iVersion' => $iVersion));
            } else {
               $sErrorMsg = $testReport['sanitizer']['stderr']['data'];
               break; // TODO: ?
            }
         } else {
            $outData = $testReport['checker']['stdout']["data"];
            $indexNL = strpos($outData, "\n");
            if (!$indexNL) {
               $iScore = intval($outData);
               $testLog = '';
            } else {
               $iScore = intval(substr($outData, 0, $indexNL)); // TODO: make a score field in the json
               $testLog = substr($outData, $indexNL+1); // TODO: make a score field in the json
            }
            $files = json_encode($testReport['checker']['files']);
            if ($iScore >= $minScoreToValidateTest) {
               $nbTestsPassed = $nbTestsPassed + 1;
               $iErrorCode = 0;
            } else {
               $iErrorCode = 1;
            }
            $iScoreTotal = $iScoreTotal + $iScore;
            $sOutput = rtrim($testReport['execution']['stdout']["data"]);
            $stmt = $db->prepare('insert ignore into tm_submissions_tests (idSubmission, idTest, iScore, iTimeMs, iMemoryKb, iErrorCode, sOutput, sExpectedOutput, sErrorMsg, sLog, jFiles, iVersion) values (:idSubmission, :idTest, :iScore, :iTimeMs, :iMemoryKb, :iErrorCode, :sOutput, :sExpectedOutput, :sErrorMsg, :sLog, :jFiles, :iVersion);');
            $stmt->execute(array(
               'idSubmission' => $tokenParams['sTaskName'], 
               'idTest' => $test['ID'], 
               'iScore' => $iScore, 
               'iTimeMs' => $testReport['execution']['timeTakenMs'], 
               'iMemoryKb' => $testReport['execution']['memoryUsedKb'], 
               'iErrorCode' => $iErrorCode,
               'sOutput' => $sOutput, 
               'sExpectedOutput' => $test['sOutput'], 
               'sErrorMsg' => $testReport['execution']['stderr']['data'], 
               'sLog' => $testLog,
               'jFiles' => $files,
               'iVersion' => $iVersion
            ));
         }
      }
      if ($nbTestsTotal) {
         $iScore = round($iScoreTotal / $nbTestsTotal); // TODO: ???
      } else {
         $iScore = 0;
      }
   }

   $bSuccess = ($iScore > 99);

   $stmt = $db->prepare('UPDATE tm_submissions SET nbTestsPassed = :nbTestsPassed, iScore = :iScore, nbTestsTotal = :nbTestsTotal, bCompilError = :bCompilError, bSuccess = :bSuccess, sCompilMsg = :sCompilMsg, sErrorMsg = :sErrorMsg, bEvaluated = \'1\', iVersion = :iVersion WHERE id = :sName');
   $stmt->execute(array('sName' => $tokenParams['sTaskName'], 'nbTestsPassed' => $nbTestsPassed, 'iScore' => $iScore, 'nbTestsTotal' => $nbTestsTotal, 'bCompilError' => $bCompilError, 'sErrorMsg' => $sErrorMsg, 'sCompilMsg' => $sCompilMsg, 'bSuccess' => $bSuccess, 'iVersion' => $iVersion));
}

function sendResultsToReturnUrl($idItem, $idUser, $score, $idSubmission, $returnUrl, $itemUrl) {
   global $db;
   $tokenGenerator = getPlatformTokenGenerator();
   $scoreToken = generateScoreToken($idItem, $itemUrl, $idUser, $idSubmission, $score, $tokenGenerator);
   $db = null;
   $postParams = [
      'action' => 'graderReturn',
      'score' => $score,
      'message' => '',
      'scoreToken' => $scoreToken
   ];
   // TODO: what should the command return?
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $returnUrl);
   curl_setopt($ch, CURLOPT_POST, 1);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
   curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postParams));
   $result = curl_exec($ch);
   curl_close ($ch);
   try {
      $resObj = json_decode($result, true);
   } catch (Exception $e) {
      error_log('cannot parse output of returnUrl '.$returnUrl.': '.$result);
      die();
   }
   if (isset($resObj['success']) && !$resObj['success']) {
      error_log('error from returnUrl '.$returnUrl.': '.$resObj['error']);
   }
}

// TODO: make it transit through graderqueue
$itemUrl = $config->baseUrl.'task.html?taskId='.$task['ID'];

if ($task['sReturnUrl'] && $task['sMode'] != 'UserTest') {
   sendResultsToReturnUrl($task['sTextId'], $task['idUser'], $iScore, $tokenParams['sTaskName'], $task['sReturnUrl'], $itemUrl);
}

echo json_encode(array('bSuccess' => true));
