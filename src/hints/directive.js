import _ from 'lodash';
import hintsTemplate from './hints.html!text';
// XXX import ModelsManager, SyncQueue

hintsDirective.$inject = [];
export function hintsDirective () {
   return {
      scope: {
         task: '=',
         sLanguage: '='
      },
      restrict: 'E',
      template: hintsTemplate,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: HintsController
   };
};

HintsController.$inject = ['PEMApi', '$timeout', '$scope', '$http', '$rootScope'];
function HintsController (PEMApi, $timeout, $scope, $http, $rootScope) {
   const ctrl = this;

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
      ctrl.hints = buildHintsArray(ctrl.task.ID, $rootScope.sLanguage);
      ctrl.nbHints = ctrl.task.nbHintsTotal;
      if (ctrl.hints.length >= ctrl.nbHints) {
         ctrl.canAskHint = false;
      } else {
         ctrl.canAskHint = true;
      }
      if (ctrl.hintLoading && ctrl.loadingHintRank == ctrl.hints.length) {
         ctrl.hintLoading = false;
      }
   }

   function updateHints() {
      SyncQueue.addSyncEndListeners('updateHints', function() {
         $timeout(function(){$scope.$apply(init);});
         SyncQueue.removeSyncEndListeners('updateHints');
      });
   }

   ModelsManager.addListener('tm_hints', "inserted", 'hintsController', updateHints);
   ModelsManager.addListener('tm_hints', "updated", 'hintsController', updateHints);
   $scope.$on('$destroy', function () {
      ModelsManager.removeListener('tm_hints', "inserted", 'hintsController');
      ModelsManager.removeListener('tm_hints', "updated", 'hintsController');
   });

   ctrl.hints = [];
   ctrl.canAskHint = false;
   init();

   ctrl.askHint = function() {
      $http.post('askHint.php', {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform}, {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.success) {
            console.error('error calling saveAnswer.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         var hintToken = postRes.hintToken;
         ctrl.hintLoading = true;
         ctrl.loadingHintRank = ctrl.hints.length + 1;
         SyncQueue.params.getAllHints = true;
         PEMApi.platform.askHint(hintToken, function() {
            SyncQueue.params.getNewHints = true;
            SyncQueue.addSyncEndListeners('getHints', function() {
               ctrl.hintLoading = false;
            }, true);
            SyncQueue.planToSend(0);
         }, function(arg) {console.error(arg);});
      });
   };

}
