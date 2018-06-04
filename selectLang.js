app.directive('selectLang', ['$rootScope', 'Languages', 'ngIfDirective', function ($rootScope, Languages, ngIfDirective) {
   var ngIf = ngIfDirective[0];
   return {
      transclude: ngIf.transclude,
      priority: ngIf.priority-1,
      terminal: ngIf.terminal,
      restrict: ngIf.restrict,
      link: function(scope, elem, attrs) {
         scope.Languages = Languages;
         var targetLang = attrs['selectLang'];
         var conditions = ['!Languages.currentLanguage'];
         var allLangs = targetLang.split(' ');
         for (var i=0; i<allLangs.length; i++) {
            // Special case for java/java8
            // TODO :: find a better way to handle it
            if(allLangs[i] == 'java') {
               conditions.push('Languages.currentLanguage == "java8"');
            }
            conditions.push('Languages.currentLanguage == "' + allLangs[i] + '"');
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
      template: '<select ng-model="Languages.currentLanguage"><option ng-repeat="opt in selectLangs" value="{{ opt.id }}">{{ opt.label }}</option></select>',
      link: function(scope, elem, attrs) {
         scope.selectLangs = Languages.sourceLanguages;
         scope.Languages = Languages;
         scope.$on('fioi-editor2.languageChanged', function(e, lang) {
            if(lang == 'text') { return; }
            Languages.currentLanguage = lang;
            });
      }
   };
}]);
