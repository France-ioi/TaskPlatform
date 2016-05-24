<?php

require_once "TokenParser.php";
require_once "TokenGenerator.php";

function decodePlatformToken($sToken, $pc_key, $keyName, $askedTaskId) {
   global $config;
   $tokenParser = new TokenParser($pc_key, $keyName, 'public');
   try {
      $params = $tokenParser->decodeJWS($sToken);
   } catch (Exception $e) {
      if ($config->testMode->active) {
         if (session_status() == PHP_SESSION_NONE) {
             session_start();
         }
         if (!$askedTaskId) {
            $askedTaskId = $config->testMode->defaultTaskId;
         }
         if (!isset($_SESSION['testToken']) || (
               $_SESSION['testToken']['idUser'] != $config->testMode->idUser ||
               $_SESSION['testToken']['idTaskLocal'] != $askedTaskId
               )) {
            $_SESSION['testToken'] = array(
               'idUser' => $config->testMode->idUser,
               'idTaskLocal' => $askedTaskId,
               'itemUrl' => $config->baseUrl.'?taskId='.$askedTaskId,
               'bAccessSolutions' => $config->testMode->bAccessSolutions,
               'nbHintsGiven' => $config->testMode->nbHintsGiven);
            error_log('debug0');
            }
         $params = $_SESSION['testToken'];
      } else {
         echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
         exit;
      }
   }
   return $params;
}

function getPlatformTokenParams($sToken, $sPlatform, $taskId, $db) {
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
      $params = decodePlatformToken($sToken, $pc_key, $sPlatform, $taskId);
   } catch (Exception $e) {
      echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
      exit;
   }
   if (!isset($params['idUser']) || (!isset($params['idItem']) && !isset($params['itemUrl']))) {
      error_log('missing idUser or idItem in token: '.json_encode($params));
      echo json_encode(array('bSuccess' => false, 'sError' => 'missing idUser or idItem and itemUrl in token'));
      exit;
   }
   $params['idPlatform'] = $platform['ID'];
   if (!isset($params['idTaskLocal']) || !$params['idTaskLocal']) {
      $params['idTaskLocal'] = getLocalIdTask($params, $db);   
   }
   return $params;
}

function getIdFromUrl($itemUrl) {
   $query = parse_url($itemUrl, PHP_URL_QUERY);
   if (!$query) return null;
   parse_str($query, $params); // MY GOSH...
   if (!isset($params['taskId'])) return null;
   return intval($params['taskId']);
}

function getLocalIdTask($params, $db) {
   $idItem = isset($params['idItem']) ? $params['idItem'] : null;
   $itemUrl = isset($params['itemUrl']) ? $params['itemUrl'] : null;
   if ($itemUrl) {
      $id = getIdFromUrl($itemUrl);
      if (!$id) {
         die(json_encode(array('bSuccess' => false, 'sError' => 'cannot find ID in url '.$itemUrl)));
      }
      return $id;
   }
   $stmt = $db->prepare('select ID from tm_tasks where sTextId = :textId');
   $stmt->execute(array('textId' => $idItem));
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
   global $config;
   $params = [
      'idUser' => $idUser,
      'idItem' => $idItem,
      'itemUrl' => $config->baseUrl.'?taskId='.$idItem,
      'sAnswer' => $idSubmission,
      'score' => $score
   ];
   return $tokenGenerator->encodeJWS($params);
}
