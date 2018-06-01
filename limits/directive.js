app.directive('taskLimits', ['Languages', function (Languages) {
   return {
      scope: false,
      restrict: 'EA',
      templateUrl: 'limits/template.html',
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
            var lang = Languages.currentLanguage;
            scope.limits = find_task_limits(lang);
         }

         init();

         scope.$on('newTask', init);
         scope.Languages = Languages;
         scope.$watch('Languages.currentLanguage', init);
      }
   };
}]);
