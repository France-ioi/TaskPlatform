'use strict';

/* 
 * Minimal task implementation, requires sToken global variable
 *
 */

var task = {};

task.showViews = function(views, callback) {
   callback();
};

task.load = function(views, callback) {
   callback();
}

task.getViews = function(callback) {
    var views = {
        task: {},
        solution: {requires: "task"},
        submission: {},
        hint : {requires: "task"},
        forum : {requires: "task"},
        editor : {requires: "task"}
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

task.reloadAnswer = function(strAnswer, callback) {
   // we should already have the answer loaded thanks to sync, we should just
   // ask submissionManager to display it.
   callback();
};

task.reloadState = function(state, callback) {
   callback();
}

task.getAnswer = function(callback) {
   callback('');
};

task.gradeAnswer = function(answer, answerToken, callback) {
   callback(0, '');
}

var grader =  { gradeTask: task.gradeAnswer };
