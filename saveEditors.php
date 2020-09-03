<?php

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if (!$config->testMode->active && (!isset($request['sToken']) || !isset($request['sPlatform']))) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

if (!isset($request['aSources'])) {
   echo json_encode_safe(array('bSuccess' => false, 'sError' => 'missing sources array.', 'request' => $request));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

function saveSources($params, $sources, $db) {
   // Insert / update sources
   $stmt = $db->prepare("SELECT * FROM tm_source_codes WHERE idUser = :idUser AND idTask = :idTask AND idPlatform = :idPlatform AND bSubmission = '0' AND sType = 'User' ORDER BY iRank ASC;");
   $stmt->execute([
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform']]);

   $iRank = 0;
   foreach($sources as $source) {
      $oldSource = $stmt->fetch();
      $sourceParams = json_encode_safe(array('sLangProg' => $source['sLangProg']));
      $bActive = $source['bActive'] ? 1 : 0;

      if($oldSource && ($source['sName'] != $oldSource['sName'] || $source['sSource'] != $oldSource['sSource'] || $sourceParams != $oldSource['sParams'] || $bActive != $oldSource['bActive'] || $iRank != $oldSource['iRank'])) {
         $stmt2 = $db->prepare("UPDATE tm_source_codes SET sDate = NOW(), sName = :sName, sSource = :sSource, sParams = :sParams, bActive = :bActive, iRank = :iRank WHERE ID = :id;");
         $stmt2->execute([
            'sName' => $source['sName'],
            'sSource' => $source['sSource'],
            'sParams' => $sourceParams,
            'bActive' => $bActive,
            'iRank' => $iRank,
            'id' => $oldSource['ID']]);
      } elseif(!$oldSource) {
         $stmt2 = $db->prepare("INSERT INTO tm_source_codes (idUser, idTask, idPlatform, sDate, sName, sSource, sParams, bSubmission, sType, bActive, iRank) VALUES(:idUser, :idTask, :idPlatform, NOW(), :sName, :sSource, :sParams, 0, 'User', :bActive, :iRank);");
         $stmt2->execute([
            'idUser' => $params['idUser'],
            'idTask' => $params['idTaskLocal'],
            'idPlatform' => $params['idPlatform'],
            'sName' => $source['sName'],
            'sSource' => $source['sSource'],
            'sParams' => $sourceParams,
            'bActive' => $bActive,
            'iRank' => $iRank]);
      }
      $iRank += 1;
   }

   // Delete lines which weren't inserted/updated
   $stmt = $db->prepare("DELETE FROM tm_source_codes WHERE idUser = :idUser AND idTask = :idTask AND idPlatform = :idPlatform AND iRank >= :iRank AND bSubmission = '0' AND sType = 'User';");
   $stmt->execute([
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform'],
      'iRank' => $iRank]);
}

function saveTests($params, $tests, $db) {
   // Insert / update user tests
   $stmt = $db->prepare("SELECT * FROM tm_tasks_tests WHERE idUser = :idUser AND idTask = :idTask AND idPlatform = :idPlatform AND sGroupType = 'User' ORDER BY iRank ASC;");
   $stmt->execute([
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform']]);

   $iRank = 0;
   foreach($tests as $test) {
      $oldTest = $stmt->fetch();
      $bActive = $test['bActive'] ? 1 : 0;

      if($oldTest && ($test['sName'] != $oldTest['sName'] || $test['sInput'] != $oldTest['sInput'] || $test['sOutput'] != $oldTest['sOutput'] || $bActive != $oldTest['bActive'] || $iRank != $oldTest['iRank'])) {
         $stmt2 = $db->prepare("UPDATE tm_tasks_tests SET sName = :sName, sInput = :sInput, sOutput = :sOutput, bActive = :bActive, iRank = :iRank WHERE ID = :id;");
         $stmt2->execute([
            'sName' => $test['sName'],
            'sInput' => $test['sInput'],
            'sOutput' => $test['sOutput'],
            'bActive' => $bActive,
            'iRank' => $iRank,
            'id' => $oldTest['ID']]);
      } elseif(!$oldTest) {
         $stmt2 = $db->prepare("INSERT INTO tm_tasks_tests (idUser, idTask, idPlatform, sName, sInput, sOutput, sGroupType, bActive, iRank) VALUES(:idUser, :idTask, :idPlatform, :sName, :sInput, :sOutput, 'User', :bActive, :iRank);");
         $stmt2->execute([
            'idUser' => $params['idUser'],
            'idTask' => $params['idTaskLocal'],
            'idPlatform' => $params['idPlatform'],
            'sName' => $test['sName'],
            'sInput' => $test['sInput'],
            'sOutput' => $test['sOutput'],
            'bActive' => $bActive,
            'iRank' => $iRank]);
      }
      $iRank += 1;
   }

   // Delete lines which weren't inserted/updated
   $stmt = $db->prepare("DELETE FROM tm_tasks_tests WHERE idUser = :idUser AND idTask = :idTask AND idPlatform = :idPlatform AND iRank >= :iRank AND sGroupType = 'User';");
   $stmt->execute([
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform'],
      'iRank' => $iRank]);
}


saveSources($params, $request['aSources'], $db);
if($request['aTests'] !== null) {
   saveTests($params, $request['aTests'], $db);
}
echo json_encode(array('bSuccess' => true));
