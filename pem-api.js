app.service('PEMApi', ['$rootScope', function ($rootScope) {

var taskViews = {
    task: {},
    // No base view "solution", it is added in updateViews if there's a solution
    submission: {},
    hints : {},
    forum : {requires: "task"},
    editor : {includes: ["submission"]}
};

var self = this;

this.task = {};
this.platform = window.platform;
var dualViewStatus = {
   loaded: false,
   enabled: false,
   active: false};

this.task.showViews = function(viewsToShow, success, error) {
   var requiredViews = {};
   _.forEach(viewsToShow, function(params, view) {
      taskView = taskViews[view];
      if (!taskViews[view]) {
         error('unknown view: '+view);
         return;
      }
      requiredViews[view] = true;
      if (taskViews[view].requires) {
         var required = taskViews[view].requires;
         requiredViews[required] = true;
         _.forEach(taskViews[required].includes, function(view) {
            requiredViews[view] = true;
         });
      }
      _.forEach(taskViews[view].includes, function(view) {
         requiredViews[view] = true;
      });
   });

   self.updateEditorInStatement((requiredViews['task'] || requiredViews['editor']) ? 'activate' : 'deactivate');

   _.forEach(taskViews, function(params, view) {
      if (requiredViews[view]) {  
         $('#'+view).show();
      } else {
        $('#'+view).hide();
      }
   });
   success();
};

this.init = function() {
   this.updateViews();
   var self = this;
   if (typeof SyncQueue !== 'undefined') {
      SyncQueue.addSyncEndListeners('task.init', function() {
         self.updateViews();
      });
   }
   this.platform.initWithTask(this.task);
};

this.task.load = function(views, success, error) {
   $('#editor').hide();
   $('#submission').hide();
   $('#hints').hide();
   $('#solution').hide();
   // TODO: handle views
   success();
};

this.updateEditorInStatement = function(operation) {
   // Put the editor aside the statement in a dual view pane
   // operation: one of
   // -enable: next time task or editor is shown, they will be in a dual view
   // -disable: disable dual view
   // -activate: show dual view and show task and editor views if enabled
   // -deactivate: hide dual view

   if(operation == 'enable') {
      if(dualViewStatus.enabled) {
         return;
      } else {
         dualViewStatus.enabled = true;
      }
   } else if(operation == 'disable') {
      if(!dualViewStatus.enabled) {
         return;
      } else {
         dualViewStatus.enabled = false;
      }
   } else if(operation == 'activate') {
      if(dualViewStatus.active) {
         return;
      } else {
         dualViewStatus.active = true;
      }
   } else if(operation == 'deactivate') {
      if(!dualViewStatus.active) {
         return;
      } else {
         dualViewStatus.active = false;
      }
   }

   if(dualViewStatus.enabled) {
      taskViews.task = {includes: ["editor", "submission"]};
      taskViews.editor = {requires: "task"};
   } else {
      taskViews.task = {};
      taskViews.editor = {includes: ["submission"]};
   }

   var moveViews = function () {
      if (dualViewStatus.enabled) {
         // Create dual view
         if(!$('#dualView').length) {
            $('body').prepend('<div id="dualView"><div id="dualViewLeft"><div id="dualViewLeftContent"></div></div><div id="dualViewRight"><div id="dualViewRightContent"></div></div></div>');
         }
         $('body').width('100%');
         $('#dualView').show();
   
         // Move views in the dualView
         $('#task').appendTo('#dualViewLeftContent');
         $('#editor').appendTo('#dualViewRightContent');
         $('#submission').appendTo('#dualViewRightContent');
         if(dualViewStatus.active) {
            $('#task').show();
            $('#editor').show();
            $('#submission').show();
         } else {
            $('#task').hide();
            $('#editor').hide();
            $('#submission').hide();
         }
      } else {
         // Move views out of the dualView
         $('#submission').prependTo('body').hide();
         $('#editor').prependTo('body').hide();
         $('#task').prependTo('body');
         $('#dualView').hide();
         $('body').width('772px');
         $('#task').show();
      }
   };

   if(dualViewStatus.enabled && dualViewStatus.active) {
      if(dualViewStatus.loaded) {
         moveViews();
      } else {
         // On first load, let all initialization happen beforehand
         setTimeout(moveViews, 10);
      }
   } else if(dualViewStatus.active) {
      moveViews();
   } else {
      $('#dualView').hide();
      $('#task').hide();
      $('#editor').hide();
      $('#submission').hide();
   }
};

this.updateViews = function() {
   var task_strings = ModelsManager.getRecords('tm_tasks_strings');
   var viewsNeedUpdate = false;
   for (var taskID in task_strings) {
      // Add the solution view
      if (task_strings[taskID].sSolution && (!taskViews.solution || !taskViews.solution.requires)) {
         taskViews.solution = {};
         viewsNeedUpdate = true;
      } else if (task_strings[taskID].sSolution && taskViews.solution && taskViews.solution.requires) {
         taskViews.solution = {requires: 'task'};
         viewsNeedUpdate = true;
      }
   }
   // add or remove hints view
   taskViews.hints = {requires: 'task'};
   var tasks = ModelsManager.getRecords('tm_tasks');
   if(dualViewStatus.enabled) {
      var editorInStatement = (window.innerWidth >= 1560);
   } else {
      // Enable only if we won't go under the limit if a scrollbar is added
      var editorInStatement = (window.innerWidth >= 1580);
   }
   for (var taskID in tasks) {// there should be only one!
      if (tasks[taskID].nbHintsTotal) {
         taskViews.hints = {};
      }
      editorInStatement = editorInStatement || tasks[taskID].bEditorInStatement;
   }

   // set up statement/editor views
   self.updateEditorInStatement(editorInStatement ? 'enable' : 'disable');
};

this.onResize = function() {
   this.updateViews();
   if(this.platform) {
      this.platform.updateDisplay({ views: taskViews });
   }
}

$(window).resize(this.onResize.bind(this));

this.task.getViews = function(success, error) {
   try {
      self.updateViews();
   } catch(e) {
      console.error(e);
   }
   success(taskViews);
};

this.task.updateToken = function(token, success, error) {
   $rootScope.sToken = token;
   if (typeof SyncQueue !== 'undefined') {
      SyncQueue.params.sToken = token;
      SyncQueue.addSyncEndListeners('task.updateToken', function() {
         SyncQueue.removeSyncEndListeners('task.updateToken');
         success();
      }, true);
      SyncQueue.serverVersion = 0;
      SyncQueue.resetSync = true;
      SyncQueue.planToSend(0);
   } else {
      success();
   }
};

this.task.getHeight = function(success, error) {
   var height = parseInt($("html").height());
   if (height < 750) height = 750;
   success(height);
};

this.task.unload = function(success, error) {
   if (typeof SyncQueue !== 'undefined') {
      if (SyncQueue.interval) {
         clearInterval(SyncQueue.interval);
      }
      SyncQueue.sentVersion = 0;
      SyncQueue.resetSync = true;
      ModelsManager.init(models);
      SyncQueue.init(ModelsManager);
   }
   success();
};

this.task.getState = function(success, error) {
   success('');
};

this.task.getMetaData = function(success, error) {
   // TODO: complete
   success({nbHints:0, minWidth: 'auto'});
};

this.task.reloadAnswer = function(strAnswer, success, error) {
   // currently overriden by controller, but a more generic callback handling should be made
   // or maybe a callback in the synchro then a timeout(apply)
   success();
};

this.task.reloadState = function(state, success, error) {
   success();
};

this.task.getAnswer = function(success, error) {
   // TODO: move to $http
   $.post('saveAnswer.php', {sToken: sToken, sPlatform: decodeURIComponent(sPlatform)}, function(res) {
      if (!res) {
         error('got no answer from saveAnswer');
         return;
      }
      if (!res.bSuccess) {
         error('got error from saveAnswer: '+res.sError);
         return;
      }
      success(res.sAnswer);
   }, 'json');
};

this.task.gradeAnswer = function(answer, answerToken, success, error) {
   success(0, '');
};

}]);
