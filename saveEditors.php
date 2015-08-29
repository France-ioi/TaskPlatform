<?php

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if (!$config->testMode->active && (!isset($request['sToken']) || !isset($request['sPlatform']))) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

if (!isset($request['aSources'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sources array.', 'request' => $request));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $db);

function saveSources($params, $sources, $db) {
   $db->exec('delete from tm_source_codes where idUser = '.$db->quote($params['idUser']).' and idTask = '.$db->quote($params['idTaskLocal']).' and idPlatform = '.$db->quote($params['idPlatform']).' and bSubmission = \'0\';');
   if (!count($sources))
      return;
   $query = 'insert into tm_source_codes (idUser, idTask, idPlatform, sDate, sName, sSource, sParams, bActive, iRank) values';
   $rows = array();
   $iRank = 0;
   foreach($sources as $source) {
      $iRank = $iRank + 1;
      $sourceParams = json_encode(array('sLangProg' => $source['sLangProg']));
      $bActive = $source['bActive'] ? 1 : 0;
      $rows[] = '('.$db->quote($params['idUser']).', '.$db->quote($params['idTaskLocal']).', '.$db->quote($params['idPlatform']).', NOW(), '.$db->quote($source['sName']).', '.$db->quote($source['sSource']).', '.$db->quote($sourceParams).', '.$bActive.', '.$iRank.')';
   }
   $query .= implode(', ', $rows);
   $db->exec($query);
}

saveSources($params, $request['aSources'], $db);
echo json_encode(array('bSuccess' => true));
