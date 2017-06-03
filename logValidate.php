<?php
$request = json_decode(file_get_contents('php://input'),true);

$msg  = date(DATE_RFC2822);
$msg .= ' t=' . $request['taskId'];
$msg .= ' w=' . $request['idWindow'];
$msg .= ' ' . $request['step'];
$msg .= ' for s=' . (isset($request['idSubmission']) ? $request['idSubmission'] : 'null');
file_put_contents(__DIR__ . '/logs/validate.log', $msg . "\n", FILE_APPEND);
?>
