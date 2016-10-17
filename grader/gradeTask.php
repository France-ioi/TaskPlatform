<?php

require_once "../shared/connect.php";
require_once "../shared/TokenGenerator.php";
require_once "../shared/common.inc.php";

$request = json_decode(file_get_contents('php://input'),true);

if ((!isset($request['sToken']) && !$config->testMode->active) || !isset($request['sPlatform']) || !isset($request['idSubmission'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken, idSubmission or sPlatform POST variable.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

$idSubmission = $request['idSubmission'];
$idUserAnswer = null;

if (!isset($request['answerToken']) && !$config->testMode->active) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing answerToken'));
   exit;
}

if (isset($request['answerToken']) && $request['answerToken'] != '') {
   $answerTokenParams = getPlatformTokenParams($request['answerToken'], $request['sPlatform'], $request['taskId'], $db);
   if (isset($answerTokenParams['idUserAnswer'])) {
      $idUserAnswer = $answerTokenParams['idUserAnswer'];
   }
}

if (!($config->testMode->active || (isset($params['bTestMode']) && $params['bTestMode']))) {
   if ($answerTokenParams['idUser'] != $params['idUser'] || $answerTokenParams['itemUrl'] != $params['itemUrl']) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'mismatching tokens', 'sToken' => $params, 'answerToken' => $answerTokenParams));
      exit;
   }
   if (!isset($answerTokenParams['sAnswer'])) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'missing sAnswer in answerToken.', 'token' => $answerTokenParams));
      exit;
   }
   $idSubmission = getSubmissionFromAnswer($answerTokenParams['sAnswer']);
   if (!$idSubmission) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'impossible to submission associated with answer token', 'token' => $answerTokenParams));
      exit;  
   }
   if ((isset($params['bSubmissionPossible']) && !$params['bSubmissionPossible']) || (isset($params['bAllowGrading']) && !$params['bAllowGrading'])) {
      echo json_encode(array('bSuccess' => false, 'sError' => 'token indicates read-only task.'));
      exit;
   }
}

$returnUrl = null;
if (isset($request['taskParams']) && isset($request['taskParams']['returnUrl'])) {
   $returnUrl = $request['taskParams']['returnUrl'];
} else if (isset($params['returnUrl'])) {
   $returnUrl = $params['returnUrl'];
}

if ($returnUrl || $idUserAnswer) {
   $stmt = $db->prepare('update tm_submissions set sReturnUrl = :returnUrl, idUserAnswer = :idUserAnswer WHERE tm_submissions.`ID` = :idSubmission and tm_submissions.idUser = :idUser and tm_submissions.idPlatform = :idPlatform and tm_submissions.idTask = :idTask;');
   $stmt->execute(array(
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform'],
      'idSubmission' => $idSubmission,
      'returnUrl' => $returnUrl,
      'idUserAnswer' => $idUserAnswer
   ));
}

// sAnswer is submission.id, let's fetch submission and corresponding source_code
$stmt = $db->prepare("SELECT tm_submissions.*, tm_tasks.*, tm_source_codes.* FROM `tm_submissions` JOIN tm_tasks on tm_tasks.ID = tm_submissions.idTask JOIN tm_source_codes on tm_source_codes.ID = tm_submissions.idSourceCode WHERE tm_submissions.`ID` = :idSubmission and tm_submissions.idUser = :idUser and tm_submissions.idPlatform = :idPlatform and tm_submissions.idTask = :idTask;");
$stmt->execute(array(
   'idUser' => $params['idUser'],
   'idTask' => $params['idTaskLocal'],
   'idPlatform' => $params['idPlatform'],
   'idSubmission' => $idSubmission
));
$submissionInfos = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$submissionInfos) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot find submission '.$idSubmission));
   exit;
}

// TODO: check submission against $params['idUser'], idTask and idPlatform
// TODO: check and set tm_submissions.bConfirmed

$tests = array();
if ($submissionInfos['sMode'] == 'UserTest') {
   $stmt = $db->prepare('SELECT tm_tasks_tests.* FROM tm_tasks_tests WHERE idUser = :idUser and idPlatform = :idPlatform and idTask = :idTask and idSubmission = :idSubmission');
   $stmt->execute(array(
      'idUser' => $params['idUser'],
      'idTask' => $params['idTaskLocal'],
      'idPlatform' => $params['idPlatform'],
      'idSubmission' => $idSubmission
   ));
   $tests = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function baseLangToJSONLang($baseLang) {
   $baseLang = strtolower($baseLang);
   if ($baseLang == 'c++') {
      return 'cpp';
   }
   if ($baseLang == 'python') {
      return 'python3';
   }
   return $baseLang;
}

$JSONLANG_TO_EXT = array(
   'python' => 'py',
   'text' => 'txt',
   'python3' => 'py',
   'ocaml'  => 'ml',
   'pascal' => 'pas',
   'java'   => 'java',
   'javascool' => 'jvs',
   'cpp' => 'cpp',
   'c' => 'c',
   'shell' => 'sh',
);

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
   $limit = ['iMaxTime' => 1000, 'iMaxMemory' => 20000];
}

if ($submissionInfos['bTestMode']) {

   $tests = json_decode($submissionInfos['sSource'], true);

   $jobData = json_decode('{"taskPath": "","extraParams": {"defaultFilterTests": ["user-*.in"]},"extraTests": [],"solutions": "@testEvaluationSolutions","executions": "@testEvaluationExecutions"}', true);

   $jobData['taskPath'] = $submissionInfos['sTaskPath'];

   if (count($tests)) {
      $jobData['extraTests'] = array();
      foreach($tests as $i => $test) {
         $jobData['extraTests'][] = array(
            'name' => 'user-'.$test['sName'].'.in',
            'content' => $test['sInput']
         );
      }
   }

} else {

   $jobData = json_decode('{"taskPath":"","extraParams": {"solutionFilename": "'.$fileName.'","solutionContent": "","solutionLanguage": "'.$lang.'","solutionDependencies": "@defaultDependencies-'.$lang.'","solutionFilterTests":"@defaultFilterTests-'.$lang.'","solutionId": "sol0-'.$fileName.'","solutionExecId": "exec0-'.$fileName.'","defaultSolutionCompParams": {"memoryLimitKb":"","timeLimitMs":"","stdoutTruncateKb":-1,"stderrTruncateKb":-1,"useCache":true,"getFiles":[]},"defaultSolutionExecParams": {"memoryLimitKb":"","timeLimitMs":"","stdoutTruncateKb":-1,"stderrTruncateKb":-1,"useCache":true,"getFiles":[]}}}', true);

   $jobData['taskPath'] = $submissionInfos['sTaskPath'];
   $jobData['extraParams']['solutionContent'] = $submissionInfos['sSource'];
   $jobData['extraParams']['defaultSolutionCompParams']['memoryLimitKb'] = intval($limit['iMaxMemory']);
   $jobData['extraParams']['defaultSolutionCompParams']['timeLimitMs'] = intval($limit['iMaxTime']);
   $jobData['extraParams']['defaultSolutionExecParams']['memoryLimitKb'] = intval($limit['iMaxMemory']);
   $jobData['extraParams']['defaultSolutionExecParams']['timeLimitMs'] = intval($limit['iMaxTime']);

   if (count($tests)) {
      $jobData['extraTests'] = array();
      $jobData['extraParams']['solutionFilterTests'] = array('id-*.in');
      foreach($tests as $i => $test) {
         $jobData['extraTests'][] = array(
            'name' => 'id-'.$test['ID'].'.in',
            'content' => $test['sInput']
         );
         $jobData['extraTests'][] = array(
            'name' => 'id-'.$test['ID'].'.out',
            'content' => $test['sOutput']
         );
      }
   }
}

$jobUserTaskId = $submissionInfos['idTask'].'-'.$submissionInfos['idUser'].'-'.$submissionInfos['idPlatform'];

$request = array(
   'request' => 'sendjob',
   'priority' => 1,
   'taskrevision' => $submissionInfos['sRevision'],
   'tags' => '',
   'jobname' => $idSubmission,
   'jobdata' => json_encode_safe($jobData),
   'jobusertaskid' => $jobUserTaskId
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
