var models =
{
   tm_source_codes:
   {
      fields:
      {
         idUser: {type : "key"},
         idTask: {type : "key"},
         sDate: {type : "jsdate"},
         sParams: {type : "string"},
         sName: {type : "string"},
         sSource: {type : "string"},
         bEditable: {type : "int"}
      }
   },
   tm_submissions:
   {
      fields:
      {
         idUser: {type : "key"},
         idTask: {type : "key"},
         sDate: {type: "jsdate"},
         idSourceCode: {type : "key", refModel : "tm_source_codes", link: "sourceCode"},
         bManualCorrection: {type : "int"},
         iSuccess: {type : "int"},
         nbTestsTotal: {type : "int"},
         nbTestsPassed: {type : "int"},
         iScore: {type : "int"},
         bCompilError: {type : "int"},
         sCompilMsg: {type : "string"}, 
         sErrorMsg: {type : "string"}, 
         sFirstUserOutput: {type : "string"}, 
         sFirstExpectedOutput: {type : "string"}, 
         sManualScoreDiffComment: {type : "string"}, 
         bEvaluated: {type : "int"},
         sMode: {type: "enum"},
         iChecksum: {type : "int"},
         task_sScriptAnimation: {type : "string"}
      },
      links:
      {
         tests: {refModel: "tm_submissions_tests", key: "idSubmission", type: "array", orderBy: "test_iRank"},
         submissionSubtasks: {refModel: "tm_submissions_subtasks", key: "idSubmission", type: "array", orderBy: "subtask_iRank"}
      }
   },
   tm_submissions_subtasks:
   {
      fields:
      {
         iSuccess: {type : "int"},
         iScore: {type : "int"},
         idSubtask: {type : "key"},
         idSubmission: {type : "key", invLink: "submissionSubtasks", refModel: "tm_submissions"},
         subtask_idTask: {type: "int"},
         subtask_name: {type: "string"},
         subtask_comments: {type: "string"},
         subtask_iPointsMax: {type: "int"},
         subtask_iRank: {type: "int"}
      },
      links:
      {
         submissionTests: {refModel: "tm_submissions_tests", key: "idSubmissionSubtask", type: "array"}
      }
   },
   tm_submissions_tests:
   {
      fields:
      {
         idSubmission: {type : "key", invLink: "tests", refModel: "tm_submissions", },
         idTest: {type : "key"},
         iScore: {type : "int"},
         iTimeMs: {type : "int"}, 
         iErrorCode: {type : "int"},
         sOutput: {type : "string"}, 
         sExpectedOutput: {type : "string"}, 
         idSubmissionSubtask: {type: "key", invLink: "submissionTests", refModel: "tm_submissions_subtasks", link: "submissionSubtask"},
         test_idTask: {type : "int"},
         test_sGroupType: {type : "string"},
         test_sOutput3: {type : "string"},
         test_iRank: {type : "int"},
         test_idSubtask: {type : "int"}
      }
   },
   /*
   tm_tasks_tests:
   {
      fields:
      {
         idTask: {type: "key"},
         sGroupType: {type: "enum"},
         sOutput3: {type: "string"},
         iRank: {type: "int"},
         idSubtask: {type: "key"}
      }
   },
   */
   /*tm_tasks_subtasks:
   {
      fields:
      {
         idTask: {type: "key"},
         name: {type: "string"},
         comments: {type: "string"},
         iPointsMax: {type: "int"},
         weighting: {type: "int"}
      }
   }*/
};


