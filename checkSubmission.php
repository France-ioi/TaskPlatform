<?php

$request = json_decode(file_get_contents('php://input'),true);

require_once "shared/connect.php";
require_once "shared/common.inc.php";

if(!isset($request['idSubmission'])) {
    die(json_encode(['success' => false, 'error' => 'No idSubmission in request']));
}

$stmt = $db->prepare("SELECT bEvaluated FROM tm_submissions WHERE ID = :idSubmission;");
$stmt->execute(['idSubmission' => $request['idSubmission']]);

echo json_encode(['success' => true, 'evaluated' => !!$stmt->fetchColumn()]);
