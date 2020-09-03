window.models =
{
   tm_hints:
   {
      fields:
      {
         idTask: {type : "key", invLink: "hints", refModel: "tm_tasks"},
         iRank: {type : "int"}
      },
      links:
      {
         strings: {refModel: "tm_hints_strings", key: "idHint", type: "array"},
      }
   },
   tm_hints_strings:
   {
      fields:
      {
         idHint: {type : "key", invLink: "strings", refModel: "tm_hints"},
         sLanguage: {type : "string"},
         sContent: {type : "sting"}
      }
   },
   tm_recordings:
   {
      fields:
      {
         idTask: {type : "key"},
         sData: {type : "string"},
         sDateCreation: {type: "jsdate"}
      }
   },
   tm_solutions:
   {
      fields:
      {
         idTask: {type : "key"},
         sLangProg: {type : "string"},
         sGroup: {type : "string"}
      },
      links:
      {
         strings: {refModel: "tm_solutions_strings", key: "idSolution", type: "array"},
      },
      indexes: [
         {name: "solution_group_lang", keys: ["sGroup", "sLangProg"]}
      ]
   },
   tm_solutions_strings:
   {
      fields:
      {
         idSolution: {type : "key", invLink: "strings", refModel: "tm_solutions"},
         sLanguage: {type : "string"},
         sSource: {type : "string"},
      }
   },
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
         bEditable: {type : "boolean"},
         bActive: {type: "boolean"},
         bSubmission: {type: "boolean"},
         sType: {type: "string"},
         iRank: {type: "int"}
      }
   },
   tm_submissions:
   {
      fields:
      {
         idUser: {type : "key"},
         idTask: {type : "key", refModel : "tm_tasks", link: "task", invLink: "submissions"},
         sDate: {type: "jsdate"},
         idSourceCode: {type : "key", refModel : "tm_source_codes", link: "sourceCode"},
         bManualCorrection: {type : "boolean"},
         bSuccess: {type : "boolean"},
         nbTestsTotal: {type : "int"},
         nbTestsPassed: {type : "int"},
         iScore: {type : "int"},
         bCompilError: {type : "boolean"},
         sCompilMsg: {type : "string"}, 
         sErrorMsg: {type : "string"}, 
         sFirstUserOutput: {type : "string"}, 
         sFirstExpectedOutput: {type : "string"}, 
         sManualScoreDiffComment: {type : "string"}, 
         bEvaluated: {type : "boolean"},
         sMode: {type: "enum"},
         iChecksum: {type : "int"},
         task_sScriptAnimation: {type : "string"},
         task_sEvalResultOutputScript: {type : "string"},
         scoreToken: {type: "string"}
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
         bSuccess: {type : "boolean"},
         iScore: {type : "int"},
         idSubtask: {type : "key"},
         idSubmission: {type : "key", invLink: "submissionSubtasks", refModel: "tm_submissions"},
         subtask_idTask: {type: "key"},
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
         idSubmission: {type : "key", invLink: "tests", refModel: "tm_submissions", link: "submission"},
         idTest: {type : "key"},
         iScore: {type : "int"},
         iTimeMs: {type : "int"},
         iMemoryKb: {type : "int"},  
         iErrorCode: {type : "int"},
         sOutput: {type : "string"}, 
         sExpectedOutput: {type : "string"}, 
         sLog: {type : "string"},
         jFiles: {type : "string"},
         bNoFeedback: {type: "boolean"},
         sErrorMsg: {type : "string"},
         idSubmissionSubtask: {type: "key", invLink: "submissionTests", refModel: "tm_submissions_subtasks", link: "submissionSubtask"},
         test_idTask: {type : "key"},
         test_sGroupType: {type : "string"},
         test_sOutput: {type : "string"},
         test_iRank: {type : "int"},
         test_idSubtask: {type : "int"},
         test_sName: {type : "string"}
      }
   },
   tm_tasks:
   {
      fields:
      {
         sScriptAnimation: {type: "string"},
         nbHintsTotal: {type: "int"},
         sSupportedLangProg: {type: "string"},
         sEvalTags: {type: "string"},
         bShowLimits: {type: "boolean"},
         bEditorInStatement: {type: "boolean"},
         bUserTests: {type: "boolean"},
         bUseLatex: {type: "boolean"},
         iTestsMinSuccessScore: {type: "int"},
         bIsEvaluable: {type: "boolean"},
         sEvalResultOutputScript: {type: "string"},
         sDefaultEditorMode: {type: "string"},
         bTestMode: {type: "boolean"},
         sTaskPath: {type: "string"},
         bHasSubtasks: {type: "boolean"}
      },
      links:
      {
         submissions: {refModel: "tm_submissions", key: "idTask", type: "array"},
         limits: {refModel: "tm_tasks_limits", key: "idTask", type: "array"},
         strings: {refModel: "tm_tasks_strings", key: "idTask", type: "array"},
         hints: {refModel: "tm_hints", key: "idTask", type: "array"}
      }
   },
   tm_tasks_limits:
   {
      fields:
      {
         idTask: {type: "key", refModel : "tm_tasks", invLink: "limits"},
         sLangProg: {type: "string"},
         iMaxTime: {type: "int"},
         iMaxMemory: {type: "int"},
      }
   },
   tm_tasks_strings:
   {
      fields:
      {
         idTask: {type: "key", refModel : "tm_tasks", invLink: "strings"},
         sLanguage: {type: "string"},
         sTitle: {type: "string"},
         sStatement: {type: "string"},
         sSolution: {type: "string"}
      }
   },
   tm_tasks_tests:
   {
      fields:
      {
         idTask: {type: "key"},
         idSubtask: {type: "key"},
         idSubmission: {type: "key"},
         sGroupType: {type: "enum"},
         idUser: {type: "key"},
         idPlatform: {type: "int"},
         sOutput: {type: "string"},
         sInput: {type: "string"},
         sName: {type: "string"},
         iRank: {type: "int"},
         idSubtask: {type: "key"}
      }
   },
   tm_tasks_subtasks:
   {
      fields:
      {
         idTask: {type: "key"},
         name: {type: "string"},
         comments: {type: "string"},
         iPointsMax: {type: "int"},
         bActive: {type : "boolean"}
      }
   }
};
