app.directive('selectLang', ['$rootScope', 'ngShowDirective', function ($rootScope, ngShowDirective) {
   var ngShow = ngShowDirective[0];
   return {
      transclude: ngShow.transclude,
      priority: ngShow.priority-1,
      terminal: ngShow.terminal,
      restrict: ngShow.restrict,
      link: function(scope, elem, attrs) {
         var targetLang = attrs['selectLang'];
         var conditions = ['!curSelectLang'];
         var allLangs = targetLang.split(' ');
         for (var i=0; i<allLangs.length; i++) {
            conditions.push('curSelectLang == "' + allLangs[i] + '"');
         }
         var newCond = conditions.join(' || ');
         if(attrs.ngShow) {
            attrs.ngShow = '(' + attrs.ngShow + ') && (' + newCond + ')';
         } else {
            attrs.ngShow = newCond;
         }
         ngShow.link.apply(ngShow, arguments);
      }
   };
}]);

app.directive('selectLangSelector', ['$rootScope', 'Languages', function ($rootScope, Languages) {
   return {
      scope: false,
      restrict: 'EA',
      template: '<select ng-model="curSelectLang"><option ng-repeat="opt in selectLangs" value="{{ opt.id }}">{{ opt.label }}</option></select>',
      link: function(scope, elem, attrs) {
         scope.selectLangs = Languages.sourceLanguages;
         $rootScope.curSelectLang = $rootScope.sLangProg;
         console.log($rootScope);
      }
   };
}]);
