'strict';

var app = angular.module('pemTask', ['ui.bootstrap','submission-manager','fioi-editor2', 'ui.ace', 'angular-bind-html-compile']);

// 'cpp', 'cpp11', 'python', 'python2', 'python3', 'ocaml', 'javascool', 'c', 'java', 'pascal', 'shell'
app.service('Languages', function () {
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

}]);

app.run(['TabsetConfig', function (TabsetConfig) {
   TabsetConfig.initialize();
}]);

app.controller('taskController', ['$scope', '$http', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', '$sce', '$rootScope', 'TabsetConfig', '$timeout', function($scope, $http, tabsets, signals, recorder, $sce, $rootScope, TabsetConfig, $timeout) {

   // XXX: this is temporary, for the demo, the variables should be sent according to token instead of url
   function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
   }
   var mode = getParameterByName('mode');
   console.error(mode);
   if (mode !== 'record' && mode != 'replay')
      mode = 'normal';
   console.error(mode);
   $scope.mode = mode;

   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params.action = 'getAll';
   SyncQueue.params.sToken = window.sToken;
   SyncQueue.params.sPlatform = window.sPlatform;

   $rootScope.sLanguage = 'fr'; // TODO: configure it... where?
   $rootScope.sLangProg = 'cpp'; // TODO: idem

   task.reloadAnswer = function(strAnswer, callback) {
      $scope.$apply(function() {
         if (!strAnswer) {
            // empty string is default answer in the API, so I guess this means
            // no submission...
            $scope.submission = null;
         } else {
            $scope.submission = ModelsManager.curData.tm_submissions[strAnswer];
         }
         $scope.curSubmission = strAnswer;
         callback();
      });
   };

   // TODO: maybe this should be done with sync?
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
            {sToken: sToken, sPlatform: sPlatform, aSources: aSources, aTests: aTests},
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
         if (!source_code.bSubmission) {
            var code = sourcesTabset.addTab().update({title: source_code.sName, language: source_code.params.sLangProg});
            code.getBuffer().update({text: source_code.sSource});
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

   $scope.submitAnswer = function() {
      // TODO: collect sources files from the 'sources' tabset and send them to saveAnswer.php?
      this.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
      var buffer = tabsets.find('sources').getActiveTab().getBuffer();
      var params = {
         sToken: sToken,
         sPlatform: SyncQueue.params.sPlatform,
         oAnswer: {
            sSourceCode: buffer.text,
            sLangProg: buffer.language
         }
      };
      $http.post('saveAnswer.php', params, {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            console.error('error calling saveAnswer.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         $scope.curSubmission = postRes.sAnswer;
         $http.post('grader/gradeTask.php', {sToken: sToken, sPlatform: SyncQueue.params.sPlatform, sAnswer: postRes.sAnswer}, {responseType: 'json'}).success(function(postRes) {
            if (!postRes || !postRes.bSuccess) {
               console.error('error calling grader/gradeTask.php'+(postRes ? ': '+postRes.sError : ''));
               return;
            }
         });
      });
   };

   updateSubmissionFromSync = function(submission) {
      if (submission.ID == $scope.curSubmission) {
         $scope.$apply(function() {
            $scope.submission = submission;
         });
      }
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

   function callAtEndOfSync(fun) {
      var randomId = ModelsManager.getRandomID();
      SyncQueue.addSyncEndListeners('tmp-'+randomId, function() {
         fun();
         SyncQueue.removeSyncEndListeners('tmp-'+randomId);
      });
   }

   function updateStringsFromSync(strings) {
      if (strings.sLanguage == $scope.sLanguage) {
         // warning: tricks here! For convoluted reasons, we don't want to update
         // taskContent nor solutionContent before the end of the synchro (mainly
         // because they reference "solutions" which might not be present yet).
         callAtEndOfSync(function() {
            $scope.$apply(function() {
               $scope.taskContent = $sce.trustAsHtml(strings.sStatement);
               $scope.solutionContent = $sce.trustAsHtml(strings.sSolution);
            });
         });
      }
   }

   ModelsManager.addListener('tm_source_codes', "inserted", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_source_codes', "updated", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_submissions', "inserted", 'TaskController', updateSubmissionFromSync);
   ModelsManager.addListener('tm_submissions', "updated", 'TaskController', updateSubmissionFromSync);
   ModelsManager.addListener('tm_tasks_strings', "inserted", 'TaskController', updateStringsFromSync);
   ModelsManager.addListener('tm_tasks_strings', "updated", 'TaskController', updateStringsFromSync);

   // TODO: find a better pattern for this
   SyncQueue.addSyncEndListeners('update_tm_recordings', function() {
      $scope.$apply(function() {
         $rootScope.recordings = ModelsManager.getRecords('tm_recordings');
      });
   });

   SyncQueue.sync();
   setInterval(SyncQueue.planToSend, 5000);

}]);
