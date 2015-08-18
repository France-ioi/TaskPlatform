var app = angular.module('pemTask', ['ui.bootstrap','submission-manager']);

angular.module('pemTask')
.controller('taskController', ['$scope', '$http', function($scope, $http) {
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params.action = 'getAll';
   SyncQueue.params.sToken = sToken;
   SyncQueue.params.sPlatform = decodeURIComponent(sPlatform);

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
