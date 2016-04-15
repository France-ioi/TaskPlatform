app.controller('hintsController', ['$scope', 'PEMApi', '$timeout', '$http', '$rootScope', function ($scope, PEMApi, $timeout, $http, $rootScope) {
   // TODO: fallback mechanism
   function findHintContent(hint, lang) {
      var content = '';
      _.forEach(hint.strings, function(string) {
         if (string.sLanguage == lang) {
            content = string.sContent;
            return false;
         }
      });
      return content;
   }
   function buildHintsArray(taskID, lang) {
      var hints = [];
      var raw_hints = ModelsManager.getRecords('tm_hints');
      _.forEach(raw_hints, function(hint) {
         var content = findHintContent(hint, lang);
         hints[hint.iRank-1] = {iRank: hint.iRank, content: content};
      });
      return hints;
   }
   function init() {
      $scope.hints = buildHintsArray($scope.tm_task.ID, $rootScope.sLanguage);
      $scope.nbHints = $scope.tm_task.nbHintsTotal;
      console.error($scope.nbHints);
      console.error($scope.hints.length);
      if ($scope.hints.length >= $scope.nbHints) {
         $scope.canAskHint = false;
      } else {
         $scope.canAskHint = true;
      }
      if ($scope.hintLoading && $scope.loadingHintRank == $scope.hints.length) {
         $scope.hintLoading = false;
      }
   }
   function updateHints() {
      SyncQueue.addSyncEndListeners('updateHints', function() {
         $timeout(function(){$scope.$apply(init);});
         SyncQueue.removeSyncEndListeners('updateHints');
      });
   }
   $scope.hints = [];
   $scope.canAskHint = false;
   init();
   ModelsManager.addListener('tm_hints', "inserted", 'hintsController', updateHints);
   ModelsManager.addListener('tm_hints', "updated", 'hintsController', updateHints);
   $scope.askHint = function() {
      $http.post('askHint.php', {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform}, {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.success) {
            console.error('error calling saveAnswer.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         var hintToken = postRes.hintToken;
         $scope.hintLoading = true;
         $scope.loadingHintRank = $scope.hints.length + 1;
         SyncQueue.params.getAllHints = true;
         PEMApi.platform.askHint(hintToken, function() {
            SyncQueue.params.getNewHints = true;
            SyncQueue.addSyncEndListeners('getHints', function() {
               $scope.hintLoading = false;
            }, true);
            SyncQueue.planToSend(0);
         });
      });
   };
}]);
