<?php

require_once "vendor/autoload.php";
require_once "shared/connect.php";
require_once "shared/TokenParser.php";
require_once "shared/common.inc.php";
require_once "editor/FIOITaskEditorAjax.php";

FIOIEditorAjax::answerAjax($db);
