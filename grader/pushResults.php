<?php

/*
 * Return url for graderQueue, expects a JWE token as 'sToken' in POST.
 */

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (!isset($_POST['sToken'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken POST variable.'));
   exit;
}

require_once "../shared/connect.php";
require_once "../shared/TokenParser.php";
require_once "../shared/common.inc.php";

$tokenParser = new TokenParser($config->graderqueue->own_private_key,
   $config->graderqueue->own_name,
   'private',
   $config->graderqueue->public_key,
   $config->graderqueue->name,
   'public'
   );

$tokenParams = $tokenParser->decodeJWES($_POST['sToken']);
if (!$tokenParams) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'cannot decrypt token.'));
   exit;
}

try {
   $graderResults = json_decode($tokenParams['sResultData'], true);
} catch(Exception $e) {
   die(json_encode(array('bSuccess' => false, 'sError' => 'cannot read result data json return: '.$e->getMessage())));
}

$nbTestsPassed = 0;
$iScoreTotal = 0;
$nbTestsTotal = 0;
$bCompileError = false;
$sErrorMsg = '';

// TODO: not sure about [0] here... summarizeResults uses a for loop
foreach ($graderResults['executions'][0]['testsReports'] as $testReport) {
   $nbTestsTotal = $nbTestsTotal + 1;
   if (!isset($testReport['checker'])) {
      $bCompileError = true;
      // TODO: not sure about this part
      if (isset($testReport['execution'])) {
         $sErrorMessage = $testReport['execution']['stderr']['data'];
      } else {
         $sErrorMessage = $testReport['sanitizer']['stderr']['data'];
      }
      break; // ?
   } else {
      $iScore = intval(strtok($testReport['checker']['stdout'], "\n")); // TODO: couldn't this be more straightforward?
      if ($iScore > 50) { // TODO: ???
         $nbTestsPassed = $nbTestsPassed + 1;
      }
      $iScoreTotal = $iScoreTotal + $iScore;
   }
}

$stmt = $db->prepare('UPDATE tm_submissions SET (nbTestsPassed, iScore, nbTestsTotal, bCompileError, sErrorMsg, bEvaluated) VALUES (:nbTestsPassed, :iScore, :nbTestsTotal, :bCompile, \'1\') WHERE id=:sName');
$stmt->execute(array('sName' => $tokenParams, 'nbTestsPassed' => $nbTestsPassed, 'iScore' => $iScore, 'nbTestsTotal' => $nbTestsTotal, 'bCompileError' => $bCompileError, 'sErrorMsg' => $sErrorMsg));
