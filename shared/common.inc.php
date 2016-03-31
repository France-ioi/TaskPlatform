<?php

require_once "TokenParser.php";
require_once "TokenGenerator.php";

function decodePlatformToken($sToken, $pc_key, $keyName) {
   global $config;
   $tokenParser = new TokenParser($pc_key, $keyName, 'public');
   try {
      $params = $tokenParser->decodeJWS($sToken);
   } catch (Exception $e) {
      if ($config->testMode->active) {
         if (session_status() == PHP_SESSION_NONE) {
             session_start();
         }
         if (!isset($_SESSION['testToken'])) {
            $_SESSION['testToken'] = array(
               'idUser' => $config->testMode->idUser,
               'idItem' => $config->testMode->task_sTextId,
               'bAccessSolutions' => $config->testMode->bAccessSolutions,
               'nbHintsGiven' => $config->testMode->nbHintsGiven);
         }
         $params = $_SESSION['testToken'];
      } else {
         echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
         exit;
      }
   }
   return $params;
}

function getPlatformTokenParams($sToken, $sPlatform, $db) {
   global $config;
   if (!$sPlatform && $config->testMode->active) {
      $sPlatform = $config->testMode->platformName;
   }
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
   if (!isset($params['idUser']) || !isset($params['idItem'])) {
      error_log('missing idUser or idItem in token: '.json_encode($params));
      echo json_encode(array('bSuccess' => false, 'sError' => 'missing idUser or idItem in token'));
      exit;
   }
   $params['idPlatform'] = $platform['ID'];
   $params['idTaskLocal'] = getLocalIdTask($params['idItem'], $db);
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

function getPlatformTokenGenerator() {
   global $config;
   static $tokenGenerator;
   if (!$tokenGenerator) {
      $tokenGenerator = new TokenGenerator($config->platform->private_key, $config->platform->name, null);
   }
   return $tokenGenerator;
}

function generateScoreToken($idItem, $idUser, $idSubmission, $score, $tokenGenerator) {
   $params = [
      'idUser' => $idUser,
      'idItem' => $idItem,
      'sAnswer' => $idSubmission,
      'score' => $score
   ];
   return $tokenGenerator->encodeJWS($params);
}
