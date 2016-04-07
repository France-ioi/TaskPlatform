app.controller('limitsController', ['$scope', '$rootScope', function ($scope, $rootScope) {
   $scope.limits = null;
   function find_task_limits(langProg) {
      var task_limits = null;
      _.forOwn(ModelsManager.getRecords('tm_tasks_limits'), function(tm_task_limits) {
         var limitLangs = tm_task_limits.sLangProg;
         if (limitLangs == '*') {
            task_limits = tm_task_limits;
         } else if (limitLangs.indexOf(langProg) !== -1) {
            tasks_limits = tm_task_limits;
            return false;
         }
      });
      return task_limits;
   }
   function init() {
      $scope.limits = find_task_limits($rootScope.sLangProg);
   }
   init();
   $scope.$on('newTask', init);
}]);
