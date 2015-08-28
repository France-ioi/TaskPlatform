'strict';

var app = angular.module('pemTask', ['ui.bootstrap','submission-manager','fioi-editor2']);

var sourceLanguages = [
   {name: "C", ext: 'c', ace: {mode: 'c_cpp'}},
   {name: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
   {name: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
   {name: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
   {name: "Java", ext: 'java', ace: {mode: 'java'}},
   {name: "JavaScool", ext: 'java', ace: {mode: 'java'}},
   {name: "Python", ext: 'py', ace: {mode: 'python'}}
];

app.run(['FioiEditor2Tabsets', function (tabsets) {
   var sampleCode = "#include \"lib.h\"\nconst int LARGEUR_MAX = 1000000;\nint destinationBille[LARGEUR_MAX+1];\nint main()\n{\n  for(int iPos = nbMarches() - 2; iPos >= 0; --iPos)\n  {\n    if(hauteur(iPos) < hauteur(iPos+1))\n      destinationBille[iPos] = iPos;\n    else\n      destinationBille[iPos] = destinationBille[iPos+1];\n  }\n  for(int iBille = 0; iBille < nbLancers(); ++iBille)\n  {\n    int posBille = marcheLancer(iBille);\n    positionFinale(destinationBille[posBille]);\n  }\n  return 0;\n}";
   var sources = tabsets.add('sources', {mode: 'sources', languages: sourceLanguages, titlePrefix: 'Code'});
   var code1 = sources.addTab({title: 'Code1', language: 'C++'});
   var buffer = code1.addBuffer(sampleCode);
}]);

app.controller('taskController', ['$scope', '$http', function($scope, $http) {
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

   $scope.submitAnswer = function() {
      // TODO: collect sources files from the 'sources' tabset and send them to saveAnswer.php?
      this.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
      $http.post('saveAnswer.php', {sToken: sToken, sPlatform: SyncQueue.params.sPlatform}, {responseType: 'json'}).success(function(postRes) {
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
