app.directive('selectLang', ['$rootScope', 'ngIfDirective', function ($rootScope, ngIfDirective) {
   var ngIf = ngIfDirective[0];
   return {
      transclude: ngIf.transclude,
      priority: ngIf.priority-1,
      terminal: ngIf.terminal,
      restrict: ngIf.restrict,
      link: function(scope, elem, attrs) {
         var targetLang = attrs['selectLang'];
         var conditions = ['!curSelectLang'];
         var allLangs = targetLang.split(' ');
         for (var i=0; i<allLangs.length; i++) {
            conditions.push('curSelectLang == "' + allLangs[i] + '"');
         }
         var newCond = conditions.join(' || ');
         if(attrs.ngIf) {
            attrs.ngIf = '(' + attrs.ngIf + ') && (' + newCond + ')';
         } else {
            attrs.ngIf = newCond;
         }
         ngIf.link.apply(ngIf, arguments);
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
         scope.curSelectLang = $rootScope.sLangProg;
      }
   };
}]);
