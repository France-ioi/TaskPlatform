'strict';

var app;

try {
   angular.module("submission-manager");
   app = angular.module('pemTask', ['ui.bootstrap','fioi-editor2', 'ui.ace', 'submission-manager', 'jm.i18next']);
} catch(err) {
   app = angular.module('pemTask', ['ui.bootstrap','fioi-editor2', 'ui.ace', 'jm.i18next']);
}

// 'cpp', 'cpp11', 'python', 'python2', 'python3', 'ocaml', 'javascool', 'c', 'java', 'pascal', 'shell'
app.service('Languages', ['$rootScope', function ($rootScope) {
   'use strict';

   this.allSourceLanguages = [
      {id: 'ada', label: "ADA", ext: 'adb', ace: {mode: 'ada'}},
      {id: 'c', label: "C", ext: 'c', ace: {mode: 'c_cpp'}},
      {id: 'cpp', label: "C++", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'cpp11', label: "C++11", ext: 'cpp', ace: {mode: 'c_cpp'}},
      {id: 'cplex', label: "CPLEX", ext: 'mod', ace: {mode: 'c_cpp'}, defaultDisabled: true},
      {id: 'pascal', label: "Pascal", ext: 'pas', ace: {mode: 'pascal'}},
      {id: 'ocaml', label: "OCaml", ext: 'ml', ace: {mode: 'ocaml'}},
      {id: 'java', label: "Java (GCJ)", ext: 'java', ace: {mode: 'java'}},
      {id: 'java8', label: "Java (OpenJDK 8)", ext: 'java', ace: {mode: 'java'}, defaultDisabled: true},
      {id: 'javascool', label: "JavaScool", ext: 'jvs', ace: {mode: 'java'}, defaultDisabled: true},
      {id: 'python', label: "Python3", ext: 'py', ace: {mode: 'python'}},
      {id: 'blockly', label: "Blockly", ext: 'bl', blockly: {mode: 'python', dstlang: 'python'}, evalAs: 'python'},
      {id: 'scratch', label: "Scratch", ext: 'sc', blockly: {mode: 'python', dstlang: 'python'}, evalAs: 'python'},
      {id: 'arduino', label: "Arduino", ext: 'ino', ace: {mode: 'arduino'}, evalAs: 'c', defaultDisabled: true}
   ];

   this.testLanguages = [
      {id: 'text', label: 'Text', ext: 'txt', ace: {mode: 'text'}}
   ];

   this.sourceLanguages = this.allSourceLanguages;

   this.initialize = function(sSupportedLanguages) {
      var self = this;
      var aimedDefaultLanguage = 'c';
      var storedDefaultLanguage = null;
      try {
         storedDefaultLanguage = localStorage.getItem('defaultLanguage');
      } catch(e) {}
      this.sourceLanguages = [];

      // Handle localStorage of the last language selected
      if(storedDefaultLanguage) {
         aimedDefaultLanguage = storedDefaultLanguage;
      }
      $rootScope.$on('fioi-editor2.languageChanged', function(e, newVal) {
         self.currentLanguage = newVal;
         });
      $rootScope.$watch(function() { return self.currentLanguage; }, function(newVal) {
         if(storedDefaultLanguage != newVal) {
            try {
               localStorage.setItem('defaultLanguage', self.currentLanguage);
            } catch(e) {}
         }
         storedDefaultLanguage = self.currentLanguage;
         $rootScope.$broadcast('TaskPlatform.languageChanged', self.currentLanguage);
         });

      if (sSupportedLanguages == '*' || !sSupportedLanguages) {
         // Filter out defaultDisabled languages
         _.forEach(this.allSourceLanguages, function(lang) {
            if(!lang.defaultDisabled) {
               self.sourceLanguages.push(lang);
            }
         });
         self.defaultLanguage = aimedDefaultLanguage;
         self.currentLanguage = self.defaultLanguage;
         return;
      }

      var supportedLanguagesArray = sSupportedLanguages.split(',');
      if(storedDefaultLanguage && supportedLanguagesArray.indexOf(storedDefaultLanguage) == -1) {
         aimedDefaultLanguage = supportedLanguagesArray[0];
      }
      var supportedLanguagesObject = {};
      _.forEach(supportedLanguagesArray, function(lang) {
         supportedLanguagesObject[lang] = true;
      });

      _.forEach(this.allSourceLanguages, function(lang) {
         if (supportedLanguagesObject[lang.id]) {
            self.sourceLanguages.push(lang);
            if (!self.defaultLanguage || lang.id == aimedDefaultLanguage) {
               self.defaultLanguage = lang.id;
            }
         }
      });

      if(self.sourceLanguages.length == 0) {
         self.sourceLanguages = self.allSourceLanguages;
      }
      self.currentLanguage = self.defaultLanguage;
   };
}]);

app.service('TabsetConfig', ['Languages', 'FioiEditor2Tabsets', function (Languages, tabsets) {
   'use strict';

   this.testsSourcesTabsetConfig = {
      languages: Languages.testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      typeName: 'test'
   };

   this.testsTabsetConfig = {
      languages: Languages.testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      buffersPerTab: 2,
      typeName: 'test',
      bufferNames: ['Entrée', 'Sortie attendue']
   };

   this.initialize = function (task) {
      this.sourcesTabsetConfig = {
         languages: Languages.sourceLanguages,
         defaultLanguage: Languages.defaultLanguage,
         isSourcesEditor: true,
         readOnly: !task.bIsEvaluable,
         titlePrefix: 'Code',
         typeName: 'code'
      };
      tabsets.add().update({name: 'sources'}).update(this.sourcesTabsetConfig);
      tabsets.add().update({name: 'tests'}).update(this.testsTabsetConfig);
      tabsets.add().update({name: 'testSources'}).update(this.testsSourcesTabsetConfig);
   };

   this.configureSources = function (tabset) {
      return tabset.update(this.sourcesTabsetConfig);
   };

   this.configureTestSources = function (tabset) {
      return tabset.update(this.testsSourcesTabsetConfig);
   };

   this.configureTests = function (tabset) {
      return tabset.update(this.testsTabsetConfig);
   };

   // used at beginning of recording replay
   this.configureTabsets = function() {
      this.configureSources(tabsets.find('sources'));
      this.configureTests(tabsets.find('tests'));
   };

}]);

app.directive('dynamicCompile', ['$compile', function($compile) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamicCompile, function(html) {
         ele.html(html);
         $compile(ele.contents())(scope);
      });
    }
  };
}]);


app.directive('specificTo', ['Languages', function(Languages) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    transclude: true,
    link: function(scope, el, attrs, ctrl, transclude) {
      if (!attrs.specificTo) return;
      var langs = _.split(attrs.specificTo, /[ ,;]+/);
      langs = _.keyBy(langs, function(o) { return o; });
      function init() {
         if (langs[Languages.currentLanguage]) {
            el.append(transclude());
         }
      }
      init();
    }
  };
}]);

app.directive('currentLang', ['Languages', function(Languages) {
  return {
    restrict: 'A',
    replace: true,
    scope:false,
    link: function (scope, ele, attrs) {
      function getLangToPrint(lang) {
         res = '';
         _.forEach(Languages.sourceLanguages, function(langInfos) {
            if (langInfos.id == lang) {
               res = langInfos.label;
               return false;
            }
         });
         return res;
      }
      ele.html(getLangToPrint(Languages.currentLanguage));
    }
  };
}]);

app.controller('taskController', ['$scope', '$http', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'PEMApi', '$sce', '$rootScope', 'TabsetConfig', '$timeout', '$interval', '$window', 'Languages', '$uibModal', function($scope, $http, tabsets, signals, recorder, PEMApi, $sce, $rootScope, TabsetConfig, $timeout, $interval, $window, Languages, $uibModal) {
   'use strict';

   $scope.loadComplete = false;
   // Display the task anyway after 30 seconds...
   $timeout(function() { $scope.loadComplete = true; }, 30);

   $scope.panels = {
      userTests: false,
      externalTests: false
   };

   $scope.togglePanel = function(panel) {
      // Open a panel
      $scope.panels[panel] = !$scope.panels[panel];
      if(panel == 'userTests') {
         $timeout(function() { $rootScope.$broadcast('TaskPlatform.refreshEditor', 'tests'); });
      }
   };

   function defaultErrorCallback() {
      console.error(arguments);
   }

   function initI18next(language) {
      require(['i18next', 'i18next-xhr-backend'], function(i18next, i18nextXHRBackend) {
         i18next.use(i18nextXHRBackend);
         var i18nextOpts = {
            'lng': language,
            'fallbackLng': ['en', 'fr'],
            'fallbackNS': 'taskplatform',
            'debug': false,
            'ns': ['commonFramework', 'taskplatform']
            };
         i18nextOpts['backend'] = {
            'allowMultiLoading': false,
            'loadPath': function (lng, ns) {
               if(ns == 'commonFramework') {
                  return '/commonFramework/i18n/'+lng+'/'+ns+'.json';
               } else {
                  return '/i18n/'+lng+'/'+ns+'.json';
               }}
            };
         i18next.init(i18nextOpts);
         i18next.on('initialized', function (options) {
            window.i18nextOptions = options;
         });
      });
   };

   // XXX: this is temporary, for the demo, the variables should be sent according to token instead of url
   function getParameterByName(name) {
       name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
       var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec($window.location.toString());
       return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
   }
   var mode = getParameterByName('mode');
   if (mode !== 'record' && mode != 'replay')
      mode = 'normal';
   $scope.mode = mode;

   $scope.standaloneMode = false;
   if (typeof SyncQueue === 'undefined') { // a bit arbitrary...
      $scope.standaloneMode = true;
   }

   if(getParameterByName('theme') == 'funtelecom') {
      window.disableFullscreen = true;
      $scope.bodyClass = 'funtelecom';
   }

   if (!$scope.standaloneMode) {
      ModelsManager.init(models);
      SyncQueue.init(ModelsManager);
      SyncQueue.params.action = 'getAll';
      $rootScope.sToken = decodeURIComponent(getParameterByName('sToken'));
      $rootScope.taskId = decodeURIComponent(getParameterByName('taskId'));
      $rootScope.sPlatform = decodeURIComponent(getParameterByName('sPlatform'));
      if (!$rootScope.sPlatform) { // TODO: for tests only, to be removed
         $rootScope.sPlatform = 'http://algorea.pem.dev';
      }
      SyncQueue.params.sPlatform = $rootScope.sPlatform;
      SyncQueue.params.sToken = $rootScope.sToken;
      SyncQueue.params.taskId = $rootScope.taskId;
      SyncQueue.params.getSubmissionTokenFor = {};

      $scope.taskTitle = '';
   }

   $scope.initLocale = function() {
      $rootScope.sLocale = getLocale.locale;
      $rootScope.sLocaleLang = getLocale.localeLang;
      $rootScope.sLocaleCountry = getLocale.localeCountry;
      initI18next($rootScope.sLocaleLang);
   }
   $scope.initLocale();

   $scope.getDataToSave = function() {
      var source_tabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         source_tabset = tabsets.find('testSources');
      }
      var source_tabs   = source_tabset.getTabs();
      var active_tab    = source_tabset.getActiveTab();
      var aSources = _.map(source_tabs, function (tab) {
         var buffer = tab.getBuffer().pullFromControl();
         return {
            sName: tab.title,
            sSource: buffer.text,
            sLangProg: buffer.language,
            bActive: tab === active_tab
         };
      });
      var aTests = null;
      if ($rootScope.tm_task.bUserTests) {
         var test_tabset = tabsets.find('tests');
         var test_tabs   = test_tabset.getTabs();
         active_tab      = test_tabset.getActiveTab();
         aTests  = _.map(test_tabs, function (tab) {
            var inputBuffer  = tab.getBuffer(0).pullFromControl();
            var outputBuffer = tab.getBuffer(1).pullFromControl();
            return {
               sName: tab.title,
               sInput: inputBuffer.text,
               sOutput: outputBuffer.text,
               bActive: tab === active_tab
            };
         });

         // Do not save example tests
         var exampleTests = ModelsManager.getRecords('tm_tasks_tests');
         exampleTests = _.filter(exampleTests, {sGroupType: "Example"});
         aTests = _.filter(aTests, function(test) {
            return !(_.find(exampleTests, {sInput: test.sInput, sOutput: test.sOutput}));
         });
      }
      return {sources: aSources, tests: aTests};
   };

   $scope.previouslySaved = {sources: null, tests: null};
   $scope.saveEditors = function (success, error) {
      if (!success) {success = function() {};}
      if (!error) {error = defaultErrorCallback;}
      if (!$rootScope.tm_task.bIsEvaluable) {
         console.warn("not saving editor in readOnly tasks");
         return;
      }
      var dataToSave = $scope.getDataToSave();
      if (_.isEqual($scope.previouslySaved.sources, dataToSave.sources) && _.isEqual($scope.previouslySaved.tests, dataToSave.tests)) {
         if(window.debugMode) {
            console.log('editors data equal to previously saved, not saving');
         }
         success('');
         return;
      }
      $scope.previouslySaved.sources = dataToSave.sources;
      $scope.previouslySaved.tests = dataToSave.tests;
      $scope.saving = true;
      $http.post('saveEditors.php', 
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, aSources: dataToSave.sources, aTests: dataToSave.tests},
            {responseType: 'json'}).success(function(postRes) {
         $scope.saving = false;
         if (!postRes || !postRes.bSuccess) {
            error('error calling saveEditors.php'+(postRes ? ': '+postRes.sError : ''));
         } else {
            success('');
         }
         // everything went fine
      });
   };

   $scope.startSaveInterval = function() {
      $scope.saveInterval = setInterval(function() {
         $scope.saveEditors(function() {}, defaultErrorCallback); 
      }, 20000);
   };

   $scope.$on('fioi-editor2.requireSave', function() {
      $scope.saveEditors(function() {}, defaultErrorCallback); 
   });

   $scope.showHistory = function() {
      $scope.historyLoaded = false;
      $scope.historyError = false;
      $http.post('loadHistory.php', 
         {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, action: "list"},
         {responseType: 'json'}).then(function(postRes) {
            if(postRes.data && postRes.data.bSuccess) {
               $scope.historyItems = postRes.data.historyItems;
               $scope.historyLoaded = true;
            } else {
               $scope.historyError = true;
            }
         }, function(postRes) {
            $scope.historyError = true;
      });
      $scope.historyModal = $uibModal.open({
         templateUrl: 'historyModal.html',
         scope: $scope
         });
   };

   $scope.hideHistory = function() {
      if($scope.historyModal) {
         $scope.historyModal.close();
         $scope.historyModal = null;
      }
   };

   $scope.loadHistory = function(idItem) {
      $scope.historyLoaded = false;
      $http.post('loadHistory.php', 
         {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, action: "load", idItem: idItem},
         {responseType: 'json'}).then(function(postRes) {
            if(postRes.data && postRes.data.bSuccess) {
               var sourcesTabset = tabsets.find('sources');
               var code = sourcesTabset.addTab().update({title: postRes.data.name});
               code.getBuffer().update({text: postRes.data.source, language: postRes.data.lang});
               $scope.hideHistory();
            } else {
               $scope.historyError = true;
            }
         }, function(postRes) {
            $scope.historyError = true;
      });
   };

   $scope.$on('fioi-editor2.toggleHistory', function() {
      $scope.showHistory();
   });


   PEMApi.task.unload = function(success, error) {
      if ($scope.saveInterval) {
         clearInterval($scope.saveInterval);
      }
      if (SyncQueue.interval) {
         clearInterval(SyncQueue.interval);
      }
      SyncQueue.sentVersion = 0;
      SyncQueue.resetSync = true;
      if (!$scope.saving) {
         $scope.saveEditors(success, error);
      } else {
         success();
      }
   };

   $scope.initSourcesEditorsData = function() {
      var source_codes = ModelsManager.getRecords('tm_source_codes');
      var sourcesTabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         sourcesTabset = tabsets.find('testSources');
      }
      sourcesTabset.clear();
      // sorted non-submission source codes
      var editorCodeTabs = _.sortBy(_.filter(source_codes, {bSubmission: false}), 'iRank');
      var activeTabRank = null;
      var hasSourceCode = false;
      _.forEach(editorCodeTabs, function(source_code) {
         if (!source_code.bSubmission && source_code.sType == 'User') {
            hasSourceCode = true;
            var code = sourcesTabset.addTab().update({title: source_code.sName});
            code.getBuffer().update({text: source_code.sSource, language: source_code.params.sLangProg});
            if (source_code.bActive) {
               activeTabRank = source_code.iRank;
            }
         }
      });
      // activate tab
      if (activeTabRank !== null) {
         var tab = sourcesTabset.getTabs()[activeTabRank-1];
         if (tab) {
            sourcesTabset.update({activeTabId: tab.id});
         }
      }
      // Set up defaultSources
      var defaultSourcesEntries = _.filter(source_codes, {sType: 'Task', sName: 'defaultSource'});
      var defaultSources = {};
      if(defaultSourcesEntries.length) {
         _.forEach(defaultSourcesEntries, function(source_code) {
            try {
               var sp = JSON.parse(source_code.sParams)
            } catch(e) { return; }
            if(!sp || !sp.sLangProg) { return; }
            defaultSources[sp.sLangProg] = source_code.sSource;
            });
         sourcesTabset.update({defaultSources: defaultSources});
      }
      if (!hasSourceCode) {
         var code = sourcesTabset.addTab();
         var newText = defaultSources[Languages.defaultLanguage] ? defaultSources[Languages.defaultLanguage] : '';
         code.getBuffer().update({text: newText, language: Languages.defaultLanguage});
      }
      $timeout(function() {
         sourcesTabset.focus();
      });
   };

   $scope.$on('TaskPlatform.languageChanged', function() {
      // Each time the current language is changed, reflect that in the editor
      tabsets.find('sources').update({defaultLanguage: Languages.currentLanguage}, true);
      });

   $scope.initTestsEditorsData = function() {
      var tests = ModelsManager.getRecords('tm_tasks_tests');
      var testsTabset = tabsets.find('tests');
      var editorCodeTabs = _.sortBy(tests, ['sGroupType', 'iRank']);
      var activeTabRank = null;
      var hasTests = false;
      _.forEach(editorCodeTabs, function(test) {
         hasTests = true;
         var code = testsTabset.addTab().update({title: test.sName});
         if (!test.sInput) test.sInput = '';
         if (!test.sOutput) test.sOutput = '';
         code.getBuffer(0).update({text: test.sInput});
         code.getBuffer(1).update({text: test.sOutput});
      });
      if (!hasTests) {
         testsTabset.addTab();
      }
   };

   $scope.initHints = function() {
      
   };

   $scope.taskContent = '';
   $scope.solutionContent = '';

   function initBlocklyDemo() {
     if (typeof taskSettings !== 'undefined' && typeof taskSettings.blocklyDemo !== 'undefined' && $('#blocklyDemo').length) {
       require(['blockly-lib'], function () {
         // TODO :: rework that into showSource
         $("#blocklyDemo #blocklyDemoDiv").html("");
         var blocklyHelper = getBlocklyHelper();
         blocklyHelper.mainContext = {"nbRobots": 1};
         blocklyHelper.prevWidth = 0;
         var blocklyOpts = {divId: "blocklyDemoDiv", noRobot: true, readOnly: true};
         blocklyHelper.load("fr", true, 1, blocklyOpts);
         blocklyHelper.updateSize();
         var blocklyDemoWorkspace = blocklyHelper.workspace;
         $("#choose-view").on('click', function() {
            Blockly.svgResize(blocklyDemoWorkspace);
         });
         setTimeout(function() {
           if (taskSettings.blocklyDemo) {
             Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(taskSettings.blocklyDemo), blocklyDemoWorkspace);
           }
           Blockly.clipboardXml_ = window.blocklyClipboard;
           Blockly.clipboardSource_ = blocklyDemoWorkspace;
         }, 100);
       });
     }
   }

   function initScriptAnimation(tm_task) {
      // Load animation
      $('head').append('<script type="text/javascript">' + tm_task.sScriptAnimation + '</script>');
      $timeout(function() {
          if (typeof taskSettings !== 'undefined') {
             tm_task.bShowConcepts = !!taskSettings.conceptViewer;
             if(tm_task.bShowConcepts) {
                // TODO :: replace testConcepts
                conceptViewer.loadConcepts(getConceptsFromTask(testConcepts));
             }
             $scope.$digest();
             if(typeof taskSettings.evaluationCallback === 'function') {
                tm_task.evaluationCallback = taskSettings.evaluationCallback;
             }
          }
        }, 1000);
      // Load animation example, wait for enough time for everything to be loaded
      if (typeof taskSettings !== 'undefined' && typeof taskSettings.animationExampleCmds !== 'undefined' && $("#simuDemo").length) {
         setTimeout(function() { simulationInstance("#simuDemo", taskSettings.animationFeatures("#simuDemo"), taskSettings.animationExampleCmds); }, 2000);
      }
   }

   function initEvalResultScript(tm_task) {
      var scriptName = tm_task.sEvalResultOutputScript;
      var baseUrl = window.config.evalResultOutputScriptBaseUrl;
      require([baseUrl+scriptName+'.js'], function (res) {
         tm_task.displayChecker = res.displayChecker;
      });
   }

   $scope.initTask = function() {
      // get task
      _.forOwn(ModelsManager.getRecords('tm_tasks'), function(tm_task) {
         $rootScope.tm_task = tm_task;
         $rootScope.idTask = tm_task.ID;
         return false;
      });
      // apply strings if already present
      _.forOwn(ModelsManager.getRecords('tm_tasks_strings'), function(tm_strings) {
         updateStringsFromSync(tm_strings);
      });

      if ($rootScope.tm_task.sScriptAnimation) {
         initScriptAnimation($rootScope.tm_task);
      }
      setTimeout(initBlocklyDemo, 2000);
      if ($rootScope.tm_task.sEvalResultOutputScript) {
         initEvalResultScript($rootScope.tm_task);
      }
      Languages.initialize($rootScope.tm_task.sSupportedLangProg);
      TabsetConfig.initialize($rootScope.tm_task);
      PEMApi.init();
      $scope.startSaveInterval();
   };

   if (!$scope.standaloneMode) {
      SyncQueue.addSyncEndListeners('initData', function() {
         $scope.$apply(function() {
            $scope.initTask();
            $scope.initSourcesEditorsData();
            if ($rootScope.tm_task.bUserTests) {
               $scope.initTestsEditorsData();
            }
            $scope.previouslySaved = $scope.getDataToSave();
            $scope.initHints();
            $scope.loadComplete = true;
         });
         // we do it only once:
         SyncQueue.removeSyncEndListeners('initData');
      });
   } else {
      $scope.initTask();
      $scope.initSourcesEditorsData();
      if ($rootScope.tm_task.bUserTests) {
         $scope.initTestsEditorsData();
      }
      $scope.previouslySaved = $scope.getDataToSave();
      $scope.initHints();
   }

   $scope.saveSubmission = function(withTests, showSubmission, success, error) {
      // editor doesn't give correct result if not after a timeout
      $timeout(function() {
         $scope.doSaveSubmission(withTests, showSubmission, success, error);
      });
   };

   $rootScope.curSubmissionLang = null;

   $scope.getSource = function() {
      var source_tabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         source_tabset = tabsets.find('testSources');
      }
      var source_tabs   = source_tabset.getTabs();
      var active_tab    = source_tabset.getActiveTab();
      var answerEvalCode, answerSourceCode, answerLangProg, answerLangEval;
      if ($rootScope.tm_task.bTestMode) {
         var tests = _.map(source_tabs, function (tab) {
            var buffer = tab.getBuffer().pullFromControl();
            return {
               sName: tab.title,
               sInput: buffer.text
            };
         });
         answerEvalCode = JSON.stringify(tests);
         answerSourceCode = answerEvalCode;
         answerLangProg = 'text';
         answerLangEval = 'text';
      } else {
         var buffer = tabsets.find('sources').getActiveTab().getBuffer().pullFromControl();
         answerEvalCode = buffer.isBlockly ? buffer.blocklySource : buffer.text;
         answerSourceCode = buffer.text;
         answerLangProg = buffer.language;
         answerLangEval = buffer.language;
         for(var i=0; i<Languages.sourceLanguages.length; i++) {
            var curLang = Languages.sourceLanguages[i];
            if(curLang.id == buffer.language) {
               answerLangEval = curLang.evalAs ? curLang.evalAs : buffer.language;
               break;
            }
         }
      }
      return {
         sourceCode: answerSourceCode,
         evalCode: answerEvalCode,
         langProg: answerLangProg,
         langEval: answerLangEval
         };
   };

   $scope.getAdapterSource = function() {
        var source = $scope.getSource();
        if(source.langProg == 'python') {
            source.sourceCode = 'from printer import *\n' + source.sourceCode
            source.sourceCode = source.sourceCode.replace(/print(\(.*,) *end *= *([^,\)]*)\)/g, 'print_end$1 $2)');
        }
        if(taskSettings.prependSource) {
            source.sourceCode = '' + taskSettings.prependSource + source.sourceCode;
        }
        if(taskSettings.appendSource) {
            source.sourceCode = source.sourceCode + taskSettings.appendSource;
        }
        return source;
   };

   $scope.setAdapterHeight = function(height) {
        $('#adapter-iframe').height(height);
   };

   $scope.userTestData = null;
   window.adapterApi = {
        getSource: $scope.getAdapterSource,
        validate: $scope.adapterValidateAnswer,
        displayPopup: function() {
            $('#adapterPopupModal').modal({backdrop: 'static'});
            platform.updateDisplay({scrollTop: 0});
        },
        setHeight: $scope.setAdapterHeight,
        getTaskInfo: function() {
            var sourceInfo = $scope.getAdapterSource();
            return {
                data: $scope.userTestData,
                dependencies: [],
                language: sourceInfo.langProg,
                initTask: taskSettings.initTask
            }}
        };

   $scope.adapterValidateAnswer = function() {
        $scope.externalTestUrl = null;
        $scope.validateAnswer();
   };

   $scope.lastSource = null;
   $scope.checkSourceChanged = function() {
      if(!$rootScope.tm_task) { return; }
      var newSource = $scope.getSource();
      if(!$scope.lastSource || ($scope.lastSource.sourceCode != newSource.sourceCode || $scope.lastSource.langProg != newSource.langProg)) {
         $scope.commentSource(newSource);
         $scope.externalTestUrl = null;
         $scope.lastSource = newSource;
      }
   };
   $interval($scope.checkSourceChanged, 1000);

   // Some commonly used commentSource functions
   // A function can return either a comment (string), or an object
   // {level: [0..2], comment: [string]}
   // where a level of 2 will display the comment as an error, 1 as a warning,
   // 0 as an info.
   var defaultCommentSourceFunctions = {
      'algorea': function(lang, source) {
         // Warn the user of java.util.Scanner being slow
         if(lang != 'java' && lang != 'java8') { return; }
         if(source.indexOf('java.util') != -1
               && source.indexOf('Scanner') != -1
               && source.indexOf('algorea') == -1) {
            return {level: 1, comment: "Vous semblez utiliser <code>java.util.Scanner</code> ; nous vous conseillons d'utiliser <code>algorea.Scanner</code> qui est plus rapide."};
         }
         return;
      }
   };
   $scope.commentSource = function(source) {
      if(!window.taskSettings || !window.taskSettings.commentSource || !source) { return; }
      var level = 0;
      var comment = '';
      function processCs(cs) {
         if(typeof cs == 'string') {
            if(!defaultCommentSourceFunctions[cs]) {
               console.error("Comment source function '" + cs + "' unknown.");
               return;
            }
            cs = defaultCommentSourceFunctions[cs];
         } else if(typeof cs != 'function') {
            console.error("Comment source function specification error.");
            return;
         }
         var res = cs(source.langProg, source.sourceCode);
         if(res && res.level) { level = Math.max(level, res.level); }
         if(res && (res.comment || typeof res == 'string')) {
            if(comment) { comment += '<br>'; }
            comment += res.comment ? res.comment : res;
         }
      }
      if(angular.isArray(window.taskSettings.commentSource)) {
         angular.forEach(window.taskSettings.commentSource, processCs);
      } else {
         processCs(window.taskSettings.commentSource);
      }

      $scope.sourceComment = comment;
      $scope.sourceCommentStyle = level > 2 ? 'alert-danger' : (level == 1 ? 'alert-warning' : 'alert-info');
   }

   $scope.localUserTests = true;
   $scope.hasExternalTest = function() {
      if(!window.taskSettings || !window.taskSettings.initTask) { return false; } // TODO :: taskInfo
      $scope.externalExamples = !window.taskSettings.noExamples; // TODO :: rename...
      try {
          var bufLang = tabsets.find('sources').getActiveTab().getBuffer().pullFromControl().language;
      } catch(e) { return false; }
      return (bufLang == 'blockly' || bufLang == 'scratch' || bufLang == 'python');
   };
   $scope.openExternalTest = function() {
      $scope.userTestData = null;
      $scope.doOpenExternalTest();
   };

   $scope.doOpenExternalTest = function(reopen) {
      function open() {
         $scope.externalTestUrl = $sce.trustAsResourceUrl('/quickAlgo/index.html?' + window.config.requireJSurlArgs);
      }
      if($scope.externalTestUrl) {
         if(!reopen) { return; }
         $scope.externalTestUrl = null;
         $timeout(open, 500);
         return;
      }
      $scope.panels.externalTests = true;
      open();
      $scope.saveEditors(function() {}, defaultErrorCallback);
   };

   $scope.getTestsData = function(withTests) {
      if (withTests == 'one') {
         var testTab = tabsets.find('tests').getActiveTab();
         var inputBuffer  = testTab.getBuffer(0).pullFromControl();
         var outputBuffer = testTab.getBuffer(1).pullFromControl();
         return [{
            sInput: inputBuffer.text,
            sOutput: outputBuffer.text,
            sName: testTab.title
         }];
      } else if (withTests == 'all') {
         var test_tabs  = tabsets.find('tests').getTabs();
         return _.map(test_tabs, function (tab) {
            var inputBuffer  = tab.getBuffer(0).pullFromControl();
            var outputBuffer = tab.getBuffer(1).pullFromControl();
            return {
               sName: tab.title,
               sInput: inputBuffer.text,
               sOutput: outputBuffer.text
            };
         });
      }
   };

   $scope.doSaveSubmission = function(withTests, showSubmission, success, error) {
      if (showSubmission) {
         $scope.submission = {ID: 0, bEvaluated: false, tests: [], submissionSubtasks: []};
      }
      var sourceInfos = $scope.getSource();
      var params = {
         sToken: $rootScope.sToken,
         sPlatform: $rootScope.sPlatform,
         taskId: $rootScope.taskId,
         oAnswer: {
            sSourceCode: sourceInfos.evalCode,
            sLangProg: sourceInfos.langEval
         }
      };
      if(withTests) {
         params.aTests = $scope.getTestsData(withTests);
      }

      $scope.logValidate('task:saveSubmission:start');
      $http.post('saveSubmission.php', params, {responseType: 'json'}).success(function(postRes) {
         $scope.logValidate('task:saveSubmission:end');
         if (!postRes || !postRes.bSuccess || !postRes.idSubmission) {
            error('error calling saveSubmission.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         if(Languages.sourceLanguages.length > 1) {
             $rootScope.curSubmissionLang = sourceInfos.langProg;
         } else {
             // Do not show language if there's only one
             $rootScope.curSubmissionLang = '';
         }
         if (showSubmission) {
            $scope.curSubmissionID = postRes.idSubmission;
         }
         syncSubmissionUntil(postRes.idSubmission, false, null, error);
         success(postRes.idSubmission, postRes.answer);
      }).error(error);
   };

   $scope.gradeSubmission = function(idSubmission, answerToken, success, error, taskParams) {
      $scope.validateMsg = 'validate_submitting';
      $scope.validateMsgClass = '';
      $scope.curSubmissionID = idSubmission;
      $timeout.cancel($scope.validateTimeout);
      $scope.logValidate('task:gradeSubmission:start');

      $http.post('grader/gradeTask.php', 
            {sToken: $rootScope.sToken, sPlatform: $rootScope.sPlatform, taskId: $rootScope.taskId, idSubmission: $scope.curSubmissionID, answerToken: answerToken, taskParams: taskParams, sLocale: $rootScope.sLocaleLang},
            {responseType: 'json'}).success(function(postRes) {
         if (!postRes || !postRes.bSuccess) {
            $scope.validateButtonDisabled = false;
            $scope.validateMsg = 'validate_error_submission';
            $scope.validateMsgClass = 'text-danger';
            $scope.curSubmissionID = null;
            $scope.logValidate('task:gradeSubmission:noSuccess');
            error('error calling grader/gradeTask.php'+(postRes ? ': '+postRes.sError : ''));
            return;
         }
         $scope.validateMsg = '';
         $scope.logValidate('task:gradeSubmission:success');
         success(postRes.scoreToken);
      });
   };

   $scope.validateButtonDisabled = false;
   $scope.validateMsg = '';
   $scope.validateErr = '';
   $scope.validateMsgClass = '';
   $scope.validateTimeout = null;

   $scope.logValidateWindow = ModelsManager.getRandomID();
   $scope.logValidate = function(step) {
      // Function to log validation steps
      $http.post('logValidate.php',
         {step: step, taskId: $rootScope.taskId, idWindow: $scope.logValidateWindow, idSubmission: $scope.curSubmissionID});
   };

   $scope.validateAnswer = function() {
      if($scope.validateButtonDisabled) {
         console.log('Tried to validateAnswer while button is disabled.');
         return;
      }
      $scope.validateButtonDisabled = true;
      $scope.validateMsg = 'validate_prepare';
      $scope.validateErr = '';
      $scope.validateMsgClass = '';

      $scope.logValidate('task:validateAnswer')

      // Save submission
      $scope.saveSubmission(null, true, function() {
            $scope.validateMsg = 'validate_inprogress';
            // Ask platform to validate
            platform.validate('done', function() {
               $scope.validateButtonDisabled = false;
               $timeout.cancel($scope.validateTimeout);
               $timeout(function () { $scope.$apply(); });
               $scope.logValidate('platform:validate:success')
            }, function(msg) {
               $scope.validateButtonDisabled = false;
               $timeout.cancel($scope.validateTimeout);
               $scope.validateMsg = 'validate_error_platform';
               if(msg) {
                  $scope.validateErr = msg;
               }
               $scope.validateMsgClass = 'text-danger';
               $timeout(function () { $scope.$apply(); });
               $scope.logValidate('platform:validate:error:'+msg)
            });
         }, function() {});

      // Save sources in the meanwhile
      $scope.saveEditors(function() {}, defaultErrorCallback);

      // Show an error message if the platform didn't do anything after 5 seconds
      $scope.validateTimeout = $timeout(function() {
         $scope.validateButtonDisabled = false;
         $scope.validateMsg = 'validate_error_timeout';
         $scope.validateMsgClass = 'text-danger';
         $scope.logValidate('platform:validate:timeout')
      }, 5000);
   };

   $scope.loadSubmissionInEditor = function(submission) {
      if (!submission) {
         console.error('no submission!');
         return;
      }
      var source_code = submission.sourceCode;
      if (!source_code) {
         console.error('cannot find associated source code');
         return;
      }
      var sourcesTabset = tabsets.find('sources');
      if ($rootScope.tm_task.bTestMode) {
         sourcesTabset = tabsets.find('testSources');
      }
      sourcesTabset.clear();
      // TODO: handle testMode
      var code = sourcesTabset.addTab().update({title: 'Code 1'});
      code.getBuffer().update({text: source_code.sSource, language: source_code.params.sLangProg});
   };

   PEMApi.task.reloadState = function(state, success, error) {
      // do (almost) nothing; that will change when state and answer are merged in platforms

      // TODO :: do something better
      // Temporary hack that shouldn't break the forum but I'm not sure
      // allows to avoid erasing the answers when we're loading a task normally
      $scope.stateReloaded = true;

      success();
   };

   // answer can be the submission id directly or some json containing it:
   function getSubmissionIdFromAnswer(strAnswer) {
      if (/^\d+$/.test(strAnswer)) {
         return strAnswer;
      } else {
         try {
            var answer = JSON.parse(strAnswer);
            if (answer.idSubmission) {
               return answer.idSubmission;
            } else {
               console.error('no idSubmission in answer JSON!');
               return null;
            }
         } catch (e) {
            console.error('cannot parse json!');
            return null;
         }
      }
   }

   PEMApi.task.reloadAnswer = function(strAnswer, success, error) {
      $scope.$apply(function() {
         if (!strAnswer || $scope.stateReloaded) {
            // empty string is default answer in the API, so I guess this means
            // no submission...
            $scope.submission = null;
            $scope.stateReloaded = false;
         } else {
            var submissionId = getSubmissionIdFromAnswer(strAnswer);
            if (!submissionId) {
               $scope.submission = null;
            } else {
               $scope.submission = ModelsManager.curData.tm_submissions[submissionId];
            }
         }
         $scope.loadSubmissionInEditor($scope.submission);
         // moved from reloadState, original comment:
         // here something a bit strange: initSourcesEditorData syncs the editor with ModelsManager.source_codes
         // but ModelsManager.source_codes is not filled by saveEditor, so we must not call initSourcesEditorData
         // at each reloadState, only when reloadAnswer has been called before.

         // TODO :: find out if it's ever needed
         //$timeout(function () { $scope.initSourcesEditorsData(); });
         success();
      });
   };

   PEMApi.task.getAnswer = function(success, error) {
      var sourceParams = $scope.getSource();
      success(JSON.stringify({
         idSubmission: $scope.curSubmissionID,
         langProg: sourceParams.langProg,
         sourceCode: sourceParams.evalCode
         }));
/*      $scope.logValidate('task:getAnswer');
      $scope.saveSubmission(null, false, function(idSubmission, answer) {
         success(answer);
      }, error);*/
   };

   function callAtEndOfSync(fun) {
      var randomId = ModelsManager.getRandomID();
      SyncQueue.addSyncEndListeners('tmp-'+randomId, function() {
         fun();
         SyncQueue.removeSyncEndListeners('tmp-'+randomId);
      });
   }

   // high level interface, read syncSubmissionUntil first
   var syncSubmissionCallbacks = {};
   var syncSubmissionConditions = {};

   function submissionModelListener(submission) {
      if (submission.ID == $scope.curSubmissionID) {
         $scope.submission = submission;
      }
      var cb = syncSubmissionCallbacks[submission.ID];
      if(cb) {
         delete(syncSubmissionCallbacks[submission.ID]);
         delete SyncQueue.params.getSubmissionTokenFor[submission.ID];
         cb(submission);
      }
   }

   ModelsManager.addListener('tm_submissions', "inserted", 'taskController', submissionModelListener, true);
   ModelsManager.addListener('tm_submissions', "updated", 'taskController', submissionModelListener, true);

   function syncSubmissionUntil(idSubmission, waitEvaluated, success, error, answerToken) {
      syncSubmissionCallbacks[idSubmission] = function(submission) {
         if(waitEvaluated && !submission.bEvaluated) {
            var nbTries = 0;
            var waitEvaluation = function() {
               var curSubmission = ModelsManager.curData.tm_submissions[idSubmission];
               if(curSubmission.bEvaluated) {
                  if(success) { success(curSubmission); }
                  return;
               }
               $http.post('checkSubmission.php', {idSubmission: idSubmission}, {responseType: 'json', timeout: 5000})
                  .success(function(postRes) {
                     if(!postRes || !postRes.success) {
                        error('Error calling checkSubmission.php' + (postRes ? ' : '+postRes.sError : ''));
                        return;
                     }
                     if(postRes.evaluated) {
                        syncSubmissionUntil(idSubmission, false, success, error, answerToken);
                     } else {
                        nbTries++;
                        var timeout = nbTries > 5 ? (nbTries - 5) * 500 : 500;
                        setTimeout(waitEvaluation, timeout);
                     }
                  }).error(error);
            }
            waitEvaluation();
         } else if(success) {
            success(submission);
         }
      };
      SyncQueue.params.getSubmissionTokenFor[idSubmission] = answerToken;
      SyncQueue.planToSend(0);
   }
   // end of high level interface

   PEMApi.task.gradeAnswer = function(answerStr, answerToken, success, error) {
      var idSubmission = getSubmissionIdFromAnswer(answerStr);
      $scope.logValidate('task:gradeAnswer');
      PEMApi.platform.getTaskParams(null, null, function(taskParams) {
         $scope.gradeSubmission(idSubmission, answerToken, function() {
            syncSubmissionUntil(idSubmission, true, function(submission) {
               $scope.logValidate('task:gradeSubmission:end')
               $scope.validateButtonDisabled = false;
               $timeout.cancel($scope.validateTimeout);
               $timeout(function () { $scope.$apply(); });
               var message = 'evaluation ended with score '+submission.iScore; // TODO!
               success(submission.iScore, message, submission.scoreToken);
            }, error, answerToken);
         }, error, taskParams);
      }, error);
   };

   function runTests(typeTests) {
      if($scope.localUserTests && $scope.hasExternalTest()) {
         // Run test locally
         var testData = $scope.getTestsData(typeTests);
         $scope.userTestData = {easy: []};
         for(var i=0; i < testData.length; i++) {
            $scope.userTestData.easy.push({input: testData[i].sInput, output: testData[i].sOutput});
         }
         $scope.doOpenExternalTest(true);
         return;
      }
      $scope.panels.externalTests = false;

      $scope.validateButtonDisabled = true;
      $scope.validateMsg = '';
      $scope.validateErr = '';
      $scope.validateMsgClass = '';

      var errorCb = function () {
         $scope.validateButtonDisabled = false;
         $scope.validateMsg = 'validate_error_validation';
         $scope.validateMsgClass = 'text-danger';
         defaultErrorCallback();
      }

      $scope.saveSubmission(typeTests, true, function(idSubmission){
         $scope.gradeSubmission(idSubmission, null, function() {
            syncSubmissionUntil(idSubmission, true, function() {
               $scope.validateButtonDisabled = false;
            }, errorCb, null);
         }, errorCb);
      }, errorCb);
   };

   $scope.runCurrentTest = function() {
      runTests('one');
   };

   $scope.runAllTests = function() {
      runTests('all');
   };

   // TODO: do the opposite before sending data to server (and make ModelsManager provide a hook for it)
   function expandSourceCodeParams(sourceCode) {
      if (!sourceCode.sSource) sourceCode.sSource = '';
      if (sourceCode.sParams && typeof sourceCode.sParams == 'string') {
         try {
            sourceCode.params = $.parseJSON(sourceCode.sParams);
         } catch(e) {
            console.error('couldn\'t parse '+sourceCode.sParams);
         }
      }
   }

   $scope.stringsLoaded = false;
   function updateStringsFromSync(strings) {
      // (Re)load strings only if language is right or no strings have been loaded
      if($scope.stringsLoaded && strings.sLanguage != $rootScope.sLocaleLang) { return; }

      $scope.taskContent = strings.sStatement;
      if($scope.standaloneMode) {
         $scope.taskTitle = $sce.trustAsHtml(strings.sTitle);
      }
      $scope.solutionContent = strings.sSolution;
      $scope.stringsLoaded = true;
   }

   ModelsManager.addListener('tm_source_codes', "inserted", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_source_codes', "updated", 'TaskController', expandSourceCodeParams);
   ModelsManager.addListener('tm_tasks_strings', "inserted", 'TaskController', updateStringsFromSync, true);
   ModelsManager.addListener('tm_tasks_strings', "updated", 'TaskController', updateStringsFromSync, true);

   if (!$scope.standaloneMode) {
      // TODO: find a better pattern for this
      SyncQueue.addSyncEndListeners('update_tm_recordings', function() {
         $scope.$apply(function() {
            $rootScope.recordings = ModelsManager.getRecords('tm_recordings');
         });
      });
      SyncQueue.planToSend(0);
   }

}]);
