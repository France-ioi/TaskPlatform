<?php

/* Saves current answer into a submission (with confirmed = 0), and gives
 * the id of the submission.
 *
 * Called by task.getAnswer().
 */

if (!isset($_POST['sToken']) || !isset($_POST['sPlatform'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken or sPlatform POST variable.'));
   exit;
}

require_once "shared/connect.php";
require_once "shared/common.inc.php";

$params = getTokenParams($_POST['sToken'], $_POST['sPlatform'], $db);

require_once "commonFramework/modelsManager/modelsTools.inc.php";

// get current source code
$stmt = $db->prepare('select sParams, sSource from tm_source_codes where bActive = \'1\' and idUser = :idUser and idPlatform = :idPlatform and idTask = :idTask and bSubmission = 0;');
$stmt->execute(array('idUser' => $params['idUser'], 'idPlatform' => $params['idPlatform'], 'idTask' => $params['idTaskLocal']));
$sourceCode = $stmt->fetch();
if (!$sourceCode) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'impossible to find source code named '.$_POST['sSourceCodeName']));
   exit;
}

// save source code (copy with bSubmission = 1)
$idNewSC = getRandomID();
$idSubmission = getRandomID();
$stmt = $db->prepare('insert into tm_source_codes (ID, idUser, idPlatform, idTask, sDate, sParams, sName, sSource, bSubmission) values(:idNewSC, :idUser, :idPlatform, :idTask, NOW(), :sParams, :idSubmission, :sSource, \'1\');');
$stmt->execute(array('idNewSC' => $idNewSC, 
                      'idUser' => $params['idUser'], 
                      'idPlatform' => $params['idPlatform'],
                      'idTask' => $params['idTaskLocal'],
                      'sParams' => $sourceCode['sParams'],
                      'idSubmission' => $idSubmission,
                      'sSource' => $sourceCode['sSource']));

// TODO: also save tests?

// save a submission pointing to this source code
$stmt = $db->prepare('insert into tm_submissions (ID, idUser, idPlatform, idTask, sDate, idSourceCode) values(:idSubmission, :idUser, :idPlatform, :idTask, NOW(), :idSourceCode);');
$stmt->execute(array('idSubmission' => $idSubmission, 
                      'idUser' => $params['idUser'], 
                      'idPlatform' => $params['idPlatform'],
                      'idTask' => $params['idTaskLocal'],
                      'idSourceCode' => $idNewSC));

echo json_encode(array('bSuccess' => true, 'sAnswer' => $idSubmission));
