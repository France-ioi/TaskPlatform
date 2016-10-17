<?php

require_once "connect.php";
require_once "TokenParser.php";
require_once "TokenGenerator.php";

if(!function_exists('array_utf8')) {
    function array_utf8($data) {
        // Can't use array_walk_recursive when there are objects in the array
        if (is_array($data) || is_object($data)) {
            $newdata = array();
            foreach((array) $data as $key => $val) {
                $newdata[$key] = array_utf8($val);
            }
            return $newdata;
        } elseif (is_string($data)) {
            return mb_convert_encoding($data, 'UTF-8', 'UTF-8');
        } else {
            return $data;
        }
    }
}

if(!function_exists('json_encode_safe')) {
    function json_encode_safe($data) {
        // If json_encode doesn't work, try again removing all invalid UTF-8
        // characters
        $result = '';

        try {
            $result = json_encode($data);
        } catch (Exception $e) {}

        if ($result == '') {
            $result = json_encode(array_utf8($data));
        }
        return $result;
    }
}

function checkLongToken($params, $platformID) {
   global $db;
   $stmt = $db->prepare('select sRemoteSecret from tm_remote_secret where idUser = :idUser and idPlatform = :idPlatform;');
   $stmt->execute(['idUser' => $params['idUser'], 'idPlatform' => $platformID]);
   $remoteSecret = $stmt->fetchColumn();
   if (!$remoteSecret) {
      die(json_encode(['bSuccess' => false, 'sError' => 'cannot find secret for user '.$params['idUser'].' and platform '.$platformID]));
   }
   if ($remoteSecret != $params['secret']) {
      die(json_encode(['bSuccess' => false, 'sError' => 'remote secret does not match for user '.$params['idUser'].' and platform '.$platformID]));
   }
}

function decodePlatformToken($sToken, $pc_key, $keyName, $askedTaskId, $sPlatform) {
   global $config;
   $tokenParser = new TokenParser($pc_key, $keyName, 'public');
   try {
      $params = $tokenParser->decodeJWS($sToken);
      if (isset($params['type']) && $params['type'] == 'long') {
         checkLongToken($params, $sPlatform['ID']);
      }
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
               'bSubmissionPossible' => true,
               'idTaskLocal' => $askedTaskId,
               'itemUrl' => $config->baseUrl.'?taskId='.$askedTaskId,
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
      $params = decodePlatformToken($sToken, $pc_key, $sPlatform, $taskId, $platform);
   } catch (Exception $e) {
      echo json_encode(array('bSuccess' => false, 'sError' => $e->getMessage()));
      exit;
   }
   if (!isset($params['idUser']) || (!isset($params['idItem']) && !isset($params['itemUrl']))) {
      error_log('missing idUser or idItem in token: '.json_encode_safe($params));
      echo json_encode(array('bSuccess' => false, 'sError' => 'missing idUser or idItem and itemUrl in token'));
      exit;
   }
   $params['idPlatform'] = $platform['ID'];
   $params['idTaskLocal'] = getLocalIdTask($params, $db);   
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

function getScoreTokenAnswer($idSubmission) {
   global $db;
   $stmt = $db->prepare('select tm_source_codes.* from tm_source_codes join tm_submissions on tm_submissions.idSourceCode = tm_source_codes.ID and tm_submissions.ID = :idSubmission;');
   $stmt->execute(['idSubmission' => $idSubmission]);
   $sourceCode = $stmt->fetch();
   $stmt->closeCursor();
   if (!$sourceCode) {
      die(json_encode(['success' => false, 'error' => 'cannot find source code for submission '.$idSubmission]));
   }
   $sourceCodeParams = json_decode($sourceCode['sParams'], true);
   return json_encode_safe(['idSubmission' => $idSubmission, 'langProg' => $sourceCodeParams['sLangProg'], 'sourceCode' => $sourceCode['sSource']]);
}

function getSubmissionFromAnswer($sAnswer) {
   try {
      $answerParams = json_decode($sAnswer, true);
   } catch (Exception $e) {
      return null;
   }
   return $answerParams['idSubmission'];
}

function generateScoreToken($idItem, $itemUrl, $idUser, $idSubmission, $score, $tokenGenerator, $idUserAnswer) {
   global $config;
   $params = [
      'idUser' => $idUser,
      'idItem' => $idItem,
      'itemUrl' => $itemUrl,
      'idUserAnswer' => $idUserAnswer,
      'sAnswer' => getScoreTokenAnswer($idSubmission),
      'score' => $score
   ];
   return $tokenGenerator->encodeJWS($params);
}
