<?php

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if (!$config->testMode->active && (!isset($request['sToken']) || !isset($request['sPlatform']))) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

function saveSources($params, $sources, $db) {
   $db->exec('delete from tm_source_codes where idUser = '.$db->quote($params['idUser']).' and idTask = '.$db->quote($params['idTaskLocal']).' and idPlatform = '.$db->quote($params['idPlatform']).' and bSubmission = \'0\';');
   if (!count($sources))
      return;
   $query = 'insert into tm_source_codes (idUser, idTask, idPlatform, sDate, sName, sSource, sParams, sType, bActive, iRank) values';
   $rows = array();
   $iRank = 0;
   foreach($sources as $source) {
      $iRank = $iRank + 1;
      $sourceParams = json_encode_safe(array('sLangProg' => $source['sLangProg']));
      $bActive = $source['bActive'] ? 1 : 0;
      $rows[] = '('.$db->quote($params['idUser']).', '.$db->quote($params['idTaskLocal']).', '.$db->quote($params['idPlatform']).', NOW(), '.$db->quote($source['sName']).', '.$db->quote($source['sSource']).', '.$db->quote($sourceParams).', \'User\', '.$bActive.', '.$iRank.')';
   }
   $query .= implode(', ', $rows);
   $db->exec($query);
}

function saveTests($params, $tests, $db) {
      $db->exec('delete from tm_tasks_tests where sGroupType = \'User\' and idUser = '.$db->quote($params['idUser']).' and idTask = '.$db->quote($params['idTaskLocal']).' and idPlatform = '.$db->quote($params['idPlatform']));
      if (!count($tests))
         return;
      $query = 'insert into tm_tasks_tests (idUser, idTask, idPlatform, sName, iRank, bActive, sGroupType, sInput, sOutput) values';
      $rows = array();
      // rank 0 is for example
      $iRank = 0;
      foreach($tests as $test) {
         $iRank = $iRank + 1;
         $bActive = $test['bActive'] ? 1 : 0;
         if (0 === strpos($test['sName'], 'Example')) continue; // example tests
         $rows[] = '('.$db->quote($params['idUser']).', '.$db->quote($params['idTaskLocal']).', '.$db->quote($params['idPlatform']).', '.$db->quote($test['sName']).', '.$iRank.', '.$db->quote($test['bActive']).', \'User\', '.$db->quote($test['sInput']).', '.$db->quote($test['sOutput']).')';
      }
      if (!count($rows))
         return;
      $query .= implode(', ', $rows);
      $db->exec($query);
}

function listItems($params, $db) {
   $stmt = $db->prepare("
      SELECT history_tm_source_codes.*, tm_submissions.iScore
      FROM history_tm_source_codes
      LEFT JOIN tm_submissions ON tm_submissions.ID = history_tm_source_codes.sName
      WHERE history_tm_source_codes.idUser = :idUser
        AND history_tm_source_codes.idTask = :idTask
        AND history_tm_source_codes.idPlatform = :idPlatform
        AND bDeleted = 0
        AND (iNextVersion != history_tm_source_codes.iVersion OR iNextVersion IS NULL)
        AND sSource != ''
      ORDER BY sDate DESC;");
   $stmt->execute(['idUser' => $params['idUser'], 'idTask' => $params['idTaskLocal'], 'idPlatform' => $params['idPlatform']]);
   $historyItems = array();
   $sourcesSeen = [];
   while($row = $stmt->fetch()) {
      $item = [
         'ID' => $row['historyID'],
         'date' => $row['sDate'],
         'name' => $row['sName'],
         'length' => strlen($row['sSource']),
         'submission' => $row['bSubmission'] == 1,
         'score' => $row['iScore'],
         'lang' => 'inconnu'
         ];
      try {
         $itemParams = json_decode($row['sParams'], true);
         $item['lang'] = $itemParams['sLangProg'];
      } catch(Exception $e) {}
      if(isset($sourcesSeen[$row['bSubmission'] . '-' . $item['lang'] . ':' . $row['sSource']])) { continue; }
      $sourcesSeen[$row['bSubmission'] . '-' . $item['lang'] . ':' . $row['sSource']] = true;
      $historyItems[] = $item;
   }
   echo json_encode(['bSuccess' => true, 'historyItems' => $historyItems]);
}

function loadItem($params, $db, $idItem) {
   $stmt = $db->prepare("
      SELECT *
      FROM history_tm_source_codes
      WHERE idUser = :idUser
        AND idTask = :idTask
        AND idPlatform = :idPlatform
        AND historyID = :idItem;");
   $stmt->execute(['idUser' => $params['idUser'], 'idTask' => $params['idTaskLocal'], 'idPlatform' => $params['idPlatform'], 'idItem' => $idItem]);
   $row = $stmt->fetch();
   if($row) {
      $lang = 'c';
      try {
         $itemParams = json_decode($row['sParams'], true);
         $lang = $itemParams['sLangProg'];
      } catch(Exception $e) {}
      echo json_encode(['bSuccess' => true, 'name' => $row['sName'], 'lang' => $lang, 'source' => $row['sSource']]);
   } else {
      echo json_encode(['bSuccess' => false, 'sError' => 'item not found.']);
   }
}

if($request['action'] == 'list') {
   listItems($params, $db);
} elseif($request['action'] == 'load') {
   loadItem($params, $db, $request['idItem']);
} else {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing action.'));
}
