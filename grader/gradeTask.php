<?php

if (!isset($_POST['sToken']) || !isset($_POST['sPlatform']) || !isset($_POST['sAnswer'])) {
   echo json_encode(array('bSuccess' => false, 'sError' => 'missing sToken, sAnswer or sPlatform POST variable.'));
   exit;
}

require_once "shared/connect.php";
require_once "shared/common.inc.php";

$params = getTokenParams($_POST['sToken'], $_POST['sPlatform'], $db);

// TODO: check if token params allow user to grade answer
