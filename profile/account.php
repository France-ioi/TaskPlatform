<?php
require_once "../shared/connect.php";
require_once "../shared/TokenGenerator.php";
require_once "../shared/common.inc.php";



// auth

function decodeToken($request) {
    global $db;
    if(!isset($request['sToken'])) {
        throw new Exception('sToken param missed.');
    }
    if(!isset($request['sPlatform'])) {
        throw new Exception('sPlatform param missed.');
    }
    $q = '
        SELECT ID, public_key
        FROM tm_platforms
        WHERE name = :name';
    $stmt = $db->prepare($q);
    $stmt->execute(array('name' => $request['sPlatform']));
    $platform = $stmt->fetch(PDO::FETCH_ASSOC);
    if(!$platform) {
        throw new Exception('Can not find platform '.$request['sPlatform']);
    }

    $tokenParser = new TokenParser($platform['public_key'], $request['sPlatform'], 'public');
    $token = $tokenParser->decodeJWS($request['sToken']);

    if(!isset($token['idUser'])) {
        throw new Exception('token.idUser missed.');
    }
    return [
        'idPlatform' => $platform['ID'],
        'idUser' => $token['idUser']
    ];
}



// sys

function outputJson($data) {
    echo json_encode($data);
}



// summary

function selCount($table, $params) {
    global $db;
    $q = "
        SELECT count(*)
        FROM {$table}
        WHERE idUser = :idUser AND idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
    return $stmt->fetchColumn();
}


function getSummary($params) {
    $tables = [
        'tm_recordings',
        'tm_submissions'
    ];
    $res = [];
    foreach($tables as $table) {
        $res[$table] = selCount($table, $params);
    }
    return $res;
}



// export

function exportRecordings($params) {
    global $db;
    $q = "
        SELECT r.*, ts.sTitle as taskTitle
        FROM tm_recordings as r
        JOIN tm_tasks_strings as ts
        ON ts.idTask = r.idTask AND ts.sLanguage = 'fr'
        WHERE r.idUser = :idUser AND r.idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo '"recordings":';
    outputJson($data);
}


function exportSubmissions($params) {
    global $db;
    $q = "
        SELECT s.*, ts.sTitle as taskTitle, sc.*
        FROM tm_submissions as s
        JOIN tm_tasks_strings as ts
        ON ts.idTask = s.idTask AND ts.sLanguage = 'fr'
        JOIN tm_source_codes as sc
        ON sc.ID = s.idSourceCode
        WHERE s.idUser = :idUser AND s.idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo '"submissions":';
    outputJson($data);
}



// delete

function deleteAccount($params) {
    global $db;
    $q = "
        DELETE FROM tm_recordings
        WHERE idUser = :idUser AND idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
    $q = "
        DELETE FROM history_tm_recordings
        WHERE idUser = :idUser AND idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);

    $q = "
        DELETE FROM tm_source_codes
        WHERE idUser = :idUser AND idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
    $q = "
        DELETE FROM history_tm_source_codes
        WHERE idUser = :idUser AND idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);


    $q = "
        DELETE tm_submissions, tm_submissions_subtasks, tm_submissions_tests
        FROM tm_submissions
        INNER JOIN tm_submissions_subtasks
        ON tm_submissions_subtasks.idSubmission = tm_submissions.ID
        INNER JOIN tm_submissions_tests
        ON tm_submissions_tests.idSubmission = tm_submissions.ID
        WHERE tm_submissions.idUser = :idUser AND tm_submissions.idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);

    $q = "
        DELETE history_tm_submissions, history_tm_submissions_subtasks, history_tm_submissions_tests
        FROM history_tm_submissions
        INNER JOIN history_tm_submissions_subtasks
        ON history_tm_submissions_subtasks.idSubmission = history_tm_submissions.ID
        INNER JOIN history_tm_submissions_tests
        ON history_tm_submissions_tests.idSubmission = history_tm_submissions.ID
        WHERE history_tm_submissions.idUser = :idUser AND history_tm_submissions.idPlatform = :idPlatform";
    $stmt = $db->prepare($q);
    $stmt->execute($params);
}



// main

header('Content-type: application/json');
try {
    if(!isset($_REQUEST['sAction'])) {
        throw new Exception('sAction param missed.');
    }
    $params = decodeToken($_REQUEST);
    switch($_REQUEST['sAction']) {
        case 'summary':
            outputJson(getSummary($params));
            break;
        case 'export':
            header('Content-disposition: attachment; filename=user-data-task-platform.json');
            echo '{';
            exportRecordings($params);
            echo ',';
            exportSubmissions($params);
            echo '}';
            break;
        case 'delete':
            deleteAccount($params);
            outputJson([
                'success' => true
            ]);
            break;
        default:
            throw new Exception('Wrong sAction param.');
    }
} catch(Exception $e) {
    outputJson([
        'error' => $e->getMessage()
    ]);
}