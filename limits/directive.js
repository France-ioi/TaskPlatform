app.directive('taskLimits', ['$rootScope', function ($rootScope) {
   return {
      scope: false,
      restrict: 'EA',
      template: '<div ng-if="limits && (limits.iMaxTime || limits.iMaxMemory)"><p ng-if="limits.iMaxTime"><strong>Limite de temps:</strong> {{limits.iMaxTime}} ms.</p><p ng-if="limits.iMaxMemory"><strong>Limite de mémoire:</strong> {{limits.iMaxMemory}} kb.</p></div>',
      link: function(scope, elem, attrs) {
         function find_task_limits(langProg) {
            var tasks_limits = null;
            _.forOwn(ModelsManager.getRecords('tm_tasks_limits'), function(tm_task_limits) {
               var limitLangs = tm_task_limits.sLangProg;
               if (limitLangs === '*') {
                  tasks_limits = tm_task_limits;
               } else if (limitLangs == langProg) {
                  tasks_limits = tm_task_limits;
                  return false;
               }
            });
            return tasks_limits;
         }

         function init () {
            var lang = scope.curSelectLang ? scope.curSelectLang : $rootScope.sLangProg;
            scope.limits = find_task_limits(lang);
         }

         init();

         scope.$on('newTask', init);
         scope.$watch('curSelectLang', init);
      }
   };
}]);
