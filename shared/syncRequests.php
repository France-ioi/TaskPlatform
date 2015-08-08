<?php

require_once __DIR__.'/TokenParser.php';
require_once __DIR__.'/common.inc.php';
require_once __DIR__.'/connect.php';

function getSyncRequests ($params)
{
   global $config, $db;
   if (!$config->testMode->active && (!isset($params['sToken']) || !isset($params['sPlatform']))) {
      die('you must set a token and a platform for the synchro to work!');
   }
   $tokenParams = getPlatformTokenParams($params['sToken'], $params['sPlatform'], $db);
   $requests = syncGetTablesRequests();

   $requests['tm_source_codes']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_source_codes']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_tasks_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_tasks_tests']['filters']['userOrExample'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_tasks_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_submissions']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_submissions_tests']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_submissions_subtasks']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   $requests['tm_tasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTaskLocal']));

   return $requests;
}
