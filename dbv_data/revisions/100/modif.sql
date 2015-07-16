UPDATE `tm_tasks` SET `sScriptAnimation` = 'var animationFeatures = function(selector) {
   var cellSize = 36;
   var margin = 10;
   var animTime = 250;
   var animDelay = 400;

   var nbCells = 0;
   var weights = [];
   var curPos = 0;
   var curWeight = 0;
   var curMarble = -1;
   var posMarbles = [];
   var idMarblesAtPos = [];

   var origWeights = [];

   var marbles = [];
   var robot = null;
   var paper = null;
   
   var getMarbleCoords = function(iMarble) {
      return {
         x: margin + posMarbles[iMarble][0] * cellSize + cellSize / 2,
         y: margin + (posMarbles[iMarble][1] + 1) * cellSize + cellSize / 2
      }
   };
   
   var animMarble = function(iMarble) {
      var centre = getMarbleCoords(iMarble);
      var anim = Raphael.animation({''cx'' : centre.x, ''cy'' : centre.y}, animTime);
      marbles[iMarble].marble.animate(anim);
      anim = Raphael.animation({''x'' : centre.x, ''y'' : centre.y}, animTime);
      marbles[iMarble].text.animate(anim);
   }

   var animRobot = function() {
      var anim = Raphael.animation({''x'' : margin + curPos * cellSize, ''cy'' : margin + cellSize}, animTime);
      robot.animate(anim);
   }

   return {
   ///// Setting situation parameters   
      setNbCells: function(args, cb) {
         nbCells = parseInt(args[0]);
         idMarblesAtPos[0] = 0;
         for (var iMarble = 0; iMarble < nbCells - 2; iMarble++) {
            posMarbles[iMarble] = [iMarble + 1, 1];
            idMarblesAtPos[iMarble + 1] = iMarble;
         }
         cb();
      },
      
      setWeight: function(args, cb) {
         var pos = parseInt(args[0]);
         var weight = parseInt(args[1]);
         origWeights[pos] = weight;
         weights[pos] = weight;
         cb();
      },

      startSimu: function(args, cb) {
         $(".simuShow", selector).html("");
         $(".simuMsg", selector).html("");

         paper = Raphael($(".simuShow", selector)[0],(nbCells + 2) * cellSize + 2 * margin, 3 * cellSize + 2 * margin);

         //Quadrillage
         var setRectGrille = paper.set();
         for(var iCol = 0; iCol < nbCells; iCol++) {
            var rect = paper.rect(margin + iCol * cellSize, margin + 2 * cellSize, cellSize, cellSize);
            var fill = ''white'';
            rect.attr({''stroke'': ''black'', ''fill'': fill});
            setRectGrille.push(rect);
         }

         // Robot
         robot = paper.rect(margin, margin + cellSize, cellSize, cellSize);
         robot.attr({''stroke'': ''black'', ''fill'': ''green''});

         //Pierres
         marbles = [];
         texts = [];
         for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {
            var centre = getMarbleCoords(iMarble);
            var marble = paper.circle(centre.x, centre.y, cellSize/2 - cellSize/20);
            marble.attr({''fill'' : ''yellow''});
            var text = paper.text(centre.x, centre.y, weights[iMarble + 1]);
            text.attr({ "font-size": 16, "font-weight": ''bold'' });
            marbles[iMarble] = { marble: marble, text:  text};
            animMarble(iMarble);
         }
         setTimeout(function() {
            for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {
               animMarble(iMarble);
            }         
         }, 3000);
         cb();
      },
      
      stop: function (cb) {
         curPos = 0;
         animRobot();
         curWeight = 0;
         curMarble = -1;
         for (var iPos = 0; iPos < nbCells; iPos++) {
            weights[iPos] = origWeights[iPos];
         }
         for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {
            idMarblesAtPos[iMarble + 1] = iMarble;
            posMarbles[iMarble] = [iMarble + 1, 1];
            animMarble(iMarble);
         }
         cb();
      },

      // Must return the corresponding test file
      getInput: function() {
         // TODO
      },  

      displayMsg: function(args, cb) {
         $(".simuMsg", selector).html(args[0]);
         cb();
      },

      move: function(args, cb) {
         var nbSteps = parseInt(args[0]);
         curPos = Math.max(Math.min(curPos + nbSteps, nbCells -1), 0);
         if (curWeight != 0) {
            posMarbles[curMarble] = [curPos, 0];
            animMarble(curMarble);
         }
         animRobot();
         setTimeout(cb, animDelay);
      },

      drop: function(args, cb) {
         if ((curWeight != 0) && (weights[curPos] == 0)) {
            weights[curPos] = curWeight;
            curWeight = 0;
            idMarblesAtPos[curPos] = curMarble;
            posMarbles[curMarble] = [curPos, 1];
            animMarble(curMarble);
         }
         setTimeout(cb, animDelay);
      },

      take: function(args, cb) {
         if ((curWeight == 0) && (weights[curPos] != 0)) {
            curWeight = weights[curPos];
            weights[curPos] = 0;
            curMarble = idMarblesAtPos[curPos];
            posMarbles[curMarble] = [curPos, 0];
            animMarble(curMarble);
         }
         setTimeout(cb, animDelay);
      },

      throw: function(args, cb) {
         if (curWeight != 0) {
            curWeight = 0;
            //curMarble = idMarblesAtPos[curPos];
            posMarbles[curMarble] = [curPos, -5];
            animMarble(curMarble);
         }
         setTimeout(cb, animDelay);
      }
   }
};
' WHERE `tm_tasks`.`id` = 1920;
