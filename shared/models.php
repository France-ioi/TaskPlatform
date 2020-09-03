<?php
/* Copyright (c) 2013 Association France-ioi, MIT License http://opensource.org/licenses/MIT */

$tablesModels = array (
   "tm_hints" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" =>  array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_hints_strings" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idHint" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sLanguage" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTranslator" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sContent" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_recordings" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array("user"), "read" => array("user"))),
         "idUser" => array("type" => "int", "access" => array("write" => array("user"), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array("user"), "read" => array("user"))),
         "sData" => array("type" => "string", "access" => array("write" => array("user"), "read" => array("user"))),
         "sDateCreation" => array("type" => "date", "access" => array("write" => array("user"), "read" => array("user"))),
      ),
   ),
   "tm_solutions" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bInSolution" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sLangProg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sGroup"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sAuthor"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_solutions_strings" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idSolution" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sLanguage" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTranslator" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sSource" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_source_codes" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idUser" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sDate" => array("type" => "datetime", "access" => array("write" => array(), "read" => array("user"))),
         "sParams"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sName"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sSource"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bEditable" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sType" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bActive" => array("skipHistory" => true, "type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bSubmission" =>  array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" =>  array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_submissions" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idUser" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sDate" => array("type" => "datetime", "access" => array("write" => array(), "read" => array("user"))),
         "idSourceCode" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bManualCorrection" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bSuccess" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "nbTestsTotal" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "nbTestsPassed" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iScore" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bCompilError" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sCompilMsg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))), 
         "sErrorMsg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))), 
         "sFirstUserOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))), 
         "sFirstExpectedOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))), 
         "sManualScoreDiffComment" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))), 
         "bEvaluated" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sMode" => array("type" => "enum", "access" => array("write" => array(), "read" => array("user"))),
         "sReturnUrl" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "idUserAnswer" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iChecksum" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),   
   "tm_submissions_subtasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "bSuccess" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iScore" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubmission"  => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_submissions_tests" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idSubmission" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idTest" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iScore" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iTimeMs" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iMemoryKb" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iErrorCode" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sExpectedOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sLog" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bNoFeedback" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "jFiles" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sErrorMsg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "idSubmissionSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_tasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "sScriptAnimation" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTextId" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sSupportedLangProg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sEvalTags" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bShowLimits" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bEditorInStatement" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bUserTests" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bUseLatex" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iTestsMinSuccessScore" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bIsEvaluable" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sEvalResultOutputScript" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTaskPath" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sRevision" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sAssetsBaseUrl" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sDefaultEditorMode" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bTestMode" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bHasSubtasks" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_tasks_limits" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sLangProg" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iMaxTime" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iMaxMemory" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_tasks_strings" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sLanguage" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTitle" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sTranslator" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sStatement" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sSolution" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
      )
   ),
   "tm_tasks_subtasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "name" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "comments" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iPointsMax" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bActive" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      )
   ),
   "tm_tasks_tests" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubmission" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sGroupType" => array("type" => "enum", "access" => array("write" => array(), "read" => array("user"))),
         "idUser" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sInput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sName" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      )
   )
);

$viewsModels = array (
   "tm_hints" => array (
      "mainTable" => "tm_hints",
      "joins" => array(),
      "fields" => array(
         "idTask" => array(),
         "iRank" => array(),
      ),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_hints`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
         "nbHintsGiven" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_hints`.`iRank` <= :[PREFIX_FIELD]nbHintsGiven"
         ),
      ),
   ),
   "tm_hints_strings" => array (
      "mainTable" => "tm_hints_strings",
      "fields" => array(
         "idHint" => array(),
         "sLanguage" => array(),
         "sContent" => array(),
      ),
      "joins" => array (
         "tm_hints" => array("srcTable" => "tm_hints_strings", "srcField" => "idHint", "dstField" => "ID")
      ),
      "filters" => array (
         "task" => array(
            "joins" => array("tm_hints"),
            "condition" => "`[PREFIX]tm_hints`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
         "nbHintsGiven" => array(
            "joins" => array("tm_hints"),
            "condition" => "`[PREFIX]tm_hints`.`iRank` <= :[PREFIX_FIELD]nbHintsGiven"
         ),
      ),
   ),
   "tm_recordings" => array (
      "mainTable" => "tm_recordings",
      "fields" => array(
         "idTask" => array(),
         "sData" => array(),
         "sDateCreation" => array(),
      ),
      "joins" => array(),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_recordings`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_solutions" => array (
      "mainTable" => "tm_solutions",
      "joins" => array(),
      "fields" => array(
         "idTask" => array(),
         "sLangProg" => array(),
         "sGroup" => array(),
      ),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_solutions`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
         "hasAccessToSolution" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_solutions`.`bInSolution` < :[PREFIX_FIELD]hasAccessToSolution"
         ),
      ),
   ),
   "tm_solutions_strings" => array (
      "mainTable" => "tm_solutions_strings",
      "fields" => array(
         "idSolution" => array(),
         "sLanguage" => array(),
         "sSource" => array(),
      ),
      "joins" => array (
         "tm_solutions" => array("srcTable" => "tm_solutions_strings", "srcField" => "idSolution", "dstField" => "ID")
      ),
      "filters" => array (
         "task" => array(
            "joins" => array("tm_solutions"),
            "condition" => "`[PREFIX]tm_solutions`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
         "hasAccessToSolution" => array(
            "joins" => array("tm_solutions"),
            "condition" => "`[PREFIX]tm_solutions`.`bInSolution` < :[PREFIX_FIELD]hasAccessToSolution"
         ),
      ),
   ),
   "tm_source_codes" => array (
      "mainTable" => "tm_source_codes",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_source_codes", "srcField" => "ID", "dstField" => "idSourceCode")
         ),
      "fields" => array(
         "idUser" => array(),
         "idTask" => array(),
         "sDate" => array(),
         "sParams"  => array(),
         "sName"  => array(),
         "sSource"  => array(),
         "bEditable" => array(),
         "bActive" => array(),
         "bSubmission" => array(),
         "sType" => array(),
         "iRank" => array()
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`id` = :[PREFIX_FIELD]idSubmission"
         ),
         "user" => array(
            "joins" => array(),
            "condition" => "((`[PREFIX]tm_source_codes`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_source_codes`.`idPlatform` = :[PREFIX_FIELD]idPlatform) OR `[PREFIX]tm_source_codes`.`sType` = 'Task' OR `[PREFIX]tm_source_codes`.`sType` = 'Solution')"
         ),
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_source_codes`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks" => array (
      "mainTable" => "tm_tasks",
      "fields" => array(
         "sScriptAnimation" => array(),
         "sTextId" => array(),
         "sSupportedLangProg" => array(),
         "sEvalTags" => array(),
         "bShowLimits" => array(),
         "bEditorInStatement" => array(),
         "bUserTests" => array(),
         "bUseLatex" => array(),
         "iTestsMinSuccessScore" => array(),
         "bIsEvaluable" => array(),
         "sAssetsBaseUrl" => array(),
         "sEvalResultOutputScript" => array(),
         "sDefaultEditorMode" => array(),
         "sTaskPath" => array(),
         "bTestMode" => array(),
         "bHasSubtasks" => array(),
      ),
      "joins" => array (
         "tm_hints" => array ("type" => 'LEFT', "srcTable" => "tm_tasks", "srcField" => "ID", "dstField" => "idTask")
      ),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks`.`ID` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks_limits" => array (
      "mainTable" => "tm_tasks_limits",
      "fields" => array(
         "idTask" => array(),
         "sLangProg" => array(),
         "iMaxTime" => array(),
         "iMaxMemory" => array(),
      ),
      "joins" => array (),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks_limits`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks_strings" => array (
      "mainTable" => "tm_tasks_strings",
      "joins" => array(),
      "fields" => array(
         "idTask" => array(),
         "sLanguage" => array(),
         "sTitle" => array(),
         "sStatement" => array(),
         "sSolution" => array(),
      ),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks_strings`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks_subtasks" => array (
      "mainTable" => "tm_tasks_subtasks",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_tasks_subtasks", "srcField" => "idTask", "dstField" => "idTask")
         ),
      "fields" => array(
         "idTask" => array(),
         "name" => array(),
         "comments" => array(),
         "iPointsMax" => array(),
         "bActive" => array(),
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`ID` = :[PREFIX_FIELD]idSubmission"
         ),
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks_subtasks`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks_tests" => array (
      "mainTable" => "tm_tasks_tests",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_tasks_tests", "srcField" => "idTask", "dstField" => "idTask")
         ),
      "fields" => array(
         "idTask" => array(),
         "idSubmission" => array(),
         "sGroupType" => array(),
         "sOutput" => array(),
         "sInput" => array(),
         "sName" => array(),
         "iRank" => array(),
         "idSubtask" => array(),
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`ID` = :[PREFIX_FIELD]idSubmission"
         ),
         "userOrExample" => array(
            "joins" => array(),
            "condition" => "((`[PREFIX]tm_tasks_tests`.`sGroupType` = 'User' and `[PREFIX]tm_tasks_tests`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_tasks_tests`.`idPlatform` = :[PREFIX_FIELD]idPlatform) or `[PREFIX]tm_tasks_tests`.`sGroupType` = 'Example')"
         ),
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks_tests`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_submissions" => array (
      "mainTable" => "tm_submissions",
         "joins" => array (
            "tm_tasks" => array("srcTable" => "tm_submissions", "srcField" => "idTask", "dstField" => "ID", "ignoreHistory" => true)
         ),
      "fields" => array (
         "idUser" => array(),
         "idTask" => array(),
         "sDate" => array(),
         "idSourceCode" => array(),
         "bManualCorrection" => array(),
         "bSuccess" => array(),
         "nbTestsTotal" => array(),
         "nbTestsPassed" => array(),
         "iScore" => array(),
         "bCompilError" => array(),
         "sCompilMsg" => array(), 
         "sErrorMsg" => array(), 
         "sFirstUserOutput" => array(), 
         "sFirstExpectedOutput" => array(), 
         "sManualScoreDiffComment" => array(), 
         "bEvaluated" => array(),
         "sMode" => array(),
         "iChecksum" => array(),
         "idPlatform" => array(),
         "task_sScriptAnimation" => array("tableName" => "tm_tasks", "fieldName" => "sScriptAnimation"),
         "task_sEvalResultOutputScript" => array("tableName" => "tm_tasks", "fieldName" => "sEvalResultOutputScript"),
         "idUserAnswer" => array()
      ),
      "filters" => array (
         "idSubmission" => array (
            "condition" => "`[PREFIX]tm_submissions`.`ID` = :[PREFIX_FIELD]idSubmission"
         ),
         "user" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_submissions`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_submissions`.`idPlatform` = :[PREFIX_FIELD]idPlatform"
         ),
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_submissions`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_submissions_tests" => array (
      "mainTable" => "tm_submissions_tests",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_submissions_tests", "srcField" => "idSubmission", "dstField" => "ID"),
         "tm_tasks_tests" => array ("srcTable" => "tm_submissions_tests", "srcField" => "idTest", "dstField" => "ID")
         ),
      "fields" => array(
         "idSubmission" => array(),
         "idTest" => array(),
         "iScore" => array(),
         "iTimeMs" => array(),
         "iMemoryKb" => array(),
         "iErrorCode" => array(),
         "sOutput" => array(),
         "sExpectedOutput" => array(),
         "sLog" => array(),
         "bNoFeedback" => array(),
         "jFiles" => array(),
         "sErrorMsg" => array(),
         "idSubmissionSubtask" => array(),
      ),
      "filters" => array (
         "idSubmission" => array (
            "condition" => "`[PREFIX]tm_submissions_tests`.`idSubmission` = :[PREFIX_FIELD]idSubmission"
         ),
         "user" => array(
            "joins" => array("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_submissions`.`idPlatform` = :[PREFIX_FIELD]idPlatform"
         ),
         "task" => array(
            "joins" => array("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      )
   ),
   "tm_submissions_subtasks" => array (
      "mainTable" => "tm_submissions_subtasks",
      "joins" => array (
         "tm_tasks_subtasks" => array ("srcTable" => "tm_submissions_subtasks", "srcField" => "idSubtask", "dstField" => "ID", "ignoreHistory" => true),
         "tm_submissions" => array ("srcTable" => "tm_submissions_subtasks", "srcField" => "idSubmission", "dstField" => "ID")
         ),
      "fields" => array(
         "bSuccess" => array(),
         "iScore" => array(),
         "idSubtask" => array(),
         "idSubmission" => array(),
         "subtask_idTask" => array("tableName" => "tm_tasks_subtasks", "fieldName" => "idTask"),
         "subtask_name" => array("tableName" => "tm_tasks_subtasks", "fieldName" => "name"),
         "subtask_comments" => array("tableName" => "tm_tasks_subtasks", "fieldName" => "comments"),
         "subtask_iPointsMax" => array("tableName" => "tm_tasks_subtasks", "fieldName" => "iPointsMax"),
         "subtask_iRank" => array("tableName" => "tm_tasks_subtasks", "fieldName" => "iRank")
      ),
      "filters" => array (
         "idSubmission" => array (
            "condition" => "`[PREFIX]tm_submissions_tests`.`idSubmission` = :[PREFIX_FIELD]idSubmission"
         ),
         "user" => array(
            "joins" => array("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_submissions`.`idPlatform` = :[PREFIX_FIELD]idPlatform"
         ),
         "task" => array(
            "joins" => array("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      )
   )
);
