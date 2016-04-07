import _ from 'lodash';
import limitsTemplate from './limits.html!text';

taskLimitsDirective.$inject = [];
export function taskLimitsDirective () {
   return {
      scope: false,
      restrict: 'EA',
      template: limitsTemplate,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: taskLimitsController
   };
};

taskLimitsController.$inject = ['$scope', '$rootScope'];
export function taskLimitsController ($scope, $rootScope) {
   var ctrl = this;

   ctrl.limits = null;

   function find_task_limits(langProg) {
      var tasks_limits = null;
      _.forOwn(ModelsManager.getRecords('tm_tasks_limits'), function(tm_task_limits) {
         var limitLangs = tm_task_limits.sLangProg;
         if (limitLangs === '*') {
            tasks_limits = tm_task_limits;
         } else if (limitLangs.indexOf(langProg) !== -1) {
            tasks_limits = tm_task_limits;
            return false;
         }
      });
      return tasks_limits;
   }

   function init () {
      ctrl.limits = find_task_limits($rootScope.sLangProg);
   }

   init();

   $scope.$on('newTask', init);
};
