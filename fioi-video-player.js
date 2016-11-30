function getFioiPlayer() {
    return {
        players: [],
        isPlaying: false,
        currentPlayer: null,
        currentSeek: 0,
        duration: 0,
        loaded: false,

        targetDiv: null,
        progressBar: null,

        bind: function(elem) {
            var fioiPlayer = this;
            this.targetDiv = elem;
            $(elem).find('#play-pause').on('click', function () {
                fioiPlayer.playpause();
            });
            this.progressBar = $(elem).find('progress, meter').get(0);
            this.progressBar.addEventListener('mouseup', function (e) {
                fioiPlayer.seek(fioiPlayer.duration * e.offsetX / fioiPlayer.progressBar.offsetWidth);
                });

            if(window.location.protocol == 'file:') {
              $(elem).prepend('<div style="color: red">Attention : le lecteur vidéo peut rencontrer des soucis en ouverture directe du document (en file:///). Utilisez la commande <code>python -m SimpleHTTPServer</code> dans le dossier <code>tasks/v01/</code>, puis allez sur <a href="http://127.0.0.1:8000/">http://127.0.0.1:8000/</a> pour corriger ce problème.');
            }
        },

        prepareAnimation: function(idx) {
            var fioiPlayer = this;
            var newPlayer = {
                loaded: false,
                duration: 0,
                div: $('<div></div>'),
                play: $.noop,
                pause: $.noop,
                seek: $.noop
                };
            if(idx >= 0) {
                this.players[idx].div.hide();
                this.currentPlayer = (this.currentPlayer == idx) ? null : this.currentPlayer;
                this.players[idx] = newPlayer;
            } else {
                this.players.push(newPlayer);
            }
            this.updateLoaded();
            return this.players.indexOf(newPlayer);
        },

        replaceAnimation: function(player, idx) {
            this.players[idx] = player;
            this.updateLoaded();
        },

        addVideo: function(video, div, animation) {
            var fioiPlayer = this;
            var thisVideo = video;
            var newPlayer = {
                loaded: video.readyState >= 1,
                duration: video.duration ? video.duration : 0,
                animation: animation,
                div: div,
                play: video.play.bind(video),
                pause: video.pause.bind(video),
                seek: function(t) {
                    thisVideo.currentTime = t+0;
                    }
                };
            this.players.push(newPlayer);
            var newIdx = this.players.indexOf(newPlayer);

            if(newPlayer.loaded) {
                this.updateLoaded();
            } else {
                // Wait for media to load
                video.addEventListener('loadedmetadata', function() {
                    newPlayer.loaded = true;
                    newPlayer.duration = video.duration;
                    fioiPlayer.updateLoaded();
                    });
            }

            video.addEventListener('timeupdate', function() {
                fioiPlayer.updateSeek(newIdx, video.currentTime);
                if(animation) { animation(video.currentTime, div); }
                });

            video.addEventListener('ended', function() {
                fioiPlayer.next(newIdx);
            });
        },

        updateLoaded: function() {
            // Update state when one of the players finished loading metadata
            var nowLoaded = true;
            this.duration = 0;
            for(i=0; i<this.players.length; i++) {
                if(this.players[i].loaded) {
                    this.duration += this.players[i].duration;
                } else {
                    nowLoaded = false;
                }
            }

            if(nowLoaded) {
                this.progressBar.max = this.duration;
                this.updatePlayer(0);
                if(this.isPlaying) {
                   this.loaded = true;
                   this.seek(this.currentSeek);
                }
            }

            this.loaded = nowLoaded;
        },

        updateSeek: function(idx, t) {
            // Update state when one of the players' currentTime changed
            var newSeek = 0;
            for(i=0; i<idx; i++) {
                newSeek += this.players[i].duration;
            }
            newSeek += t;

            this.progressBar.value = newSeek;
            this.currentSeek = newSeek;
        },

        updatePlayer: function(newIdx) {
            if(newIdx != this.currentPlayer) {
                if(this.currentPlayer != null) {
                    this.players[this.currentPlayer].div.hide();
                }
                var ctn = $(this.targetDiv).find('#container');
                this.players[newIdx].ctnDiv = this.players[newIdx].div.appendTo(ctn).show();
                this.currentPlayer = newIdx;
            }
        },

        next: function(idx) {
            this.currentSeek = 0;
            // Player ended, start next player
            if(idx+1 >= this.players.length) {
                this.pause();
                this.seek(0);
            } else {
                var newSeek = 0;
                for(i=0; i<=idx; i++) {
                    newSeek += this.players[i].duration;
                }
                this.seek(newSeek);
            }
        },

        playpause: function() {
            if(this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        },

        play: function() {
            this.isPlaying = true;
            this.seek(this.currentSeek);
            $(this.targetDiv).find('#play-pause-glyph').addClass('glyphicon-pause').removeClass('glyphicon-play');
        },

        pause: function() {
            for(i=0; i<this.players.length; i++) {
                this.players[i].pause();
            }
            this.isPlaying = false;
            $(this.targetDiv).find('#play-pause-glyph').addClass('glyphicon-play').removeClass('glyphicon-pause');
        },

        seek: function(t) {
            // User seek
            if(!this.loaded) { return; };
            var remTime = t;
            var curPlayer = 0;
            while(curPlayer < this.players.length && remTime >= this.players[curPlayer].duration) {
                this.players[curPlayer].pause();
                remTime -= this.players[curPlayer].duration;
                curPlayer += 1;
            }
            if(curPlayer < this.players.length) {
                for(i=curPlayer+1; i<this.players.length; i++) {
                    this.players[i].pause();
                }
                this.players[curPlayer].seek(remTime);
                this.updatePlayer(curPlayer);
                if(this.isPlaying) {
                    this.players[curPlayer].play();
                }
            } else {
                this.updateSeek(-1, this.duration);
            }
        }
    };
}

function simpleFioiPlayerAttach(targetDiv, videoElem, videoDiv, videoAnimation) {
    var newFioiPlayer = getFioiPlayer();
    newFioiPlayer.bind(targetDiv);
    newFioiPlayer.addVideo(videoElem, videoDiv, videoAnimation);
}

function bindVttReader(url, selector) {
    var vttCues = [];
    var curTimestamp = 0;
    var curIdx = 0;
    var selected = $(selector);

    $.ajax({
        url: url,
        dataType: 'text',
        success: function(data) {
            var vttParser = new WebVTTParser();
            vttCues = vttParser.parse(data).cues;
            },
        error: function () {
            console.error("VTT reader couldn't load url " + url);
            }
        });

    return function(t) {
        if(t < curTimestamp) {
            curTimestamp = t;
            curIdx = 0;
        }
        for(idx=curIdx; idx<vttCues.length; idx++) {
            if(vttCues[idx].startTime > t) {
                selected.html('');
                return;
            } else if(vttCues[idx].endTime > t) {
                selected.html(vttCues[idx].text.replace(/\n/g, '<br>'));
                return;
            }
        }
        selected.html('');
    };
}

var fioiVideoPlayers = {};

function loadVideos() {
    $('fioi-video-player').each(function(idx, elem) {
        elem = $(elem);
        var newId = elem.attr('data-id');
        var callback = null;

        var width = elem.attr('width') ? parseInt(elem.attr('width')) : 772;
        var height = elem.attr('height') ? parseInt(elem.attr('height')) : 428;

        var newHtml = '';
        newHtml += ''
            + '<div id="'+newId+'" style="width: '+(width+12)+'px; '+elem.attr('style')+'">'
            + '   <div id="container" style="width: '+width+'px; height: '+height+'px; overflow: hidden;">'
            + '   </div>'
            + '   <button id="play-pause" class="btn btn-xs"><span id="play-pause-glyph" class="glyphicon glyphicon-play"></span></button>'
            + '   <meter min="0" max="100" value="0" style="height: 15px; width: '+(width-50)+'px"></meter>';

        // Video source
        // TODO : chain over each source if multiple
        newHtml += ''
            + '   <video id="videoSource" style="display: none;" crossorigin="anonymous">'
            + '      <source src="'+elem.attr('data-source')+'" type="audio/mpeg">';
        if(elem.attr('data-subtitles')) {
            newHtml += '      <track kind="subtitles" label="Sous-titres en français" src="'+elem.attr('data-subtitles')+'" srclang="fr" default></track>';
        }
        newHtml += '   </video>';

        // Video display
        newHtml += ''
            + '<div id="videoDisplay" style="display: none;">'
            + '   <img src="'+elem.attr('data-image')+'" width="'+width+'px" height="'+height+'px" />';
        if(elem.attr('data-subtitles')) {
            newHtml += '   <div id="subtitlesContainer" style="position: relative; top: -80px; height: 80px; width: 100%; background: rgba(0, 0, 0, 0.4); color: white; text-align: center; font-size: 24px"></div>'
        }
        newHtml += '</div>';

        newHtml += '</div>';

        elem.after(newHtml);

        var newFioiPlayer = getFioiPlayer();
        newFioiPlayer.bind($('#'+newId));

        if(elem.attr('data-animation')) {
            newFioiPlayer.prepareAnimation();
        }

        if(elem.attr('data-subtitles')) {
            callback = bindVttReader(elem.attr('data-subtitles'), $('#'+newId+' #subtitlesContainer'));
        }
        newFioiPlayer.addVideo($('#'+newId+' #videoSource').get(0), $('#'+newId+' #videoDisplay'), callback);

        fioiVideoPlayers[newId] = newFioiPlayer;
    });
}

//$(function() { setTimeout(loadVideos, 2000); });

app.directive('fioiVideoPlayer', function() {
   // TODO :: rework for angular
   return {
      template: function (elem, attr) {
        elem = $(elem);
        var newId = elem.attr('data-id');
        var callback = null;

        var width = elem.attr('width') ? parseInt(elem.attr('width')) : 772;
        var height = elem.attr('height') ? parseInt(elem.attr('height')) : 428;

        var newHtml = '';
        newHtml += ''
            + '<div id="'+newId+'" style="width: '+(width+12)+'px; '+elem.attr('style')+'">'
            + '   <div id="container" style="width: '+width+'px; height: '+height+'px; overflow: hidden;">'
            + '   </div>'
            + '   <button id="play-pause" class="btn btn-xs"><span id="play-pause-glyph" class="glyphicon glyphicon-play"></span></button>'
            + '   <meter min="0" max="100" value="0" style="height: 15px; width: '+(width-50)+'px"></meter>';

        // Video source
        // TODO : chain over each source if multiple
        newHtml += ''
            + '   <video id="videoSource" style="display: none;" crossorigin="anonymous">'
            + '      <source src="'+elem.attr('data-source')+'" type="audio/mpeg">';
        if(elem.attr('data-subtitles')) {
            newHtml += '      <track kind="subtitles" label="Sous-titres en français" src="'+elem.attr('data-subtitles')+'" srclang="fr" default></track>';
        }
        newHtml += '   </video>';

        // Video display
        newHtml += ''
            + '<div id="videoDisplay" style="display: none;">'
            + '   <img src="'+elem.attr('data-image')+'" width="'+width+'px" height="'+height+'px" />';
        if(elem.attr('data-subtitles')) {
            newHtml += '   <div id="subtitlesContainer" style="position: relative; top: -80px; height: 80px; width: 100%; background: rgba(0, 0, 0, 0.4); color: white; text-align: center; font-size: 24px"></div>'
        }
        newHtml += '</div>';

        newHtml += '</div>';

        return newHtml;
      },
    link: function(scope, elem, attrs) {
        var newFioiPlayer = getFioiPlayer();
        var newId = elem.attr('data-id');
        newFioiPlayer.bind($('#'+newId));

        if(elem.attr('data-animated')) {
            newFioiPlayer.prepareAnimation();
        }

        if(elem.attr('data-subtitles')) {
            callback = bindVttReader(elem.attr('data-subtitles'), $('#'+newId+' #subtitlesContainer'));
        }
        newFioiPlayer.addVideo($('#'+newId+' #videoSource').get(0), $('#'+newId+' #videoDisplay'), callback);

        fioiVideoPlayers[newId] = newFioiPlayer;
    }
   }
});

function fioiPlayerEvaluationCallback(submission, animationLoaded) {
    var successPlayer = fioiVideoPlayers['successPlayer'];
    var failurePlayer = fioiVideoPlayers['failurePlayer'];
    if(!submission.bEvaluated) {
        $('#successPlayer').hide();
        $('#failurePlayer').hide();
        failurePlayer.pause();
        failurePlayer.seek(0);
        successPlayer.pause();
        successPlayer.seek(0);
        if(typeof taskSettings !== 'undefined' && typeof taskSettings.animationFeatures !== 'undefined') {
           failurePlayer.prepareAnimation(0);
           successPlayer.prepareAnimation(0);
        }
        return;
    }

    $('html, body').animate({scrollTop: $('#submission-visualization').offset().top-50}, 1000);
    if(submission.iScore == 100) {
        $('#failurePlayer').hide();
        $('#successPlayer').appendTo('#submission-visualization');
        $('#successPlayer').show();
        successPlayer.play();
    } else {
        $('#successPlayer').hide();
        $('#failurePlayer').appendTo('#submission-visualization');
        $('#failurePlayer').show();
        failurePlayer.play();
    }
}

function simulationToVideo(fioiPlayer, idx, selector, task, commands) {
    var nbCmds = 0;
    var animDelay = 0.4;
    var simu = null;
    var callback = function (curCmd) {
        if(curCmd >= nbCmds) {
            simu.pause();
            setTimeout(function() { fioiPlayer.updateSeek(idx, curCmd*animDelay+1) }, 1000);
            setTimeout(function() { fioiPlayer.updateSeek(idx, curCmd*animDelay+2) }, 2000);
            setTimeout(function() { fioiPlayer.next(idx) }, 3000);
        } else {
            fioiPlayer.updateSeek(idx, curCmd*animDelay);
        }
    }

    simu = simulationInstance(selector, task, commands, callback);
    animDelay = simu.animDelay/1000;
    nbCmds = simu.nbCmds;

//    $(selector).find('.play, .pause, .restart').remove();

    var newPlayer = {
        loaded: true,
        duration: simu.nbCmds*animDelay+3,
        animation: $.noop,
        div: $(selector),
        play: simu.play,
        pause: simu.pause,
        seek: simu.seek
        };
    fioiPlayer.replaceAnimation(newPlayer, idx);
}
