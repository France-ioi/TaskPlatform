<?php

// Database access
//$config->db->host = "";
//$config->db->database = "";
$config->db->user = "";
$config->db->password = "";

// URLs
$config->baseUrl = "https://example.com/"; // Base URL of the taskplatform
$config->getTaskUrl = function($taskId) { return $config->baseUrl.'task.html?taskId='.$taskId; };
$config->shared->evalResultOutputScriptBaseUrl = $config->baseUrl.'evalScripts/';

// Platform information
$config->platform->name = "";
$config->platform->private_key = "";
$config->platform->public_key = "";

// Graderqueue information
$config->graderqueue->default_eval_tags = ''; // Tags to send for any task that doesn't have any tag

// Test mode config
$config->testMode->platformName = "http://algorea.pem.dev"; // must correspond to a name field of tm_platforms

// Transloadit config
$config->shared->transloadit->key = '';
$config->shared->transloadit->template_id = '';
