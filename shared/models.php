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
      "hasHistory" => false,
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
         "sOutput3" => array("type" => "string", "access" => array("write" => array(), "read" => array("user"))),
         "iRank" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
         "idSubtask" => array("type" => "int", "access" => array("write" => array(), "read" => array("user"))),
      )
   )
);

$viewModels = array();

$viewModels['byIdSubmission'] = array (
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
         )
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
         )
      ),
   ),
   /*
   "tm_tasks_tests" => array (
      "mainTable" => "tm_tasks_tests",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_tasks_tests", "srcField" => "idTask", "dstField" => "idTask")
         ),
      "fields" => array(
         "idTask" => array(),
         "sGroupType" => array(),
         "sOutput3" => array(),
         "iRank" => array(),
         "idSubtask" => array(),
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`ID` = :[PREFIX_FIELD]idSubmission"
         )
      ),
   ),
   */
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
   ),     
   "tm_submissions_tests" => array (
      "mainTable" => "tm_submissions_tests",
      "joins" => array (
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
         "test_sOutput3" => array("tableName" => "tm_tasks_tests", "fieldName" => "sOutput3"),
         "test_iRank" => array("tableName" => "tm_tasks_tests", "fieldName" => "iRank"),
         "test_idSubtask" => array("tableName" => "tm_tasks_tests", "fieldName" => "idSubtask")
      )
   ),
   
   "tm_submissions_subtasks" => array (
      "mainTable" => "tm_submissions_subtasks",
      "joins" => array (
         "tm_tasks_subtasks" => array ("srcTable" => "tm_submissions_subtasks", "srcField" => "idSubtask", "dstField" => "ID")
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
      )
   ),
);

$conditionFilterByTime = "`[PREFIX]tm_submissions`.`sDate` > CURRENT_TIMESTAMP() - interval 2 day OR `[PREFIX]tm_submissions`.`bEvaluated` = 0";

$viewModels['byTimeSubmission'] = array (
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
         "timeRecentSubmissions" => array (
            "joins" => array("tm_submissions"),
            "condition" => $conditionFilterByTime,
            "ignoreValue" => true
         )
      )
   ),
   /* Not needed : we only display the main header.
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
            "condition" => "`[PREFIX]tm_submissions`.`id` = :[PREFIX_FIELD]idSubmission"
         )
      ),
   ),*/
   /*
   "tm_tasks_tests" => array (
      "mainTable" => "tm_tasks_tests",
      "joins" => array (
         "tm_submissions" => array ("srcTable" => "tm_tasks_tests", "srcField" => "idTask", "dstField" => "idTask")
         ),
      "fields" => array(
         "idTask" => array(),
         "sGroupType" => array(),
         "sOutput3" => array(),
         "iRank" => array(),
         "idSubtask" => array(),
      ),
      "filters" => array (
         "idSubmission" => array (
            "joins" => array ("tm_submissions"),
            "condition" => "`[PREFIX]tm_submissions`.`id` = :[PREFIX_FIELD]idSubmission"
         )
      ),
   ),
   */
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
         "timeRecentSubmissions" => array (
            "joins" => array(),
            "condition" => $conditionFilterByTime,
            "ignoreValue" => true
         )
      )
   ),     
   "tm_submissions_tests" => array (
      "mainTable" => "tm_submissions_tests",
      "joins" => array (
         "tm_tasks_tests" => array ("srcTable" => "tm_submissions_tests", "srcField" => "idTest", "dstField" => "ID"),
         "tm_submissions" => array ("srcTable" => "tm_submissions_tests", "srcField" => "idSubmission", "dstField" => "ID")
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
         "test_sOutput3" => array("tableName" => "tm_tasks_tests", "fieldName" => "sOutput3"),
         "test_iRank" => array("tableName" => "tm_tasks_tests", "fieldName" => "iRank"),
         "test_idSubtask" => array("tableName" => "tm_tasks_tests", "fieldName" => "idSubtask")
      ),     
      "filters" => array (
         "timeRecentSubmissions" => array (
            "joins" => array("tm_submissions"),
            "condition" => $conditionFilterByTime,
            "ignoreValue" => true
         )
      )
   ),
   
   "tm_submissions_subtasks" => array (
      "mainTable" => "tm_submissions_subtasks",
      "joins" => array (
         "tm_tasks_subtasks" => array ("srcTable" => "tm_submissions_subtasks", "srcField" => "idSubtask", "dstField" => "ID"),
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
         "timeRecentSubmissions" => array (
            "joins" => array("tm_submissions"),
            "condition" => $conditionFilterByTime,
            "ignoreValue" => true
         )
      )
   ),
);
