'strict';

var app = angular.module('pemTask', ['ui.bootstrap','submission-manager','fioi-editor2']);

// 'cpp', 'cpp11', 'python', 'python2', 'python3', 'ocaml', 'javascool', 'c', 'java', 'pascal', 'shell'
app.service('Languages', function () {
   this.sourceLanguages = [
      {id: 'c', label: "C", ext: 'c', ace: {mode: 'c_cpp'}},
      {id: 'cpp', label: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'ocaml', label: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
      {id: 'java', label: "Java", ext: 'java', ace: {mode: 'java'}},
      {id: 'javascool', label: "JavaScool", ext: 'jvs', ace: {mode: 'java'}},
      {id: 'python2', label: "Python", ext: 'py', ace: {mode: 'python'}}
   ];
});

app.run(['FioiEditor2Tabsets', 'Languages', function (tabsets, Languages) {
   var sampleCode = "#include \"lib.h\"\nconst int LARGEUR_MAX = 1000000;\nint destinationBille[LARGEUR_MAX+1];\nint main()\n{\n  for(int iPos = nbMarches() - 2; iPos >= 0; --iPos)\n  {\n    if(hauteur(iPos) < hauteur(iPos+1))\n      destinationBille[iPos] = iPos;\n    else\n      destinationBille[iPos] = destinationBille[iPos+1];\n  }\n  for(int iBille = 0; iBille < nbLancers(); ++iBille)\n  {\n    int posBille = marcheLancer(iBille);\n    positionFinale(destinationBille[posBille]);\n  }\n  return 0;\n}";
   var sources = tabsets.add('sources', {mode: 'sources', languages: Languages.sourceLanguages, titlePrefix: 'Code'});
   var code1 = sources.addTab({title: 'Code1', language: 'cpp'});
   var buffer = code1.addBuffer(sampleCode);
}]);

app.controller('taskController', ['$scope', '$http', 'FioiEditor2Tabsets', function($scope, $http, tabsets) {
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params.action = 'getAll';
   SyncQueue.params.sToken = window.sToken;
   SyncQueue.params.sPlatform = window.sPlatform;

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
   }

   $scope.saveEditors = function () {
      var source_tabset = tabsets.get('sources');
      var source_tabs   = source_tabset.getTabs();
      var active_tab    = source_tabset.activeTabName;
      var aSources = _.map(source_tabs, function (tab) {
         var buffer = tab.getBuffer();
         return {
            sName: tab.title,
            sSource: buffer.text,
            sLangProg: buffer.language,
            bActive: tab.name === active_tab
         };
      });
      $http.post('saveEditors.php', 
            {sToken: sToken, sPlatform: sPlatform, aSources: aSources}, 
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            console.error('error calling saveEditors.php'+(postRes ? ': '+postRes.sError : ''));
         }
         // everything went fine
      });
      /*
      var test_tabs = tabsets.get('tests').getTabs();
      var tests = _.map(source_tabs, function (tab) {
         return {
            sName: tab.title,
            sInput: tab.getBuffer(0).text,
            sOutput: tab.getBuffer(1).text
         };
      });
      console.log(tests);
      */
   };

   // fills editors with the data in ModelsManager
   $scope.initEditorsData = function() {
      var source_codes = ModelsManager.getRecords('tm_source_codes');
      var sources = tabsets.get('sources');
      _.forEach(source_codes, function(source_code) {
         if (!source_code.bSubmission) {
            console.log('ok, adding a tab');
            console.log(source_code);
            var code = sources.addTab({title: source_code.sName, language: source_code.params.sLangProg});
            code.addBuffer(source_code.sSource);
         }
      });
   };

   SyncQueue.addSyncEndListeners('initEditorsData', function() {
      $scope.initEditorsData();
      // we do it only once:
      SyncQueue.removeSyncEndListeners('initEditorsData');
   });

   $scope.submitAnswer = function() {
      // TODO: collect sources files from the 'sources' tabset and send them to saveAnswer.php?
      this.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
      var buffer = tabsets.get('sources').getActiveTab().getBuffer();
      var params = {
         sToken: sToken,
         sPlatform: SyncQueue.params.sPlatform,
         oAnswer: {
            sSourceCode: buffer.text,
            sLangProg: buffer.language
         }
      }
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
   }

   updateSubmissionFromSync = function(submission) {
      if (submission.ID == $scope.curSubmission) {
         $scope.$apply(function() {
            $scope.submission = submission;
         });
      }
   }

   SyncQueue.sync();
   setInterval(SyncQueue.planToSend, 5000);

   function expandSourceCodeParams(sourceCode) {
      if (sourceCode.sParams && typeof sourceCode.sParams == 'string') {
         try {
            sourceCode.sParams = $.parseJSON(sourceCode.sParams);
         } catch(e) {
            console.error('couldn\'t parse '+sourceCode.sParams);
         }
      }
   }

   ModelsManager.addListener('tm_source_codes', "inserted", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_source_codes', "updated", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_submissions', "inserted", 'TaskController', updateSubmissionFromSync);
   ModelsManager.addListener('tm_submissions', "updated", 'TaskController', updateSubmissionFromSync);

}]);
