var app = angular.module('pemTask', ['ui.bootstrap','submission-manager']);

angular.module('pemTask')
.controller('taskController', ['$scope', function($scope) {
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params['action'] = 'getAll';
   SyncQueue.params['sToken'] = sToken;
   SyncQueue.params['sPlatform'] = decodeURIComponent(sPlatform);

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
