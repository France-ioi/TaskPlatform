(function() {
'use strict';

/* 
 * Minimal task implementation, requires sToken global variable
 *
 */

window.task = {};

var taskViews = {
    task: {},
    solution: {requires: "task"},
    submission: {requires: "editor"},
    hints : {requires: "task"},
    forum : {requires: "task"},
    editor : {}
};

task.showViews = function(viewsToShow, callback)
{
   $.each(taskViews, function(view, params) {
      if (view in viewsToShow || params.requires in viewsToShow) {
         $('#'+view).show();
      } else
        $('#'+view).hide();
   });
   callback();
};

task.load = function(views, callback) {
   $('#editor').hide();
   $('#submission').hide();
   $('#hints').hide();
   $('#solution').hide();
//   if (!SyncQueue.interval) { // task has been unloaded
//      SyncQueue.sync();
//      SyncQueue.interval = setInterval(SyncQueue.planToSend, 5000);
//   }
   SyncQueue.addSyncEndListeners('task.load', function() {
      // updateViews has its own syncEndListener, but there is not guarantee
      // that it will be called before this one, and views must be set when
      // callback is called
      updateViews();
      callback();
      SyncQueue.removeSyncEndListeners('task.load');
   });
}

task.getViews = function(callback) {
    callback(taskViews);
};

function updateViews() {
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
}

SyncQueue.addSyncEndListeners('task.updateToken', function() {
   updateViews();
});

task.updateToken = function(token, callback) {
   sToken = token;
   SyncQueue.params['sToken'] = sToken;
   SyncQueue.planToSend();
   SyncQueue.addSyncEndListener('task.updateToken', function() {
      callback();
      SyncQueue.removeSyncEndListeners('task.updateToken');
   });
};

task.getHeight = function(callback) {
   callback(parseInt($("body").outerHeight(true)));
};

task.unload = function(callback) {
   if (SyncQueue.interval) {
      clearInterval(SyncQueue.interval);
   }
   SyncQueue.sentVersion = 0;
   SyncQueue.resetSync = true;
   ModelsManager.init(models);
   SyncQueue.init(ModelsManager);
   callback();
};

task.getState = function(callback) {
   callback('');
};

task.getMetaData = function(callback) {
   callback({nbHints:0});
}

task.onReloadAnswer = function(){};

task.reloadAnswer = function(strAnswer, callback) {
   // we should already have the answer loaded thanks to sync, we should just
   // ask submissionManager to display it.
   // there seems to be no clean way to mix global variables and angular stuff, 
   // so we just override task.reloadAnswer in the taskController
   callback();
};

task.reloadState = function(state, callback) {
   callback();
}

task.getAnswer = function(callback) {
   $.post('saveAnswer.php', {sToken: sToken, sPlatform: decodeURIComponent(sPlatform)}, function(res) {
      if (!res) {
         console.error('got no answer from saveAnswer');
         callback('');
         return;
      }
      if (!res.bSuccess) {
         console.error('got error from saveAnswer: '+res.sError);
         callback('');
         return;
      }
      //console.error('answer saved as '+res.sAnswer);
      callback(res.sAnswer);
   }, 'json');
};

task.gradeAnswer = function(answer, answerToken, callback) {
   callback(0, '');
}

window.grader =  { gradeTask: task.gradeAnswer };


})();
