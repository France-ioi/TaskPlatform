<?php

require_once __DIR__.'/TokenParser.php';

function getTokenParams($sToken, $sPlatform) {
   global $db, $config;
   $stmt = $db->prepare('select ID, pc_key from tm_platforms where uri = :uri');
   $stmt->execute(array('uri' => $sPlatform));
   $platform = $stmt->fetch();
   if (!$platform) {
      die('cannot find platform '.$sPlatform);
   }
   $pc_key = $platform['pc_key'];
   $tokenParser = new TokenParser($pc_key);
   try {
      $params = $tokenParser->decodeToken($sToken);
   } catch (Exception $e) {
      if ($config->testMode->active) {
         $params = array('idUser' => $config->testMode->idUser, 'idPlatform' => $config->testMode->idPlatform, 'idTask' => $config->testMode->idTask);
      } else {
         die($e->getMessage());
      }
   }
   if (!isset($params['idUser']) || !isset($params['idTask'])) {
      die('missing idUser or idTask in token');
   }
   if (!isset($params['idPlatform'])) {
      $params['idPlatform'] = $platform['ID'];
   }
   return $params;
}

function getSyncRequests ($params)
{
   global $config;
   if (!$config->testMode->active && (!isset($params['sToken']) || !isset($params['sPlatform']))) {
      die('you must set a token and a platform for the synchro to work!');
   }
   $tokenParams = getTokenParams($params['sToken'], $params['sPlatform']);
   $requests = syncGetTablesRequests();

   $requests['tm_source_codes']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_source_codes']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_tasks_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_tasks_tests']['filters']['userOrExample'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_tasks_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_submissions']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_submissions_tests']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions_tests']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_submissions_subtasks']['filters']['user'] = array('values' => array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']));
   $requests['tm_submissions_subtasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   $requests['tm_tasks']['filters']['task'] = array('values' => array('idTask' => $tokenParams['idTask']));

   return $requests;
}
