import _ from 'lodash';
import $ from 'jquery';
import platform from 'France-ioi/pem-task';

PEMApi.$inject = ['$rootScope'];
export function PEMApi ($rootScope) {

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
this.platform = platform;

this.task.showViews = function(viewsToShow, success, error) {
   var requiredViews = {};
   _.forEach(viewsToShow, function(params, view) {
      window.taskView = taskViews[view];
      if (!taskViews[view]) {
         console.error('unknown view: '+view);
         error('unknown view: '+view);
         return;
      }
      requiredViews[view] = true;
      if (taskViews[view].requires) {
         requiredViews[taskViews[view].requires] = true;
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
   SyncQueue.addSyncEndListeners('task.updateToken', function() {
      self.updateViews();
   });
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
   for (var taskID in tasks) {
      if (tasks[taskID].nbHintsTotal) {
         taskViews.hints = {};
      }
   }
};

this.task.getViews = function(success, error) {
   try {
      self.updateViews();
   } catch(e) {
      error(e);
   }
   success(taskViews);
};

this.task.updateToken = function(token, success, error) {
   sToken = token;
   SyncQueue.params.sToken = sToken;
   $rootScope.sToken = sToken;
   SyncQueue.addSyncEndListeners('task.updateToken', function() {
      SyncQueue.removeSyncEndListeners('task.updateToken');
      success();
   }, true);
   SyncQueue.planToSend();
};

this.task.getHeight = function(success, error) {
   success(parseInt($("body").outerHeight(true)));
};

this.task.unload = function(success, error) {
   if (SyncQueue.interval) {
      clearInterval(SyncQueue.interval);
   }
   SyncQueue.sentVersion = 0;
   SyncQueue.resetSync = true;
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   success();
};

this.task.getState = function(success, error) {
   success('');
};

this.task.getMetaData = function(success, error) {
   // TODO: complete
   success({nbHints:0, minWidth:765});
};

this.task.getHeight = function(success, error) {
   success(parseInt($("body").outerHeight(true)));
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
      //console.error('answer saved as '+res.sAnswer);
      console.error('got Answer '+res.sAnswer);
      success(res.sAnswer);
   }, 'json');
};

this.task.gradeAnswer = function(answer, answerToken, success, error) {
   success(0, '');
};

}
