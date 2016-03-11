import _ from 'lodash';
import limitsTemplate from './limits.html!text';

limitsDirective.$inject = [];
export function limitsDirective () {
   return {
      scope: {
         task: '=',
         sLangProg: '='
      },
      restrict: 'E',
      template: limitsTemplate,
      controllerAs: 'ctrl',
      bindToController: true,
      controller: LimitsController
   };
};

LimitsController.$inject = ['$scope'];
function LimitsController ($scope) {
   var ctrl = this;

   ctrl.limits = null;

   function find_task_limits(langProg, taskID) {
      var task_limits = null;
      _.forOwn(ModelsManager.getRecords('tm_tasks_limits'), function(tm_task_limits) {
         if (tm_task_limits.idTask !== taskID)
            return;
         var limitLangs = tm_task_limits.sLangProg;
         if (limitLangs === '*') {
            task_limits = tm_task_limits;
         } else if (limitLangs.indexOf(langProg) !== -1) {
            tasks_limits = tm_task_limits;
            return false;
         }
      });
      return task_limits;
   }

   function init () {
      ctrl.limits = find_task_limits(ctrl.sLangProg, ctrl.task.ID);
   }

   $scope.$on('newTask', init);
};
