INSERT INTO `tm_tasks` (`id`, `sTextId`, `sSupportedLangProg`, `sAuthor`, `sAuthorSolution`, `bShowLimits`, `bUserTests`, `bChecked`, `iEvalMode`, `bUsesLibrary`, `bUseLatex`, `iMinScoreForSuccessGlobal`, `bIsEvaluable`, `sTemplateName`, `iVersion`, `bBebras`, `sBebrasUrl`, `sScriptAnimation`) VALUES
(1920, 'Task', '*', '', '', 1, 1, 0, 0, 0, 0, 100, 1, '', 0, 0, NULL, 'var biggestStone = function(selector) {\n   var cellSize = 36;\n   var margin = 10;\n   var animTime = 250;\n   var animDelay = 400;\n\n   var nbCells = 0;\n   var weights = [];\n   var curPos = 0;\n   var curWeight = 0;\n   var curMarble = -1;\n   var posMarbles = [];\n   var idMarblesAtPos = [];\n\n   var origWeights = [];\n\n   var marbles = [];\n   var robot = null;\n   var paper = null;\n   \n   var getMarbleCoords = function(iMarble) {\n      return {\n         x: margin + posMarbles[iMarble][0] * cellSize + cellSize / 2,\n         y: margin + (posMarbles[iMarble][1] + 1) * cellSize + cellSize / 2\n      }\n   };\n   \n   var animMarble = function(iMarble) {\n      var centre = getMarbleCoords(iMarble);\n      var anim = Raphael.animation({''cx'' : centre.x, ''cy'' : centre.y}, animTime);\n      marbles[iMarble].marble.animate(anim);\n      anim = Raphael.animation({''x'' : centre.x, ''y'' : centre.y}, animTime);\n      marbles[iMarble].text.animate(anim);\n   }\n\n   var animRobot = function() {\n      var anim = Raphael.animation({''x'' : margin + curPos * cellSize, ''cy'' : margin + cellSize}, animTime);\n      robot.animate(anim);\n   }\n\n   return {\n   ///// Setting situation parameters   \n      setNbCells: function(args, cb) {\n         nbCells = parseInt(args[0]);\n         idMarblesAtPos[0] = 0;\n         for (var iMarble = 0; iMarble < nbCells - 2; iMarble++) {\n            posMarbles[iMarble] = [iMarble + 1, 1];\n            idMarblesAtPos[iMarble + 1] = iMarble;\n         }\n         cb();\n      },\n      \n      setWeight: function(args, cb) {\n         var pos = parseInt(args[0]);\n         var weight = parseInt(args[1]);\n         origWeights[pos] = weight;\n         weights[pos] = weight;\n         cb();\n      },\n\n      startSimu: function(args, cb) {\n         $("#simuShow", selector).html("");\n         $("#simuMsg", selector).html("");\n\n         paper = Raphael($("#simuShow", selector)[0],(nbCells + 2) * cellSize + 2 * margin, 3 * cellSize + 2 * margin);\n\n         //Quadrillage\n         var setRectGrille = paper.set();\n         for(var iCol = 0; iCol < nbCells; iCol++) {\n            var rect = paper.rect(margin + iCol * cellSize, margin + 2 * cellSize, cellSize, cellSize);\n            var fill = ''white'';\n            rect.attr({''stroke'': ''black'', ''fill'': fill});\n            setRectGrille.push(rect);\n         }\n\n         // Robot\n         robot = paper.rect(margin, margin + cellSize, cellSize, cellSize);\n         robot.attr({''stroke'': ''black'', ''fill'': ''green''});\n\n         //Pierres\n         marbles = [];\n         texts = [];\n         for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {\n            var centre = getMarbleCoords(iMarble);\n            var marble = paper.circle(centre.x, centre.y, cellSize/2 - cellSize/20);\n            marble.attr({''fill'' : ''yellow''});\n            var text = paper.text(centre.x, centre.y, weights[iMarble + 1]);\n            text.attr({ "font-size": 16, "font-weight": ''bold'' });\n            marbles[iMarble] = { marble: marble, text:  text};\n            animMarble(iMarble);\n         }\n         setTimeout(function() {\n            for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {\n               animMarble(iMarble);\n            }         \n         }, 3000);\n         cb();\n      },\n      \n      stop: function (cb) {\n         curPos = 0;\n         animRobot();\n         curWeight = 0;\n         curMarble = -1;\n         for (var iPos = 0; iPos < nbCells; iPos++) {\n            weights[iPos] = origWeights[iPos];\n         }\n         for(var iMarble = 0; iMarble < nbCells - 2; iMarble++) {\n            idMarblesAtPos[iMarble + 1] = iMarble;\n            posMarbles[iMarble] = [iMarble + 1, 1];\n            animMarble(iMarble);\n         }\n         cb();\n      },\n\n      // Must return the corresponding test file\n      getInput: function() {\n         // TODO\n      },  \n\n      displayMsg: function(args, cb) {\n         $("#simuMsg", selector).html(args[0]);\n         cb();\n      },\n\n      move: function(args, cb) {\n         var nbSteps = parseInt(args[0]);\n         curPos = Math.max(Math.min(curPos + nbSteps, nbCells -1), 0);\n         if (curWeight != 0) {\n            posMarbles[curMarble] = [curPos, 0];\n            animMarble(curMarble);\n         }\n         animRobot();\n         setTimeout(cb, animDelay);\n      },\n\n      drop: function(args, cb) {\n         if ((curWeight != 0) && (weights[curPos] == 0)) {\n            weights[curPos] = curWeight;\n            curWeight = 0;\n            idMarblesAtPos[curPos] = curMarble;\n            posMarbles[curMarble] = [curPos, 1];\n            animMarble(curMarble);\n         }\n         setTimeout(cb, animDelay);\n      },\n\n      take: function(args, cb) {\n         if ((curWeight == 0) && (weights[curPos] != 0)) {\n            curWeight = weights[curPos];\n            weights[curPos] = 0;\n            curMarble = idMarblesAtPos[curPos];\n            posMarbles[curMarble] = [curPos, 0];\n            animMarble(curMarble);\n         }\n         setTimeout(cb, animDelay);\n      },\n\n      throw: function(args, cb) {\n         if (curWeight != 0) {\n            curWeight = 0;\n            //curMarble = idMarblesAtPos[curPos];\n            posMarbles[curMarble] = [curPos, -5];\n            animMarble(curMarble);\n         }\n         setTimeout(cb, animDelay);\n      }\n   }\n};\n');

UPDATE `tm_submissions_tests` SET `sOutput` = '            ["setNbCells", "16"],
            ["setWeight", "0", "0"],
            ["setWeight", "1", "4"],
            ["setWeight", "2", "5"],
            ["setWeight", "3", "3"],
            ["setWeight", "4", "10"],
            ["setWeight", "5", "2"],
            ["setWeight", "6", "13"],
            ["setWeight", "7", "9"],
            ["setWeight", "8", "8"],
            ["setWeight", "9", "7"],
            ["setWeight", "10", "1"],
            ["setWeight", "11", "11"],
            ["setWeight", "12", "14"],
            ["setWeight", "13", "6"],
            ["setWeight", "14", "12"],
            ["setWeight", "15", "0"],
            ["startSimu"],
            ["move", "1"], 
            ["take"], 
            ["move", "1"],
            ["move", "1"],
            ["move", "-3"], 
            ["drop"], 
            ["move", "2"],
            ["take"],
            ["throw"]' WHERE `tm_submissions_tests`.`id` = 4320700;
