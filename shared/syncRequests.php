<?php

require_once __DIR__.'/TokenParser.php';

function getTokenParams($sToken, $sPlatform) {
   global $db;
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
      die($e->getMessage());
   }
   if (!isset($params['idUser']) || !isset($params['idTask'])) {
      die('missing idUser or idTask in token');
   }
   $params['idPlatform'] = $platform['ID'];
   return $params;
}

function getSyncRequests ($params)
{
   if (!isset($params['sToken']) || !isset($params['sPlatform'])) {
      die('you must set a token and a platform for the synchro to work!');
   }
   $tokenParams = getTokenParams($params['sToken'], $params['sPlatform']);
   $requests = syncGetTablesRequests();

   $requests['tm_source_codes']['filters']['user'] = array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']);
   $requests['tm_source_codes']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   $requests['tm_tasks_subtasks']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   $requests['tm_tasks_tests']['filters']['userOrExample'] = array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']);
   $requests['tm_tasks_tests']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   $requests['tm_submissions']['filters']['user'] = array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']);
   $requests['tm_submissions']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   $requests['tm_submissions_tests']['filters']['user'] = array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']);
   $requests['tm_submissions_tests']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   $requests['tm_submissions_subtasks']['filters']['user'] = array('idUser' => $tokenParams['idUser'], 'idPlatform' => $tokenParams['idPlatform']);
   $requests['tm_submissions_subtasks']['filters']['task'] = array('idTask' => $tokenParams['idTask']);

   return $requests;

}
