'use strict';

app.directive('showSource', ['Languages', '$rootScope', function(Languages, $rootScope) {
   // TODO: move this function a service, all this is more or less temporary anyway
   function getSource(groupName, sLangProg, sLanguage) {
      var index = ModelsManager.indexes.solution_group_lang;
      if (!index[groupName] || !index[groupName][sLangProg]) {
         console.warn('cannot find source for group '+groupName+' in '+sLangProg);
         return false;
      }
      var solution = ModelsManager.getRecord('tm_solutions', index[groupName][sLangProg]);
      var res = null;
      _.forOwn(solution.strings, function(strings) {
         if (strings.sLanguage) {
            res = strings.sSource;
            return false;
         }
      });
      return res;
   }
   function getAceOptions(sSource, sLangProg) {
      var aceOptions = {
         showGutter: false,
         rendererOptions: {
               maxLines: (sSource.split('\n').length),
               printMarginColumn: false,
         },
         advanced: {
               highlightActiveLine: false,
               readOnly: true
         }
      };
      var languages = Languages.sourceLanguages;
      _.forOwn(languages, function(language) {
         if (language.id == sLangProg) {
            _.merge(aceOptions, language.ace);
            return false;
         }
      });
      return aceOptions;
   }
   var sSource;
   return {
      restrict: 'EA',
      scope: false,
      template: function(elem, attrs) {
        sSource = getSource(attrs.group, $rootScope.sLangProg, $rootScope.sLanguage);
        var aceOptions = getAceOptions(sSource, $rootScope.sLangProg);
        // yeark...
        var aceOptionsString = JSON.stringify(aceOptions).replace(/"/g, "'");
        // TODO: readOnly doesn't work... I can't understand why...
        return '<div ui-ace="'+aceOptionsString+'" ng-model="sSource" readonly></div>';
      },
      link: function(scope, element, attrs) {
         scope.sSource = sSource ? sSource : '';
      }
   };
}]);
