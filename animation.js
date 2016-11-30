function createInstance(tag, commands, options) {
   /*var tag = "#" + name;
   $(tag).replaceWith($('#simuTemplate').clone().css('display', 'block').attr('id', $(tag).attr('id')));*/
   return new simulationInstance(tag, animationFeatures(tag), commands);
}

function simulationInstance(selector, task, commands, callback) {
   'use strict';
   //alert(selector);
   var isMutable = false;
   var mutableCallBack = null;
   var curCmd = 0;
   var startCmd = curCmd;
   var textDisplayed = false;
   var playModes = {
      stopped: 0,
      playing: 1,
      paused: 2
   };
   var playMode = playModes.stopped;

   if(!callback) {
      callback = $.noop;
   }

   ///// Setters /////
   // Can the simulation be modified ?
   var setMutable = function(val, cb) {
      isMutable = val;
      if (val)
         $("#lineRoad td", selector).addClass("mutable");
      else
         $("#lineRoad td", selector).removeClass("mutable");
         
      if (typeof cb != "undefined") {
         mutableCallBack = function() {
            cb(task.getInput());
         };
         mutableCallBack();
      }
   };
 
   var execCmd = function(cmd, cb) {
      var cmdName = cmd[0];
      var cmdArgs = cmd.slice(1);
      if (cmdName == "printText") {
         var pre = $(".textOutput", selector);
         if (!textDisplayed) {
            textDisplayed = true;
            pre.html("Texte affiché par votre programme :\n");
            pre.show();
         }
         pre.html(pre.html() + cmdArgs[0] + "<br/>");
         cb();
      } else {
         if (!task[cmdName]) {
            alert("Internal error : unknown command: '" + cmdName + "'");
            return;
         }
         task[cmdName](cmdArgs, cb);
         //alert("in");
      }
   };

   var execNextCmd = function() {
      if (playMode == playModes.stopped) {
         return;
      }
      if (curCmd >= commands.length) {
         return;
      }
      var cmd = commands[curCmd];
      curCmd++;
      if (curCmd >= commands.length) {
         $(selector + " .play, " + selector + " .pause").attr('disabled', 'disabled');
      }
      var cb = function () { callback(curCmd-startCmd); execNextCmd(); };
      if (playMode == playModes.paused || playMode == playModes.stopped) {
         cb = function () { callback(curCmd-startCmd); };
      }
      execCmd(cmd, cb);
   };

   if (typeof commands == "string") {
      commands = $.parseJSON(commands);
   }
   while (curCmd < commands.length) {
      var cmd = commands[curCmd];
      curCmd++;
      execCmd(cmd, $.noop);
      if (cmd[0] == "startSimu") {
         break;
      }
   }
   startCmd = curCmd;

   var nbCmds = commands.length - startCmd;
   
   
   var play = function () {
      if (playMode != playModes.playing) {
         playMode = playModes.playing;
         execNextCmd();
      }
   }

   var stop = function () {
      playMode = playModes.stopped;
   }

   var pause = function () {
      playMode = playModes.paused;
      execNextCmd();
   }

   var restart = function () {
      if (playMode != playModes.stopped) {
         textDisplayed = false;
         $(".textOutput", selector).hide();
         $(selector + " .play, " + selector + " .pause").removeAttr('disabled');
         playMode = playModes.stopped;
         curCmd = startCmd;
         $(selector).find().stop();
         task.displayMsg([""], $.noop);
         task.stop($.noop);
      }
   }

   var seek = function (t) {
      var oldPlayMode = playMode;
      playMode = playModes.playing;
      restart();
      callback(0);
      if(oldPlayMode == playModes.playing) {
        play();
      }
   }

   $(selector + " .play").click(function () { setTimeout(play, 100); });
   $(selector + " .pause").click(pause);
   $(selector + " .restart").click(restart);

   return {
      animDelay: task.animDelay ? task.animDelay : 400,
      nbCmds: nbCmds,
      play: play,
      pause: stop,
      seek: seek
      }
}
