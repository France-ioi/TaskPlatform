var app = angular.module('pemTask', ['ui.bootstrap']);

angular.module('pemTask')
.controller('taskController', ['$scope', function($scope) {
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   SyncQueue.params['action'] = 'getAll';
   SyncQueue.params['sToken'] = sToken;
   SyncQueue.params['sPlatform'] = decodeURIComponent(sPlatform);

   SyncQueue.addSyncEndListeners("SubmissionCtrl.apply", function ()
   {
      if (!$scope.hasAskedSubmission)
      {
         return;
      }
      $scope.loading = true;
      $scope.idTestToLog = -1;
      $scope.submission = ModelsManager.getRecord('tm_submissions', $scope.curSubmission);

      if ($scope.submission != undefined) 
      {
         var idShown = $scope.initDetailsTests($scope.submission);
         if (idShown != -1)
         {
            $scope.idShown = idShown;
         }
         $scope.configureLogsError($scope.submission.tests);
         if ($scope.submission.task_sScriptAnimation != '' && !$scope.hasLoadedAnimation)
         {
            $scope.hasLoadedAnimation = true;
            addScript($scope.submission.task_sScriptAnimation); // TODO: use eval instead?
         }
      }
      $scope.loading = false;
      $scope.$apply();

      if ($scope.idShown != -1 && $scope.submission != undefined)
      {
         if ($scope.submission.task_sScriptAnimation != '')
         {
            $scope.$broadcast("clickOnTest", [$scope.idShown]);
         }
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
