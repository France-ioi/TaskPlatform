'strict';

var app = angular.module('pemTask', ['ui.bootstrap','submission-manager','fioi-editor2', 'ui.ace', 'angular-bind-html-compile']);

// 'cpp', 'cpp11', 'python', 'python2', 'python3', 'ocaml', 'javascool', 'c', 'java', 'pascal', 'shell'
app.service('Languages', function () {
   'use strict';

   this.sourceLanguages = [
      {id: 'c', label: "C", ext: 'c', ace: {mode: 'c_cpp'}},
      {id: 'cpp', label: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'ocaml', label: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
      {id: 'java', label: "Java", ext: 'java', ace: {mode: 'java'}},
      {id: 'javascool', label: "JavaScool", ext: 'jvs', ace: {mode: 'java'}},
      {id: 'python', label: "Python", ext: 'py', ace: {mode: 'python'}}
   ];
   this.testLanguages = [
      {id: 'text', label: 'Text', ext: 'txt', ace: {mode: 'text'}}
   ];
});

app.service('TabsetConfig', ['Languages', 'FioiEditor2Tabsets', function (Languages, tabsets) {
   'use strict';

   this.sourcesTabsetConfig = {
      languages: Languages.sourceLanguages,
      defaultLanguage: 'cpp',
      titlePrefix: 'Code'
   };

   this.testsTabsetConfig = {
      languages: Languages.testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      buffersPerTab: 2
   };

   this.initialize = function () {
      tabsets.add().update({name: 'sources'}).update(this.sourcesTabsetConfig);
      tabsets.add().update({name: 'tests'}).update(this.testsTabsetConfig);
   };

   this.configureSources = function (tabset) {
      return tabset.update(this.sourcesTabsetConfig);
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

app.run(['TabsetConfig', function (TabsetConfig) {
   TabsetConfig.initialize();
}]);

app.directive('dynamicCompile', ['$compile', function($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamicCompile, function(html) {
         ele.html(html);
         $compile(ele.contents())(scope);
      });
    }
  };
}]);

app.controller('taskController', ['$scope', '$http', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'PEMApi', '$sce', '$rootScope', 'TabsetConfig', '$timeout', '$interval', '$window', function($scope, $http, tabsets, signals, recorder, PEMApi, $sce, $rootScope, TabsetConfig, $timeout, $interval, $window) {
   'use strict';

   // XXX: this is temporary, for the demo, the variables should be sent according to token instead of url
   function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec($window.location.search);
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
   }
   var mode = getParameterByName('mode');
   if (mode !== 'record' && mode != 'replay')
      mode = 'normal';
   $scope.mode = mode;

   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params.action = 'getAll';
   $rootScope.sToken = decodeURIComponent(getParameterByName('sToken'));
   $rootScope.sPlatform = decodeURIComponent(getParameterByName('sPlatform'));
   if (!$rootScope.sPlatform) { // TODO: for tests only, to be removed
      $rootScope.sPlatform = 'http://algorea.pem.dev';
   }
   SyncQueue.params.sPlatform = $rootScope.sPlatform;
   SyncQueue.params.sToken = $rootScope.sToken;
   SyncQueue.params.getSubmissionTokenFor = {};

   $rootScope.sLanguage = 'fr'; // TODO: configure it... where?
   $rootScope.sLangProg = 'cpp'; // TODO: idem

   // TODO: maybe this should be done with sync?
   // TODO put it in state (getState/reloadState)
   $scope.saveEditors = function () {
      var source_tabset = tabsets.find('sources');
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
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, aSources: aSources, aTests: aTests},
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            console.error('error calling saveEditors.php'+(postRes ? ': '+postRes.sError : ''));
         }
         // everything went fine
      });
   };

   $scope.initSourcesEditorsData = function() {
      var source_codes = ModelsManager.getRecords('tm_source_codes');
      var sourcesTabset = tabsets.find('sources');
      // sorted non-submission source codes
      var editorCodeTabs = _.sortBy(_.where(source_codes, {bSubmission: false}), 'iRank');
      var activeTabRank = null;
      _.forEach(editorCodeTabs, function(source_code) {
         if (!source_code.bSubmission && source_code.sType == 'User') {
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
      $timeout(function() {
         sourcesTabset.focus();
      });
   };

   $scope.initTestsEditorsData = function() {
      var tests = ModelsManager.getRecords('tm_tasks_tests');
      var testsTabset = tabsets.find('tests');
      var editorCodeTabs = _.sortBy(tests, 'iRank');
      var activeTabRank = null;
      _.forEach(editorCodeTabs, function(test) {
         var code = testsTabset.addTab().update({title: test.sName});
         code.getBuffer(0).update({text: test.sInput});
         code.getBuffer(1).update({text: test.sOutput});
      });
   };

   $scope.initHints = function() {
      
   };

   $scope.initTask = function() {
      // get task
      _.forOwn(ModelsManager.getRecords('tm_tasks'), function(tm_task) {
         $rootScope.tm_task = tm_task;
         return false;
      });
      PEMApi.init();
   };

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

   $scope.saveSubmission = function(withTests, success, error) {
      $scope.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
      var buffer = tabsets.find('sources').getActiveTab().getBuffer();
      var params = {
         sToken: $rootScope.sToken,
         sPlatform: $rootScope.sPlatform,
         oAnswer: {
            sSourceCode: buffer.text,
            sLangProg: buffer.language
         }
      };
      if (withTests == 'one') {
         var testTab = tabsets.find('tests').getActiveTab();
         params.aTests = [{
            sInput: testTab.getBuffer(0).text,
            sOutput: testTab.getBuffer(1).text,
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
         $scope.curSubmissionID = postRes.idSubmission;
         success(postRes.idSubmission);
      }).error(error);
   };

   $scope.gradeSubmission = function(idSubmission, answerToken, success, error, taskParams) {
      $http.post('grader/gradeTask.php', 
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, idSubmission: $scope.curSubmissionID, answerToken: answerToken, taskParams: taskParams}, 
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            error('error calling grader/gradeTask.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         success(postRes.scoreToken);
      });
   };

   $scope.validateAnswer = function() {
      platform.validate('done', function(){});
   };

   PEMApi.task.reloadAnswer = function(strAnswer, success, error) {
      $scope.$apply(function() {
         if (!strAnswer) {
            // empty string is default answer in the API, so I guess this means
            // no submission...
            $scope.submission = null;
         } else {
            $scope.submission = ModelsManager.curData.tm_submissions[strAnswer];
         }
         $scope.curSubmissionID = strAnswer;
         success();
      });
   };

   PEMApi.task.getAnswer = function(success, error) {
      $scope.saveSubmission(null, success, error);
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

   PEMApi.task.gradeAnswer = function(idSubmission, answerToken, success, error) {
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
      $scope.saveSubmission('one', function(idSubmission){
         $scope.gradeSubmission(idSubmission, null, function() {
            syncSubmissionUntil(idSubmission, function(submission) {
               return submission.bEvaluated;
            }, function() {/*$interval($scope.$apply)*/}, defaultErrorCallback);
         }, defaultErrorCallback);
      }, defaultErrorCallback);
   };

   $scope.runAllTests = function() {
      $scope.saveSubmission('all', function(idSubmission){
         $scope.gradeSubmission(idSubmission, null, function() {
            syncSubmissionUntil(idSubmission, function(submission) {
               return submission.bEvaluated;
            }, function() {}, defaultErrorCallback);
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

   $scope.taskContent = '';
   $scope.solutionContent = '';

   function updateStringsFromSync(strings) {
      //if (strings.sLanguage == $scope.sLanguage) {
         var taskContent = strings.sStatement;
         // yeark...
         //taskContent = _.replace(taskContent, '<h3 id="constraints">Constraints</h3>', '<h3 id="constraints">Constraints</h3><task-limits task="tm_task" sLangProg="sLangProg"></task-limits>');
         $scope.taskContent = taskContent;
         $scope.taskTitle = $sce.trustAsHtml(strings.sTitle);
         $scope.solutionContent = strings.sSolution;
      //}
   }

   ModelsManager.addListener('tm_source_codes', "inserted", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_source_codes', "updated", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_tasks_strings', "inserted", 'TaskController', updateStringsFromSync, true);
   ModelsManager.addListener('tm_tasks_strings', "updated", 'TaskController', updateStringsFromSync, true);

   // TODO: find a better pattern for this
   SyncQueue.addSyncEndListeners('update_tm_recordings', function() {
      $scope.$apply(function() {
         $rootScope.recordings = ModelsManager.getRecords('tm_recordings');
      });
   });

   SyncQueue.planToSend(0);

}]);
