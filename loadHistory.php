<?php

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if (!$config->testMode->active && (!isset($request['sToken']) || !isset($request['sPlatform']))) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

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
