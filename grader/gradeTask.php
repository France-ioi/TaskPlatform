<?php

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (!isset($_POST['sToken']) || !isset($_POST['sPlatform']) || !isset($_POST['sAnswer'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken, sAnswer or sPlatform POST variable.'));
   exit;
}

require_once "../shared/connect.php";
require_once "../shared/TokenGenerator.php";
require_once "../shared/common.inc.php";

$params = getTokenParams($_POST['sToken'], $_POST['sPlatform'], $db);

// TODO: check if token params allow user to grade answer

// sAnswer is submission.id, let's fetch submission and corresponding source_code
#$stmt = $db->prepare("SELECT * FROM `tm_submissions` WHERE `ID` = :sAnswer;");
#$stmt->execute(array(':sAnswer' => $_POST['sAnswer']));
#$submission = $stmt->fetch();
#if (!$submission) {
#   
#}


$request = array(
      'request' => 'sendtask',
      'priority' => 1,
      'tags' => '',
      'taskname' => mt_rand(1,1000000),
      'taskdata' => '{"checker": "@defaultChecker", "generators": ["@defaultGenerator"], "solutions": [{"compilationDescr": {"files": [{"path": "$ROOT_PATH/FranceIOI/Contests/2015/Algorea_tour_2/billes_d/tests/gen/sol-tomas.cpp", "name": "sol-tomas.cpp"}], "dependencies": "@defaultDependencies-cpp", "language": "cpp"}, "id": "sol0-sol-tomas.cpp", "compilationExecution": {"memoryLimitKb": 131072, "stderrTruncateKb": -1, "useCache": true, "getFiles": [], "timeLimitMs": 60000, "stdoutTruncateKb": -1}}], "extraTests": "@defaultExtraTests", "taskPath": "$ROOT_PATH/FranceIOI/Contests/2015/Algorea_tour_2/billes_d", "sanitizer": "@defaultSanitizer", "generations": ["@defaultGeneration"], "executions": [{"idSolution": "sol0-sol-tomas.cpp", "filterTests": "@defaultFilterTests-cpp", "runExecution": {"memoryLimitKb": 131072, "stderrTruncateKb": -1, "useCache": true, "getFiles": [], "timeLimitMs": 60000, "stdoutTruncateKb": -1}, "id": "exec0-sol-tomas.cpp"}]}'
   );

$tokenGenerator = new TokenGenerator($config->graderqueue->own_private_key,
   $config->graderqueue->own_name,
   'private',
   $config->graderqueue->public_key,
   $config->graderqueue->name,
   'public'
   );

$jwe = $tokenGenerator->encodeJWES($request);

$post_request = array(
   'sToken' => $jwe,
   'sPlatform' => $config->graderqueue->own_name
);

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$config->graderqueue->url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_request));

$server_output = curl_exec ($ch);

curl_close ($ch);

echo $server_output;
