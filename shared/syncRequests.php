<?php

require_once __DIR__.'/TokenParser.php';
require_once __DIR__.'/TokenGenerator.php';
require_once __DIR__.'/common.inc.php';
require_once __DIR__.'/connect.php';

function generateSubmissionToken($db, &$submission, $answerToken, $tokenParams) {
   // TODO: verify answerToken or $submission['data']->bConfirmed
   $tokenGenerator = getPlatformTokenGenerator();
   $scoreToken = generateScoreToken($submission['data']->idTask, $tokenParams['itemUrl'], $submission['data']->idUser, $submission['data']->ID, $submission['data']->iScore, $tokenGenerator, $submission['data']->idUserAnswer);
   $submission['data']->scoreToken = $scoreToken;
   $submission['data']->idUserAnswer = null;
}

function syncAddCustomServerChanges($db, $minServerVersion, &$serverChanges, &$serverCounts, $params) {
   addSubmissionTokens($db, $minServerVersion, $serverChanges, $serverCounts, $params);
   addTokenParams($db, $minServerVersion, $serverChanges, $serverCounts, $params);
   updateHasSubtasksCache($db, $minServerVersion, $serverChanges, $serverCounts, $params);
}

function addTokenParams($db, $minServerVersion, &$serverChanges, &$serverCounts, $params) {
   if (!isset($serverChanges) || !isset($serverChanges['tm_tasks']) || !isset($params['tokenParams'])) {
      return;
   }
   $bIsEvaluable = $params['tokenParams']['bSubmissionPossible'];
   if ($bIsEvaluable) {
      return;
   }
   if (isset($serverChanges['tm_tasks']['updated']) && count($serverChanges['tm_tasks']['updated'])) {
      foreach ($serverChanges['tm_tasks']['updated'] as $task) {
         $task['data']->bIsEvaluable = false;
      }
   }
   if (isset($serverChanges['tm_tasks']['inserted']) && count($serverChanges['tm_tasks']['inserted'])) {
      foreach ($serverChanges['tm_tasks']['inserted'] as $task) {
         $task['data']->bIsEvaluable = false;
      }
   }
}

function addSubmissionTokens($db, $minServerVersion, &$serverChanges, &$serverCounts, $params) {
   if (!isset($params) || !isset($params['getSubmissionTokenFor']) || !count($params['getSubmissionTokenFor'])) {
      return;
   }
   if (!isset($serverChanges) || !isset($serverChanges['tm_submissions'])) {
      return;
   }
   if (isset($serverChanges['tm_submissions']['updated']) && count($serverChanges['tm_submissions']['updated'])) {
      foreach ($serverChanges['tm_submissions']['updated'] as $submission) {
         if($params['getSubmissionTokenFor'][$submission['data']->ID] && $submission['data']->sMode = 'Submission') {
            generateSubmissionToken($db, $submission, $params['getSubmissionTokenFor'][$submission['data']->ID], $params['tokenParams']);
         }
      }
   }
   if (isset($serverChanges['tm_submissions']['inserted']) && count($serverChanges['tm_submissions']['inserted'])) {
      foreach ($serverChanges['tm_submissions']['inserted'] as $submission) {
         if($params['getSubmissionTokenFor'][$submission['data']->ID] && $submission['data']->sMode = 'Submission') {
            generateSubmissionToken($db, $submission, $params['getSubmissionTokenFor'][$submission['data']->ID], $params['tokenParams']);
         }
      }
   }
}

function updateHasSubtasksCache($db, $minServerVersion, &$serverChanges, &$serverCounts, $params) {
   if(!isset($serverChanges) || !isset($serverChanges['tm_tasks'])) {
      return;
   }
   if(!isset($_SESSION['subtaskCache'])) {
      $_SESSION['subtaskCache'] = [];
   }
   if(isset($serverChanges['tm_tasks']['updated']) && count($serverChanges['tm_tasks']['updated'])) {
      foreach($serverChanges['tm_tasks']['updated'] as $taskID => $task) {
         $_SESSION['subtaskCache'][$taskID] = $task['data']->bHasSubtasks;
      }
   }
   if(isset($serverChanges['tm_tasks']['inserted']) && count($serverChanges['tm_tasks']['inserted'])) {
      foreach($serverChanges['tm_tasks']['inserted'] as $taskID => $task) {
         $_SESSION['subtaskCache'][$taskID] = $task['data']->bHasSubtasks;
      }
   }
}

function myDebugFunction($query, $values, $moment = '') {
   global $db;
   $res = $query;
   foreach ($values as $valueName => $value) {
      $res = str_replace(':'.$valueName, $db->quote($value), $res);
   }
   file_put_contents(__DIR__.'/../logs/debug.log', date(DATE_RFC822).'  '.$moment.' '.$res.";\n", FILE_APPEND);
}

function getSyncRequests (&$params)
{
   global $config, $db;
   if (!$config->testMode->active && (!isset($params['sToken']) || !isset($params['sPlatform']))) {
      die(json_encode(['bSuccess' => false,'sError' => 'you must set a token and a platform for the synchro to work!', 'params' => $params]));
   }
   $tokenParams = getPlatformTokenParams($params['sToken'], $params['sPlatform'], $params['taskId'], $db);
   $params['tokenParams'] = $tokenParams;
   $requests = syncGetTablesRequests(null, false);

   if (!$tokenParams['nbHintsGiven']) {
      $tokenParams['nbHintsGiven'] = 0;
   }

   $requests['tm_hints']['filters']['nbHintsGiven'] = array('values' => array('nbHintsGiven' => $tokenParams['nbHintsGiven']));
   $requests['tm_hints']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   $requests['tm_hints_strings']['filters']['nbHintsGiven'] = array('values' => array('nbHintsGiven' => $tokenParams['nbHintsGiven']));
   $requests['tm_hints_strings']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   if (isset($params['getNewHints']) && $params['getNewHints']) {
      $requests['tm_hints_strings']['minVersion'] = 0;
      $requests['tm_hints']['minVersion'] = 0;
   }

   $requests['tm_recordings']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   $requests['tm_recordings']['model']['fields']['idTask']['imposedWriteValue'] = $tokenParams['idTaskLocal'];
   $requests['tm_recordings']['model']['fields']['idUser']['imposedWriteValue'] = $tokenParams['idUser'];
   $requests['tm_recordings']['model']['fields']['idPlatform']['imposedWriteValue'] = $tokenParams['idPlatform'];
   $requests['tm_recordings']['model']['fields']['sDateCreation']['imposedWriteValue'] = date("Y-m-d H:i:s",time()); ;

   $bAccessSolutions = (isset($tokenParams['bAccessSolutions']) && $tokenParams['bAccessSolutions'] && $tokenParams['bAccessSolutions'] != "0") ? 1 : 0;
   $requests['tm_solutions']['filters']['hasAccessToSolution'] = array('values' => array('hasAccessToSolution' => $bAccessSolutions));
   $requests['tm_solutions']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   $requests['tm_solutions_strings']['filters']['hasAccessToSolution'] = array('values' => array('hasAccessToSolution' => $bAccessSolutions));
   $requests['tm_solutions_strings']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   if (!$bAccessSolutions) {
      if(($key = array_search('sSolution', $requests['tm_tasks_strings']['fields'])) !== false) {
          unset($requests['tm_tasks_strings']['fields'][$key]);
      }
   }

   $requests['tm_source_codes']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_source_codes']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_submissions']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   $requests["tm_submissions"]['model']['fields']['task_sScriptAnimation'] = array('fieldName' => 'sScriptAnimation', 'tableName' => 'tm_tasks');
   array_push($requests["tm_submissions"]['fields'], 'task_sScriptAnimation');

   $requests['tm_submissions_tests']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   $requests["tm_submissions_tests"]['model']['fields']["test_idTask"] = array("tableName" => "tm_tasks_tests", "fieldName" => "idTask");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_idTask');
   $requests["tm_submissions_tests"]['model']['fields']["test_sGroupType"] = array("tableName" => "tm_tasks_tests", "fieldName" => "sGroupType");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_sGroupType');
   $requests["tm_submissions_tests"]['model']['fields']["test_sOutput"] = array("tableName" => "tm_tasks_tests", "fieldName" => "sOutput");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_sOutput');
   $requests["tm_submissions_tests"]['model']['fields']["test_iRank"] = array("tableName" => "tm_tasks_tests", "fieldName" => "iRank");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_iRank');
   $requests["tm_submissions_tests"]['model']['fields']["test_idSubtask"] = array("tableName" => "tm_tasks_tests", "fieldName" => "idSubtask");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_idSubtask');
   // TODO: don't fetch sName if evaluation test
   $requests["tm_submissions_tests"]['model']['fields']["test_sName"] = array("tableName" => "tm_tasks_tests", "fieldName" => "sName");
   array_push($requests["tm_submissions_tests"]['fields'], 'test_sName');

   $requests['tm_tasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   // unperfect way to retrieve nbHintsMax
   $requests["tm_tasks"]['model']['fields']['nbHintsTotal'] = array('groupBy' => '`tm_tasks`.`ID`', 'sql' => 'COALESCE(MAX(`tm_hints`.`iRank`),0)', 'tableName' => 'tm_hints', 'joins' => array('tm_hints'));
   array_push($requests["tm_tasks"]['fields'], 'nbHintsTotal');

   $requests['tm_tasks_limits']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_tasks_strings']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_tasks_tests']['filters']['userOrExample'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_tasks_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   // Only make queries to the subtasks tables if the task actually has
   // subtasks
   $taskHasSubtasks = isset($_SESSION['subtaskCache'][$tokenParams['idTaskLocal']]) ? $_SESSION['subtaskCache'][$tokenParams['idTaskLocal']] : false;
   if($taskHasSubtasks) {
      $requests['tm_submissions_subtasks']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
      $requests['tm_submissions_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

      $requests['tm_tasks_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));
   } else {
      unset($requests['tm_submissions_subtasks']);
      unset($requests['tm_tasks_subtasks']);
   }

   if (isset($params) && isset($params['getSubmissionTokenFor']) && count($params['getSubmissionTokenFor'])) {
      $idSubmission = null;
      foreach($params['getSubmissionTokenFor'] as $idSubmission => $token) {
         // there should be only one...
         $idSubmission = $idSubmission;
      }
      $requests['tm_submissions']['minVersion'] = 0;
      $requests['tm_submissions_tests']['minVersion'] = 0;
      $requests['tm_submissions']['filters']['idSubmission'] = $idSubmission;
      $requests['tm_submissions_tests']['filters']['idSubmission'] = $idSubmission;
      // when synchronizing for a submission, no need to synchronize everything
      // it works only with the asumption that during an evaluation the token didn't change
      // to point to a completely different task
      unset($requests['tm_tasks']);
      unset($requests['tm_tasks_strings']);
      unset($requests['tm_tasks_limits']);
      unset($requests['tm_source_codes']);
   }
   // these tables don't seem to be used
   unset($requests['tm_solutions']);
   unset($requests['tm_solutions_strings']);
   unset($requests['tm_recordings']);
   
   return $requests;
}
