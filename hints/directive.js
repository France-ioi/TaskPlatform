// Logic for hints
app.directive('taskHints', ['PEMApi', '$timeout', '$http', '$rootScope', function (PEMApi, $timeout, $http, $rootScope) {
   return {
      scope: false,
      restrict: 'EA',
      templateUrl: 'hints/template.html',
      link: function($scope, elem, attrs) {
      // TODO: fallback mechanism
         function findHintContent(hint, lang) {
            // Get, for each hint, the version in that language
            var content = '';
            _.forEach(hint.strings, function(string) {
               // TODO :: actually filter by language, set some language as default
               //if (string.sLanguage == lang) {
                  content = string.sContent;
                  return false;
               //}
            });
            return content;
         }

         function buildHintsArray(taskID, lang) {
            // Make array with all hints ordered and the right language selected
            var hints = [];
            var raw_hints = ModelsManager.getRecords('tm_hints');
            _.forEach(raw_hints, function(hint) {
               var content = findHintContent(hint, lang);
               hints[hint.iRank-1] = {iRank: hint.iRank, content: content};
            });
            return hints;
         }

         function init() {
            // Initialize hints display
            $scope.hints = buildHintsArray($scope.tm_task.ID, $rootScope.sLocaleLang);
            $scope.nbHints = $scope.tm_task.nbHintsTotal;
            $scope.canAskHint = ($scope.hints.length < $scope.nbHints);
            if ($scope.hintLoading && $scope.loadingHintRank == $scope.hints.length) {
               $scope.hintLoading = false;
            }
         }

         function updateHints() {
            // Reinitialize display when hints are updated
            SyncQueue.addSyncEndListeners('updateHints', function() {
               $timeout(function(){$scope.$apply(init);});
               SyncQueue.removeSyncEndListeners('updateHints');
            });
         }

         init();

         ModelsManager.addListener('tm_hints', "inserted", 'hintsController', updateHints);
         ModelsManager.addListener('tm_hints', "updated", 'hintsController', updateHints);

         $scope.askHint = function() {
            // Ask a hint: sends a local request to askHint.php to get a hint
            // request token
            // The token contains idTask, idUser, askedHint
            $http.post('askHint.php', {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId}, {responseType: 'json'}).success(function(postRes) {
               if (!postRes || !postRes.success) {
                  console.error('error calling saveAnswer.php'+(postRes ? ': '+postRes.sError : ''));
                  return;
               }
               // With the hintToken signed by TaskPlatform, send a request to
               // the platform, which will send back a new token acknowledging
               // the hint request
               var hintToken = postRes.hintToken;
               $scope.hintLoading = true;
               $scope.loadingHintRank = $scope.hints.length + 1;
               SyncQueue.params.getNewHints = true;
               SyncQueue.addSyncEndListeners('getHints', function() {
                  SyncQueue.params.getNewHints = false; // this *should* be safe
                  $scope.hintLoading = false;
               }, true);
               // askHint will call updateToken, which will make a sync, so no need
               // for a new sync here
               PEMApi.platform.askHint(hintToken, function() {});
            });
         };
      }
   };
}]);
