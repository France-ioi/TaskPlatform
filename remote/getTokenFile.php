<?php

require_once "../shared/connect.php";
require_once "../shared/TokenGenerator.php";
require_once "../shared/common.inc.php";

$request = $_GET;

if ((!isset($request['sToken']) && !$config->testMode->active) || !isset($request['sPlatform'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

function getRandomID() {
   $rand = (string) mt_rand(100000, 999999999);
   $rand .= (string) mt_rand(1000000, 999999999);
   return $rand;
}

function getNewSecret($idUser, $idPlatform) {
	global $db;
	$newSecret = (string) mt_rand(100000, 999999999);
	$newSecret .= (string) mt_rand(1000000, 999999999);
	$stmt = $db->prepare('insert ignore into tm_remote_secret (idUser, idPlatform, sRemoteSecret) values (:idUser, :idPlatform, :secret) on duplicate key update sRemoteSecret = VALUES(sRemoteSecret);');
	$stmt->execute([
		'idUser' => $idUser,
		'idPlatform' => $idPlatform,
		'secret' => $newSecret
	]);
	return $newSecret;
}

$newSecret = getNewSecret($params['idUser'], $params['idPlatform']);

$newParams = [
  'idItem' => isset($params['idItem']) ? $params['idItem'] : null,
  'itemUrl' => $params['itemUrl'],
  'idUser' => $params['idUser'],
  'nbHintsGiven' => 0,
  'bAccessSolutions' => 0,
  'returnUrl' => isset($params['returnUrl']) ? $params['returnUrl'] : null,
  'type' => 'long',
  'secret' => $newSecret
];

$tokenGenerator = new TokenGenerator($config->platform->private_key, $config->platform->name, null);

$jws = $tokenGenerator->encodeJWS($newParams);

$res = json_encode([
	'token' => $jws, 
	'platform' => $request['sPlatform'],
	'taskId' => $request['taskId'],
	'baseUrl' => $config->baseUrl
	]);

header('Content-Type: application/json');
header("Content-Disposition: attachment; filename=fioi-remote.json");
header("Content-Length: " . strlen($res));

echo $res;