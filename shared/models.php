<?php
/* Copyright (c) 2013 Association France-ioi, MIT License http://opensource.org/licenses/MIT */

$tablesModels = array (
   "tm_source_codes" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idUser" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sDate" => array("type" => "datetime", "access" => array("write" => array(), "read" => array("user"))),
         "sParams"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sName"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sSource"  => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "bEditable" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_submissions" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idUser" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sDate" => array("type" => "datetime", "access" => array("write" => array(), "read" => array("user"))),
         "idSourceCode" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "bManualCorrection" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iSuccess" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
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
         "iChecksum" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idPlatform" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),   
   "tm_submissions_subtasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "iSuccess" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
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
         "iErrorCode" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sExpectedOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "idSubmissionSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_tasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "sScriptAnimation" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
      ),
   ),
   "tm_tasks_subtasks" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "name" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "comments" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iPointsMax" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "weighting" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      )
   ),
   "tm_tasks_tests" => array(
      "autoincrementID" => false,
      "fields" => array(
         "idTask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "sGroupType" => array("type" => "enum", "access" => array("write" => array(), "read" => array("user"))),
         "sOutput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "sInput" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      )
   )
);

$viewsModels = array (
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
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`id` = :[PREFIX_FIELD]idSubmission"
         ),
         "user" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_source_codes`.`idUser` = :[PREFIX_FIELD]idUser and `[PREFIX]tm_source_codes`.`idPlatform` = :[PREFIX_FIELD]idPlatform"
         ),
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_source_codes`.`idTask` = :[PREFIX_FIELD]idTask"
         ),
      ),
   ),
   "tm_tasks" => array (
      "mainTable" => "tm_tasks",
      "joins" => array (),
      "fields" => array(
         "sScriptAnimation" => array(),
      ),
      "filters" => array (
         "task" => array(
            "joins" => array(),
            "condition" => "`[PREFIX]tm_tasks`.`ID` = :[PREFIX_FIELD]idTask"
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
         "weighting" => array(),
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
         "sGroupType" => array(),
         "sOutput" => array(),
         "sInput" => array(),
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
         "iSuccess" => array(),
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
         "task_sScriptAnimation" => array("tableName" => "tm_tasks", "fieldName" => "sScriptAnimation")
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
         "iErrorCode" => array(),
         "sOutput" => array(),
         "sExpectedOutput" => array(),
         "idSubmissionSubtask" => array(),
         "test_idTask" => array("tableName" => "tm_tasks_tests", "fieldName" => "idTask"),
         "test_sGroupType" => array("tableName" => "tm_tasks_tests", "fieldName" => "sGroupType"),
         "test_sOutput" => array("tableName" => "tm_tasks_tests", "fieldName" => "sOutput"),
         "test_iRank" => array("tableName" => "tm_tasks_tests", "fieldName" => "iRank"),
         "test_idSubtask" => array("tableName" => "tm_tasks_tests", "fieldName" => "idSubtask")
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
         "iSuccess" => array(),
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
