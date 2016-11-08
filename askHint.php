<?php

require_once "shared/connect.php";
require_once "shared/TokenGenerator.php";
require_once "shared/common.inc.php";

$request = json_decode(file_get_contents('php://input'),true);

header('Content-Type: application/json');

if ((!isset($request['sToken']) && !$config->testMode->active) || !isset($request['sPlatform'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

$newParams = [
  'itemUrl' => $params['itemUrl'],
  'idUser' => $params['idUser'],
  'askedHint' => intval($params['nbHintsGiven'])+1
];
if(isset($params['idItem'])) {
  $newParams['idItem'] = $params['idItem'];
}

$tokenGenerator = new TokenGenerator($config->platform->private_key, $config->platform->name, null);

$jws = $tokenGenerator->encodeJWS($newParams);

echo json_encode(['success' => 'true', 'hintToken' => $jws]);
