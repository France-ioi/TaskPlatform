<?php

require_once "../shared/connect.php";
require_once "../shared/TokenGenerator.php";
require_once "../shared/common.inc.php";

// TODO: have a mode where user can evaluate his own tests, without platform approval, not evaluating grader tests

$request = $_GET;//$_POST;

if ((!isset($request['sToken']) && !$config->testMode->active) || !isset($request['sPlatform']) || !isset($request['sAnswer'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken, sAnswer or sPlatform POST variable.'));
   exit;
}

$idSubmission = $request['sAnswer'];

$platformTokenParams = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $db);

// TODO: check if token params allow user to grade answer

// sAnswer is submission.id, let's fetch submission and corresponding source_code
$stmt = $db->prepare("SELECT tm_submissions.*, tm_tasks.*, tm_source_codes.* FROM `tm_submissions` JOIN tm_tasks on tm_tasks.ID = tm_submissions.idTask JOIN tm_source_codes on tm_source_codes.ID = tm_submissions.idSourceCode WHERE tm_submissions.`ID` = :sAnswer;");
$stmt->execute(array(':sAnswer' => $idSubmission));
$submissionInfos = $stmt->fetch();
if (!$submissionInfos) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find submission '.$idSubmission));
   exit;
}

// TODO: check submission against $platformTokenParams['idUser'], idTask and idPlatform
// TODO: check and set tm_submissions.bConfirmed

function baseLangToJSONLang($baseLang) {
   $baseLang = strtolower($baseLang);
   if ($baseLang == 'c++') {
      return 'cpp';
   }
   return $baseLang;
}

$JSONLANG_TO_EXT = array(
   'python' => 'py',
   'ocaml'  => 'ml',
   'pascal' => 'pas',
   'java'   => 'java',
   'javascool' => 'jvs',
   'cpp' => 'cpp',
   'c' => 'c',
   'shell' => 'sh',
);

// TODO: convert languages into database
$baseLang = json_decode($submissionInfos['sParams'], true);
$baseLang = $baseLang['sLangProg'];
$lang = baseLangToJSONLang($baseLang);

$fileName = $idSubmission.'.'.$JSONLANG_TO_EXT[$lang];

// fetching limits
$stmt = $db->prepare('SELECT * FROM tm_tasks_limits WHERE idTask = :idTask;');
$stmt->execute(array('idTask' => $submissionInfos['idTask']));
$limits = $stmt->fetchAll();
$limit = null;
foreach($limits as $_ => $thislimit) {
   if ($thislimit['sLangProg'] == $baseLang) {
      $limit = $thislimit;
      break;
   } elseif ($thislimit['sLangProg'] == '*') {
      $limit = $thislimit;
   }
}

if (!$limit) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find limits for task '.$submissionInfos['idTask']));
   exit;
}

$taskData = json_decode('{"checker": "@defaultChecker", "generators": ["@defaultGenerator"], "solutions": [{"compilationDescr": {"files": [{"content": "", "name": "'.$fileName.'"}], "dependencies": "@defaultDependencies-'.$lang.'", "language": "'.$lang.'"}, "id": "sol0-'.$fileName.'", "compilationExecution": {"memoryLimitKb": "", "stderrTruncateKb": -1, "useCache": true, "getFiles": [], "timeLimitMs": "", "stdoutTruncateKb": -1}}], "extraTests": "@defaultExtraTests", "taskPath": "", "sanitizer": "@defaultSanitizer", "generations": ["@defaultGeneration"], "executions": [{"idSolution": "sol0-'.$fileName.'", "filterTests": "@defaultFilterTests-'.$lang.'", "runExecution": {"memoryLimitKb": "", "stderrTruncateKb": -1, "useCache": true, "getFiles": [], "timeLimitMs": "", "stdoutTruncateKb": -1}, "id": "exec0-'.$fileName.'"}]}', true);

$taskData['taskPath'] = $submissionInfos['sTaskPath'];
$taskData['solutions'][0]['compilationDescr']['files'][0]['content'] = $submissionInfos['sSource'];
$taskData['solutions'][0]['compilationExecution']['memoryLimitKb'] = intval($limit['iMaxMemory']);
$taskData['solutions'][0]['compilationExecution']['timeLimitMs'] = intval($limit['iMaxTime']);
$taskData['executions'][0]['memoryLimitKb'] = intval($limit['iMaxMemory']);
$taskData['executions'][0]['timeLimitMs'] = intval($limit['iMaxTime']);

$request = array(
      'request' => 'sendtask',
      'priority' => 1,
      'tags' => '',
      'taskname' => $idSubmission,
      'taskdata' => json_encode($taskData)
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

try {
   $server_output = json_decode($server_output, true);
} catch(Exception $e) {
   die(json_encode(array('bSuccess' => false, 'sError' => 'cannot read graderqueue json return: '.$e->getMessage())));
}

if ($server_output['errorcode'] == 0) {
   echo json_encode(array('bSuccess' => true));
} else {
   echo json_encode(array('bSuccess' => false, 'sError' => 'received error from graderqueue: '.$server_output['errormsg']));
}
