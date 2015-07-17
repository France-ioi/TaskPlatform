var app = angular.module('pemTask', ['ui.bootstrap']);

angular.module('pemTask')
.controller('taskController', ['$scope', function($scope) {
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params['action'] = 'getAll';
   SyncQueue.params['sToken'] = sToken;
   SyncQueue.params['sPlatform'] = decodeURIComponent(sPlatform);

   SyncQueue.addSyncEndListeners("taskController.apply", function ()
   {
      if (!$scope.hasAskedSubmission)
      {
//         return; // TODO: necessary?
      }
      
      // TODO: get submission according to getAnswer
      for (curSubmission in ModelsManager.curData.tm_submissions) {
         $scope.submission = ModelsManager.curData.tm_submissions[curSubmission];
         $scope.curSubmission = curSubmission;
      }
   });
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

}]);
