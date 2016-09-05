app.service('PEMApi', ['$rootScope', function ($rootScope) {

var taskViews = {
    task: {},
    solution: {},
    submission: {},
    hints : {},
    forum : {requires: "task"},
    editor : {includes: ["submission"]}
};

var self = this;

this.task = {};
this.platform = window.platform;

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
      SyncQueue.addSyncEndListeners('task.updateToken', function() {
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

this.updateViews = function() {
   var task_strings = ModelsManager.getRecords('tm_tasks_strings');
   var viewsNeedUpdate = false;
   for (var string in task_strings) {
      if (task_strings.sSolution && taskViews.solution.requires) {
         taskViews.solution = {};
         viewsNeedUpdate = true;
      } else if (task_strings.sSolution && taskViews.solution.requires) {
         taskViews.solution = {requires: 'task'};
         viewsNeedUpdate = true;
      }
   }
   // add or remove hints view
   taskViews.hints = {requires: 'task'};
   var tasks = ModelsManager.getRecords('tm_tasks');
   for (var taskID in tasks) {// there should be only one!
      if (tasks[taskID].nbHintsTotal) {
         taskViews.hints = {};
      }
      if (tasks[taskID].bEditorInStatement) {
         taskViews.task = {includes: ["editor", "submission"]};
         taskViews.editor = {requires:"task"};
      } else {
         taskViews.task = {};
         taskViews.editor = {includes: ["submission"]};
      }
   }
};

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
   success({nbHints:0, minWidth:765});
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
