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

function saveTests($params, $tests, $db) {
      $db->exec('delete from tm_tasks_tests where sGroupType = \'User\' and idUser = '.$db->quote($params['idUser']).' and idTask = '.$db->quote($params['idTaskLocal']).' and idPlatform = '.$db->quote($params['idPlatform']));
      if (!count($tests))
         return;
      $query = 'insert into tm_tasks_tests (idUser, idTask, idPlatform, sName, iRank, sGroupType, sInput, sOutput) values';
      $rows = array();
      // rank 0 is for example
      $iRank = 1;
      foreach($tests as $test) {
         $iRank = $iRank + 1;
         $bActive = $test['bActive'] ? 1 : 0;
         if (0 === strpos($string2, 'Example')) continue; // example tests
         $rows[] = '('.$db->quote($params['idUser']).', '.$db->quote($params['idTaskLocal']).', '.$db->quote($params['idPlatform']).', '.$db->quote($test['sName']).', '.$iRank.', \'User\', '.$db->quote($test['sInput']).', '.$db->quote($test['sOutput']).')';
      }
      if (!count($rows))
         return;
      $query .= implode(', ', $rows);
      $db->exec($query);
}


saveSources($params, $request['aSources'], $db);
saveTests($params, $request['aTests'], $db);
echo json_encode(array('bSuccess' => true));
