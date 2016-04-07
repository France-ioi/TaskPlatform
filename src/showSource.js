import _ from 'lodash';

sourceNameDirective.$inject = ['Languages', '$rootScope', 'FioiEditor2Tabsets'];
export function sourceNameDirective (Languages, $rootScope, tabsets) {
   // TODO: move this function a service, all this is more or less temporary anyway
   function getSource(groupName, sLangProg, sLanguage) {
      var sourceCodes = ModelsManager.curData.tm_source_codes;
      var res = null;
      _.forEach(sourceCodes, function(sourceCode) {
         if (sourceCode.sName == groupName && (sourceCode.sType == 'Task' || sourceCode.sType == 'Solution')) {
            if (sourceCode.params && sourceCode.params.sLangProg == sLangProg) {
               res = sourceCode.sSource;
               return false;
            }
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
        if (attrs.class == 'all-sources') {
            var groupName = attrs.sourceName;
            var source_codes = ModelsManager.getRecords('tm_source_codes');
            var tabsetConfig = {
               languages: Languages.sourceLanguages,
               defaultLanguage: 'cpp',
               titlePrefix: ''
            };
            tabsets.add().update({name: groupName}).update(tabsetConfig);
            var groupTabset = tabsets.find(groupName);
            // sorted non-submission source codes
            var editorCodeTabs = _.sortBy(_.filter(source_codes, {bSubmission: false}), 'iRank');
            var activeTabRank = null;
            var i = 0;
            _.forEach(editorCodeTabs, function(sourceCode) {
               if (sourceCode.sName == groupName && (sourceCode.sType == 'Task' || sourceCode.sType == 'Solution')) {
                  var code = groupTabset.addTab().update({title: sourceCode.params.sLangProg});
                  code.getBuffer().update({text: sourceCode.sSource, language: sourceCode.params.sLangProg});
                  if (sourceCode.params.sLangProg == $rootScope.sLangProg) {
                     activeTabRank = i;
                  }
                  i = i+1;
               }
            });
            if (activeTabRank !== null) {
               var tab = groupTabset.getTabs()[activeTabRank-1];
               if (tab) {
                  groupTabset.update({activeTabId: tab.id});
               }
            }
            return '<div fioi-editor2="{tabset:\''+groupName+'\'}"></div>';
        } else {
            sSource = getSource(attrs.sourceName, $rootScope.sLangProg, $rootScope.sLanguage);
            if (!sSource) {
               return '';
            }
            var aceOptions = getAceOptions(sSource, $rootScope.sLangProg);
            // yeark...
            var aceOptionsString = JSON.stringify(aceOptions).replace(/"/g, "'");
            return '<div ui-ace="'+aceOptionsString+'" ng-model="sSource" class="readOnlySource" readonly></div>';
        }
      },
      link: function(scope, element, attrs) {
         scope.sSource = sSource ? sSource : '';
      }
   };
}
