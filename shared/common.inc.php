<?php

require_once "TokenParser.php";

function decodePlatformToken($sToken, $pc_key, $keyName) {
   global $config;
   $tokenParser = new TokenParser($pc_key, $keyName, 'public');
   try {
      $params = $tokenParser->decodeJWS($sToken);
   } catch (Exception $e) {
      if ($config->testMode->active) {
         $params = array('idUser' => $config->testMode->idUser, 'idPlatform' => $config->testMode->idPlatform, 'idTask' => $config->testMode->task_sTextId);
      } else {
         echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
         exit;
      }
   }
   return $params;
}

function getPlatformTokenParams($sToken, $sPlatform, $db) {
   $stmt = $db->prepare('select ID, public_key from tm_platforms where name = :name');
   $stmt->execute(array('name' => $sPlatform));
   $platform = $stmt->fetch();
   if (!$platform) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find platform '.$sPlatform));
      exit;
   }
   $pc_key = $platform['public_key'];
   try {
      // see API documentation, JWT key name = sPlatform get variable
      $params = decodePlatformToken($sToken, $pc_key, $sPlatform);
   } catch (Exception $e) {
      echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
      exit;
   }
   if (!isset($params['idUser']) || !isset($params['idTask'])) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'missing idUser or idTask in token'));
      exit;
   }
   $params['idPlatform'] = $platform['ID'];
   $params['idTaskLocal'] = getLocalIdTask($params['idTask'], $db);
   return $params;
}

function getLocalIdTask($textId, $db) {
   $stmt = $db->prepare('select ID from tm_tasks where sTextId = :textId');
   $stmt->execute(array('textId' => $textId));
   $idTask = $stmt->fetchColumn();
   if (!$idTask) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find task '.$textId));
      exit;
   }
   return $idTask;
}
