<?php

/* Saves current answer into a submission (with confirmed = 0), and gives
 * the id of the submission.
 *
 * Called by task.getAnswer().
 */

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if (!$config->testMode->active && (!isset($request['sToken']) || !isset($request['sPlatform']))) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

if (!isset($request['oAnswer']) || !isset($request['oAnswer']['sSourceCode']) || !isset($request['oAnswer']['sLangProg'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'invalid answer object.'));
   exit;
}

$params = getPlatformTokenParams($request['sToken'], $request['sPlatform'], $request['taskId'], $db);

$sMode = (isset($request['aTests']) && count($request['aTests'])) ? 'UserTest' : 'Submitted'; // TODO: check in token

require_once "commonFramework/modelsManager/modelsTools.inc.php"; // for getRandomID()

// save source code (with bSubmission = 1)
$idNewSC = getRandomID();
$idSubmission = getRandomID();
$sourceCodeParams = json_encode(array('sLangProg' => $request['oAnswer']['sLangProg']));
$stmt = $db->prepare('insert into tm_source_codes (ID, idUser, idPlatform, idTask, sDate, sParams, sName, sSource, bSubmission) values(:idNewSC, :idUser, :idPlatform, :idTask, NOW(), :sParams, :idSubmission, :sSource, \'1\');');
$stmt->execute(array('idNewSC' => $idNewSC, 
                      'idUser' => $params['idUser'], 
                      'idPlatform' => $params['idPlatform'],
                      'idTask' => $params['idTaskLocal'],
                      'sParams' => $sourceCodeParams,
                      'idSubmission' => $idSubmission,
                      'sSource' => $request['oAnswer']['sSourceCode']));

// TODO: also save tests

// save a submission pointing to this source code
$stmt = $db->prepare('insert into tm_submissions (ID, idUser, idPlatform, idTask, sDate, idSourceCode, sMode) values(:idSubmission, :idUser, :idPlatform, :idTask, NOW(), :idSourceCode, :sMode);');
$stmt->execute(array('idSubmission' => $idSubmission, 
                      'idUser' => $params['idUser'], 
                      'idPlatform' => $params['idPlatform'],
                      'idTask' => $params['idTaskLocal'],
                      'idSourceCode' => $idNewSC,
                      'sMode' => $sMode));

if ($sMode == 'UserTest') {
   $stmt = $db->prepare('insert into tm_tasks_tests (idUser, idPlatform, idTask, sGroupType, sInput, sOutput, sName, iRank, idSubmission) values(:idUser, :idPlatform, :idTask, \'Submission\', :sInput, :sOutput, :sName, :iRank, :idSubmission);');
   foreach($request['aTests'] as $i => $test) {
      $stmt->execute(array(
         'idUser' => $params['idUser'], 
         'idPlatform' => $params['idPlatform'],
         'idTask' => $params['idTaskLocal'],
         'sInput' => $test['sInput'],
         'sOutput' => $test['sOutput'],
         'sName'  => $test['sName'],
         'iRank' => $i,
         'idSubmission' => $idSubmission
      ));
   }
}

$answer = getScoreTokenAnswer($idSubmission);

echo json_encode(array('bSuccess' => true, 'idSubmission' => $idSubmission, 'answer' => $answer));
