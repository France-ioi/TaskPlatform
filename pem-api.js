(function() {
'use strict';

/* 
 * Minimal task implementation, requires sToken global variable
 *
 */

window.task = {};

task.showViews = function(views, callback)
{
   $.each(['editor', 'task', 'hints', 'solution', 'submission'], function(i, view) {
      if (view in views) {
         $('#'+view).show();
         if (view == 'editor') {
            setTimeout(function() {
               $('#sourcesEditor').editor('refresh');
            }, 1);
        }
      } else
        $('#'+view).hide();
   });
   callback();
};

task.load = function(views, callback) {
   $('#editor').hide();
   $('#submission').hide();
   callback();
}

task.getViews = function(callback) {
    var views = {
        task: {},
        solution: {requires: "task"},
        submission: {},
        hint : {requires: "task"},
        forum : {requires: "task"},
        editor : {}
    };
    callback(views);
};

task.updateToken = function(token, callback) {
   sToken = token;
   SyncQueue.params['sToken'] = sToken;
   callback();
};

task.getHeight = function(callback) {
   callback(parseInt($("body").outerHeight(true)));
};

task.unload = function(callback) {
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
