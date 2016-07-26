'strict';

var app;

try {
   angular.module("submission-manager");
   app = angular.module('pemTask', ['ui.bootstrap','fioi-editor2', 'ui.ace', 'submission-manager']);
} catch(err) {
   app = angular.module('pemTask', ['ui.bootstrap','fioi-editor2', 'ui.ace']);
}

// 'cpp', 'cpp11', 'python', 'python2', 'python3', 'ocaml', 'javascool', 'c', 'java', 'pascal', 'shell'
app.service('Languages', function () {
   'use strict';

   this.allSourceLanguages = [
      {id: 'c', label: "C", ext: 'c', ace: {mode: 'c_cpp'}},
      {id: 'cpp', label: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'ocaml', label: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
      {id: 'java', label: "Java", ext: 'java', ace: {mode: 'java'}},
      {id: 'javascool', label: "JavaScool", ext: 'jvs', ace: {mode: 'java'}},
      {id: 'python', label: "Python3", ext: 'py', ace: {mode: 'python'}}
   ];

   this.testLanguages = [
      {id: 'text', label: 'Text', ext: 'txt', ace: {mode: 'text'}}
   ];

   this.sourceLanguages = this.allSourceLanguages;

   this.initialize = function(sSupportedLanguages) {
      var self = this;
      var aimedDefaultLanguage = 'c'; // TODO: ?
      if (sSupportedLanguages == '*' || !sSupportedLanguages) {
         self.defaultLanguage = aimedDefaultLanguage;
         return;
      }
      this.sourceLanguages=[];
      var supportedLanguagesArray = sSupportedLanguages.split(',');
      var supportedLanguagesObject = {};
      _.forEach(supportedLanguagesArray, function(lang) {
         supportedLanguagesObject[lang] = true;
      });
      _.forEach(this.allSourceLanguages, function(lang) {
         if (supportedLanguagesObject[lang.id]) {
            self.sourceLanguages.push(lang);
            if (!self.defaultLanguage || lang.id == aimedDefaultLanguage) {
               self.defaultLanguage = lang.id;
            }
         }
      });
   }
});

app.service('TabsetConfig', ['Languages', 'FioiEditor2Tabsets', function (Languages, tabsets) {
   'use strict';

   this.testsSourcesTabsetConfig = {
      languages: Languages.testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      typeName: 'test'
   };

   this.testsTabsetConfig = {
      languages: Languages.testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      buffersPerTab: 2,
      typeName: 'test',
      bufferNames: ['Entrée', 'Sortie attendue']
   };

   this.initialize = function (task) {
      this.sourcesTabsetConfig = {
         languages: Languages.sourceLanguages,
         defaultLanguage: Languages.defaultLanguage,
         titlePrefix: 'Code',
         typeName: 'code'
      };
      tabsets.add().update({name: 'sources'}).update(this.sourcesTabsetConfig);
      tabsets.add().update({name: 'tests'}).update(this.testsTabsetConfig);
      tabsets.add().update({name: 'testSources'}).update(this.testsSourcesTabsetConfig);
   };

   this.configureSources = function (tabset) {
      return tabset.update(this.sourcesTabsetConfig);
   };

   this.configureTestSources = function (tabset) {
      return tabset.update(this.testsSourcesTabsetConfig);
   };

   this.configureTests = function (tabset) {
      return tabset.update(this.testsTabsetConfig);
   };

   // used at beginning of recording replay
   this.configureTabsets = function() {
      this.configureSources(tabsets.find('sources'));
      this.configureTests(tabsets.find('tests'));
   };

}]);

app.directive('dynamicCompile', ['$compile', function($compile) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamicCompile, function(html) {
         ele.html(html);
         $compile(ele.contents())(scope);
      });
    }
  };
}]);


app.directive('specificTo', ['$rootScope', function($rootScope) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    transclude: true,
    link: function(scope, el, attrs, ctrl, transclude) {
      if (!attrs.specificTo) return;
      var langs = _.split(attrs.specificTo, /[ ,;]+/);
      langs = _.keyBy(langs, function(o) { return o; });
      function init() {
         if (langs[$rootScope.sLangProg]) {
            el.append(transclude());
         }
      }
      init();
    }
  };
}]);

app.directive('currentLang', ['Languages', '$rootScope', function(Languages, $rootScope) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    link: function (scope, ele, attrs) {
      function getLangToPrint(lang) {
         res = '';
         _.forEach(Languages.sourceLanguages, function(langInfos) {
            if (langInfos.id == lang) {
               res = langInfos.label;
               return false;
            }
         });
         return res;
      }
      ele.html(getLangToPrint($rootScope.sLangProg));
    }
  };
}]);

app.controller('taskController', ['$scope', '$http', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'PEMApi', '$sce', '$rootScope', 'TabsetConfig', '$timeout', '$interval', '$window', 'Languages', function($scope, $http, tabsets, signals, recorder, PEMApi, $sce, $rootScope, TabsetConfig, $timeout, $interval, $window, Languages) {
   'use strict';

   // XXX: this is temporary, for the demo, the variables should be sent according to token instead of url
   function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec($window.location.toString());
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
   }
   var mode = getParameterByName('mode');
   if (mode !== 'record' && mode != 'replay')
      mode = 'normal';
   $scope.mode = mode;

   $scope.standaloneMode = false;
   if (typeof SyncQueue === 'undefined') { // a bit arbitrary...
      $scope.standaloneMode = true;
   }

   if (!$scope.standaloneMode) {
      ModelsManager.init(models);
      SyncQueue.init(ModelsManager);
      SyncQueue.params.action = 'getAll';
      $rootScope.sToken = decodeURIComponent(getParameterByName('sToken'));
      $rootScope.taskId = decodeURIComponent(getParameterByName('taskId'));
      $rootScope.sPlatform = decodeURIComponent(getParameterByName('sPlatform'));
      if (!$rootScope.sPlatform) { // TODO: for tests only, to be removed
         $rootScope.sPlatform = 'http://algorea.pem.dev';
      }
      SyncQueue.params.sPlatform = $rootScope.sPlatform;
      SyncQueue.params.sToken = $rootScope.sToken;
      SyncQueue.params.taskId = $rootScope.taskId;
      SyncQueue.params.getSubmissionTokenFor = {};
   }

   $rootScope.sLanguage = 'fr'; // TODO: configure it... where?
   $rootScope.sLangProg = 'python'; // TODO: idem

   // TODO: maybe this should be done with sync?
   // TODO put it in state (getState/reloadState)
   $scope.saveEditors = function (success, error) {
      var source_tabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         source_tabset = tabsets.find('testSources');
      }
      var source_tabs   = source_tabset.getTabs();
      var active_tab    = source_tabset.getActiveTab();
      var aSources = _.map(source_tabs, function (tab) {
         var buffer = tab.getBuffer().pullFromControl();
         return {
            sName: tab.title,
            sSource: buffer.text,
            sLangProg: buffer.language,
            bActive: tab === active_tab
         };
      });
      var test_tabset = tabsets.find('tests');
      var test_tabs   = test_tabset.getTabs();
      active_tab      = test_tabset.getActiveTab();
      var aTests  = _.map(test_tabs, function (tab) {
         var inputBuffer  = tab.getBuffer(0).pullFromControl();
         var outputBuffer = tab.getBuffer(1).pullFromControl();
         return {
            sName: tab.title,
            sInput: inputBuffer.text,
            sOutput: outputBuffer.text,
            bActive: tab === active_tab
         };
      });
      $http.post('saveEditors.php', 
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, aSources: aSources, aTests: aTests},
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            if (error) {
               error('error calling saveEditors.php'+(postRes ? ': '+postRes.sError : ''));
            } else {
               console.error('error calling saveEditors.php'+(postRes ? ': '+postRes.sError : ''));
            }
         } else if (success) {
            success('');
         }
         // everything went fine
      });
   };

   PEMApi.task.getState = function(success, error) {
      $scope.saveEditors(success, error);
   };

   $scope.initSourcesEditorsData = function() {
      var source_codes = ModelsManager.getRecords('tm_source_codes');
      var sourcesTabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         sourcesTabset = tabsets.find('testSources');
      }
      sourcesTabset.clear();
      // sorted non-submission source codes
      var editorCodeTabs = _.sortBy(_.filter(source_codes, {bSubmission: false}), 'iRank');
      var activeTabRank = null;
      var hasSourceCode = false;
      _.forEach(editorCodeTabs, function(source_code) {
         if (!source_code.bSubmission && source_code.sType == 'User') {
            hasSourceCode = true;
            var code = sourcesTabset.addTab().update({title: source_code.sName});
            code.getBuffer().update({text: source_code.sSource, language: source_code.params.sLangProg});
            if (source_code.bActive) {
               activeTabRank = source_code.iRank;
            }
         }
      });
      // activate tab
      if (activeTabRank !== null) {
         var tab = sourcesTabset.getTabs()[activeTabRank-1];
         if (tab) {
            sourcesTabset.update({activeTabId: tab.id});
         }
      }
      if (!hasSourceCode) {
         var code = sourcesTabset.addTab();
         code.getBuffer().update({text: '', language: Languages.defaultLanguage});
      }
      $timeout(function() {
         sourcesTabset.focus();
      });
   };

   $scope.initTestsEditorsData = function() {
      var tests = ModelsManager.getRecords('tm_tasks_tests');
      var testsTabset = tabsets.find('tests');
      var editorCodeTabs = _.sortBy(tests, 'iRank');
      var activeTabRank = null;
      var hasTests = false;
      _.forEach(editorCodeTabs, function(test) {
         hasTests = true;
         var code = testsTabset.addTab().update({title: test.sName});
         if (!test.sInput) test.sInput = '';
         if (!test.sOutput) test.sOutput = '';
         code.getBuffer(0).update({text: test.sInput});
         code.getBuffer(1).update({text: test.sOutput});
      });
      if (!hasTests) {
         testsTabset.addTab();
      }
   };

   $scope.initHints = function() {
      
   };

   $scope.taskContent = '';
   $scope.solutionContent = '';

   function initEvalResultScript(tm_task) {
      var scriptName = tm_task.sEvalResultOutputScript;
      var baseUrl = window.config.evalResultOutputScriptBaseUrl;
      require([baseUrl+scriptName+'.js'], function (res) {
         tm_task.displayChecker = res.displayChecker;
      });
   }

   function initScriptAnimation(tm_task) {
      // Load animation
      $('head').append('<script type="text/javascript">' + tm_task.sScriptAnimation + '</script>');
      // Wait for enough time for everything to be loaded
      setTimeout(function() { simulationInstance("#simuDemo", animationFeatures("#simuDemo"), animationExampleCmds) }, 2000);
   }

   $scope.initTask = function() {
      // get task
      _.forOwn(ModelsManager.getRecords('tm_tasks'), function(tm_task) {
         $rootScope.tm_task = tm_task;
         $rootScope.idTask = tm_task.ID;
         return false;
      });
      // apply strings if already present
      _.forOwn(ModelsManager.getRecords('tm_tasks_strings'), function(tm_strings) {
         updateStringsFromSync(tm_strings);
         return false;
      });
      if ($rootScope.tm_task.sScriptAnimation) {
         initScriptAnimation($rootScope.tm_task);
      }
      if ($rootScope.tm_task.sEvalResultOutputScript) {
         initEvalResultScript($rootScope.tm_task);
      }
      Languages.initialize($rootScope.tm_task.sSupportedLangProg);
      TabsetConfig.initialize($rootScope.tm_task);
      PEMApi.init();
   };

   if (!$scope.standaloneMode) {
      SyncQueue.addSyncEndListeners('initData', function() {
         $scope.$apply(function() {
            $scope.initTask();
            $scope.initSourcesEditorsData();
            if ($rootScope.tm_task.bUserTests) {
               $scope.initTestsEditorsData();
            }
            $scope.initHints();
         });
         // we do it only once:
         SyncQueue.removeSyncEndListeners('initData');
      });
   } else {
      $scope.initTask();
      $scope.initSourcesEditorsData();
      if ($rootScope.tm_task.bUserTests) {
         $scope.initTestsEditorsData();
      }
      $scope.initHints();
   }

   $scope.saveSubmission = function(withTests, showSubmission, success, error) {
      // editor doesn't give correct result if not after a timeout
      $timeout(function() {
         $scope.doSaveSubmission(withTests, showSubmission, success, error);
      });
   };

   $scope.doSaveSubmission = function(withTests, showSubmission, success, error) {
      if (showSubmission) {
         $scope.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
         $scope.$evalAsync($scope.$apply);
      }
      var source_tabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         source_tabset = tabsets.find('testSources');
      }
      var source_tabs   = source_tabset.getTabs();
      var active_tab    = source_tabset.getActiveTab();
      var answerSourceCode, answerLangProg;
      if ($rootScope.tm_task.bTestMode) {
         var tests = _.map(source_tabs, function (tab) {
            var buffer = tab.getBuffer().pullFromControl();
            return {
               sName: tab.title,
               sInput: buffer.text
            };
         });
         answerSourceCode = JSON.stringify(tests);
         answerLangProg = 'text';
      } else {
         var buffer = tabsets.find('sources').getActiveTab().getBuffer().pullFromControl();
         answerSourceCode = buffer.text;
         answerLangProg = buffer.language;
      }
      var params = {
         sToken: $rootScope.sToken,
         sPlatform: $rootScope.sPlatform,
         taskId: $rootScope.taskId,
         oAnswer: {
            sSourceCode: answerSourceCode,
            sLangProg: answerLangProg
         }
      };
      var inputBuffer, outputBuffer;
      if (withTests == 'one') {
         var testTab = tabsets.find('tests').getActiveTab();
         inputBuffer  = testTab.getBuffer(0).pullFromControl();
         outputBuffer = testTab.getBuffer(1).pullFromControl();
         params.aTests = [{
            sInput: inputBuffer.text,
            sOutput: outputBuffer.text,
            sName: testTab.title
         }];
      } else if (withTests == 'all') {
         var test_tabs  = tabsets.find('tests').getTabs();
         params.aTests  = _.map(test_tabs, function (tab) {
            var inputBuffer  = tab.getBuffer(0).pullFromControl();
            var outputBuffer = tab.getBuffer(1).pullFromControl();
            return {
               sName: tab.title,
               sInput: inputBuffer.text,
               sOutput: outputBuffer.text
            };
         });
      }
      $http.post('saveSubmission.php', params, {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess || !postRes.idSubmission) {
            error('error calling saveSubmission.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         if (showSubmission) {
            $scope.curSubmissionID = postRes.idSubmission;
         }
         syncSubmissionUntil(postRes.idSubmission, function(submission) {
               return true;
            }, function() {}, error);
         success(postRes.idSubmission, answerSourceCode, answerLangProg, postRes.answer);
      }).error(error);
   };

   $scope.gradeSubmission = function(idSubmission, answerToken, success, error, taskParams) {
      $scope.curSubmissionID = idSubmission;
      $http.post('grader/gradeTask.php', 
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, idSubmission: $scope.curSubmissionID, answerToken: answerToken, taskParams: taskParams}, 
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            error('error calling grader/gradeTask.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         success(postRes.scoreToken);
      });
   };

   $scope.validateButtonDisabled = false;
   $scope.validateAnswer = function() {
      $scope.validateButtonDisabled = true;
      platform.validate('done', function(){$scope.validateButtonDisabled = false;$timeout($scope.$apply);});
      $scope.saveEditors();
   };

   $scope.loadSubmissionInEditor = function(submission) {
      if (!submission) {
         console.error('no submission!');
         return;
      }
      var source_code = submission.sourceCode;
      if (!source_code) {
         console.error('cannot find associated source code');
         return;
      }
      var sourcesTabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         sourcesTabset = tabsets.find('testSources');
      }
      sourcesTabset.clear();
      // TODO: handle testMode
      var code = sourcesTabset.addTab().update({title: 'Code 1'});
      code.getBuffer().update({text: source_code.sSource, language: source_code.params.sLangProg});
   };

   // here something a bit strange: initSourcesEditorData syncs the editor with ModelsManager.source_codes
   // but ModelsManager.source_codes is not filled by saveEditor, so we must not call initSourcesEditorData
   // at each reloadState, only when reloadAnswer has been called before.
   var answerReloaded = false;
   PEMApi.task.reloadState = function(state, success, error) {
      if (answerReloaded) {
         $scope.initSourcesEditorsData();
         answerReloaded = false;
      }
      success();
   };

   // answer can be the submission id directly or some json containing it:
   function getSubmissionIdFromAnswer(strAnswer) {
      if (/^\d+$/.test(strAnswer)) {
         return strAnswer;
      } else {
         try {
            var answer = JSON.parse(strAnswer);
            if (answer.idSubmission) {
               return answer.idSubmission;
            } else {
               console.error('no idSubmission in answer JSON!');
               return null;
            }
         } catch (e) {
            console.error('cannot parse json!');
            return null;
         }
      }
   }

   PEMApi.task.reloadAnswer = function(strAnswer, success, error) {
      answerReloaded = true;
      $scope.$apply(function() {
         if (!strAnswer) {
            // empty string is default answer in the API, so I guess this means
            // no submission...
            $scope.submission = null;
         } else {
            var submissionId = getSubmissionIdFromAnswer(strAnswer);
            if (!submissionId) {
               $scope.submission = null;
            } else {
               $scope.submission = ModelsManager.curData.tm_submissions[submissionId];
            }
         }
         $scope.loadSubmissionInEditor($scope.submission);
         success();
      });
   };

   PEMApi.task.getAnswer = function(success, error) {
      $scope.saveSubmission(null, false, function(idSubmission, sourceCode, langProg, answer) {
         success(answer);
      }, error);
   };

   function callAtEndOfSync(fun) {
      var randomId = ModelsManager.getRandomID();
      SyncQueue.addSyncEndListeners('tmp-'+randomId, function() {
         fun();
         SyncQueue.removeSyncEndListeners('tmp-'+randomId);
      });
   }

   // high level interface, read syncSubmissionUntil first
   var gradeSyncInterval;
   var syncSubmissionCallbacks = {};
   var syncSubmissionConditions = {};

   function submissionModelListener(submission) {
      if (submission.ID == $scope.curSubmissionID) {
         $scope.submission = submission;
      }
      if (syncSubmissionCallbacks[submission.ID]) {
         var conditionMet = syncSubmissionConditions[submission.ID](submission);
         if (conditionMet) {
            syncSubmissionCallbacks[submission.ID](submission);
            delete(syncSubmissionCallbacks[submission.ID]);
            delete(syncSubmissionConditions[submission.ID]);
            delete SyncQueue.params.getSubmissionTokenFor[submission.ID];
            if (_.isEmpty(syncSubmissionCallbacks)) {
               $interval.cancel(gradeSyncInterval);
               gradeSyncInterval = null;
            }
         }
      }
   }

   ModelsManager.addListener('tm_submissions', "inserted", 'taskController', submissionModelListener, true);
   ModelsManager.addListener('tm_submissions', "updated", 'taskController', submissionModelListener, true);

   function syncSubmissionUntil(idSubmission, condition, success, error, answerToken) {
      SyncQueue.params.getSubmissionTokenFor[idSubmission] = answerToken;
      if (!gradeSyncInterval) {
            SyncQueue.planToSend(0);
            gradeSyncInterval = $interval(function() {SyncQueue.planToSend(0);}, 2000);
      }
      syncSubmissionCallbacks[idSubmission] = success;
      syncSubmissionConditions[idSubmission] = condition;
   }
   // end of high level interface

   PEMApi.task.gradeAnswer = function(answerStr, answerToken, success, error) {
      var idSubmission = getSubmissionIdFromAnswer(answerStr);
      PEMApi.platform.getTaskParams(null, null, function(taskParams) {
         $scope.gradeSubmission(idSubmission, answerToken, function() {
            syncSubmissionUntil(idSubmission, function(submission) {
               return submission.bEvaluated;
            }, function(submission) {
               var message = 'test message'; // TODO!
               success(submission.iScore, message, submission.scoreToken);
            }, error, answerToken);
         }, error, taskParams);
      }, error);
   };

   function defaultErrorCallback() {
      console.error(arguments);
   }

   $scope.runCurrentTest = function() {
      $scope.saveSubmission('one', true, function(idSubmission){
         $scope.gradeSubmission(idSubmission, null, function() {
            syncSubmissionUntil(idSubmission, function(submission) {
               return submission.bEvaluated;
            }, function() {/*$interval($scope.$apply)*/}, defaultErrorCallback, null);
         }, defaultErrorCallback);
      }, defaultErrorCallback);
   };

   $scope.runAllTests = function() {
      $scope.saveSubmission('all', true, function(idSubmission){
         $scope.gradeSubmission(idSubmission, null, function() {
            syncSubmissionUntil(idSubmission, function(submission) {
               return submission.bEvaluated;
            }, function() {}, defaultErrorCallback, null);
         }, defaultErrorCallback);
      }, defaultErrorCallback);
   };

   // TODO: do the opposite before sending data to server (and make ModelsManager provide a hook for it)
   function expandSourceCodeParams(sourceCode) {
      if (!sourceCode.sSource) sourceCode.sSource = '';
      if (sourceCode.sParams && typeof sourceCode.sParams == 'string') {
         try {
            sourceCode.params = $.parseJSON(sourceCode.sParams);
         } catch(e) {
            console.error('couldn\'t parse '+sourceCode.sParams);
         }
      }
   }

   function updateStringsFromSync(strings) {
      $scope.taskContent = strings.sStatement;
      $scope.taskTitle = $sce.trustAsHtml(strings.sTitle);
      $scope.solutionContent = strings.sSolution;
   }

   ModelsManager.addListener('tm_source_codes', "inserted", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_source_codes', "updated", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_tasks_strings', "inserted", 'TaskController', updateStringsFromSync, true);
   ModelsManager.addListener('tm_tasks_strings', "updated", 'TaskController', updateStringsFromSync, true);

   if (!$scope.standaloneMode) {
      // TODO: find a better pattern for this
      SyncQueue.addSyncEndListeners('update_tm_recordings', function() {
         $scope.$apply(function() {
            $rootScope.recordings = ModelsManager.getRecords('tm_recordings');
         });
      });
      SyncQueue.planToSend(0);
   }

}]);
