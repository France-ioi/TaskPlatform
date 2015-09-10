'use strict';

app.controller('recordController', ['$scope', '$rootScope', 'TabsetConfig', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'FioiEditor2Player', 'FioiEditor2Audio', 'Languages', function($scope, $rootScope, TabsetConfig, tabsets, signals, recorder, player, audio, Languages) {
console.error($rootScope.recordings);
    // The dumpState function is used by the recorder to save the global
    // state.  This implementation saves the tabsets, more elements could
    // be included in the dump.
    function dumpState () {
      return {tabsets: tabsets.dump()};
    }

    // The loadState function is used by the recorder to load a global state.
    // The state passed is a previous result from the dumpState function.
    function loadState (state) {
      // Reload tabsets from the saved state.  This will clear all tabsets,
      // tabs, and buffers.
      tabsets.load(state.tabsets);
      // The configuration of the tabsets is not stored in the saved state
      // and needs to be restored after reloading the tabsets.
      TabsetConfig.configureTabsets();
    }

    var recorderOptions = {
      dumpState: dumpState,
      loadState: loadState
    };

    signals.on('done', function () {
      $scope.$apply(function () {
        $scope.isPlaying = false;
      });
    });

    //
    // Controller actions for the playback mode.
    //

    $scope.startReplaying = function (recordingID) {
      if ($scope.isPlaying || !recordingID)
        return; // already playing
      // Set a default recording, if we do not already have one.
//      if (!$scope.recording)
//        $scope.recording = sampleRecording;
      // Start playback.
      var recording = ModelsManager.getRecord('tm_recordings', recordingID);
      if (!recording) {
         console.error('cannot find recording '+recordingID);
      }
      var recordingData = JSON.parse(recording.sData);
      player.start(recordingData, recorderOptions).then(function () {
        $scope.isPlaying = true;
        $scope.playingRecordingID = recordingID;
        $scope.isPaused = false;
      }, function (err) {
        console.log('playback failed to start:', err);
      });
    };
    $scope.stopReplaying = function () {
      if (!$scope.isPlaying)
        return; // already stopped
      player.stop().then(function () {
        $scope.isPaused = false;
        $scope.isPlaying = false;
      }, function (err) {
        console.log('playback failed to stop:', err);
      });
    };
    $scope.pauseReplaying = function () {
      if (!$scope.isPlaying)
        return;
      if ($scope.isPaused) {
        player.resume().then(function () {
          // tabsets.find('sources').focus();
          $scope.isPaused = false;
        }, function (err) {
          console.log('playback failed to resume:', err);
        });
      } else {
        player.pause().then(function () {
          $scope.isPaused = true;
          console.log('paused');
        }, function (err) {
          console.log('playback failed to pause', err);
        });
      }
    };

    $scope.deleteRecording = function (recordingID) {
       if ($scope.isPlaying && $scope.playingRecordingID == recordingID)
          return;
       ModelsManager.deleteRecord('tm_recordings', recordingID);
    };

    //
    // Controller actions for the recording mode.
    //

    $scope.startRecording = function () {
      if ($scope.isRecording)
        return; // already recording
      recorder.record(recorderOptions).then(function () {
        $scope.isRecording = true;
        tabsets.find('sources').focus();
      }, function (err) {
        console.log('recording failed to start:', err);
      });
    };

   function saveRecording(data) {
      var recording = ModelsManager.createRecord("tm_recordings");
      recording.sData = JSON.stringify(data);
      ModelsManager.insertRecord("tm_recordings", recording);

      // If present, upload the audio blob to transloadit.
      if (data.audioUrl) {
        $scope.audioUploadStatus = 'getting audio...';
        audio.getRecording(result.audioUrl).then(function (recording) {
          if (!recording) {
            $scope.audioUploadStatus = 'failed to get audio recording';
            return;
          }
          $scope.audioUploadStatus = 'uploading audio...';
          var transloadit = new TransloaditXhr({
            params: {
              auth: {key: config.transloadit.key},
              template_id: config.transloadit.template_id,
              steps: {}
            },
            signature: "",
            errorCb: audioUploadFailure,
            progressCb: audioUploadProgress,
            processCb: audioUploadProcess,
            successCb: audioUploadSuccess
          });
          transloadit.uploadFile(recording);
        });
        function audioUploadFailure (message) {
          $scope.$apply(function () {
            $scope.audioUploadStatus = "uploading audio failed: " + message;
          });
        }
        function audioUploadProgress (progress) {
          $scope.$apply(function () {
            $scope.audioUploadStatus = 'uploading audio... ' + Math.round(progress) + '%';
          });
        }
        function audioUploadProcess () {
          $scope.$apply(function () {
            $scope.audioUploadStatus = 'processing audio...';
          });
        }
        function audioUploadSuccess (result) {
          $scope.$apply(function () {
            $scope.audioUploadStatus = 'cleaning up...';
            // Update recording with the encoded file's URL.
            data.audioUrl = result.mp3[0].ssl_url;
            recording.sData = JSON.stringify(data);
            ModelsManager.updated("tm_recordings", recording.ID);
          });
          audio.clearRecordings().then(function () {
            $scope.$apply(function () {
              $scope.audioUploadStatus = false;
            });
          });
        }
      }
   };

    $scope.stopRecording = function () {
      recorder.stop().then(function (result) {
        $scope.isRecording = false;
        $scope.isPaused = false;
        saveRecording(result);
      }, function (err) {
        console.log('recording failed to stop:', err);
      });
    };

    $scope.pauseRecording = function () {
      if (!$scope.isRecording)
        return;
      if ($scope.isPaused) {
        // Start a new segment.
        recorder.resume().then(function () {
          $scope.isPaused = false;
          tabsets.find('sources').focus();
        }, function (err) {
          console.log('recording failed to resume:', err);
        });
      } else {
        recorder.pause().then(function () {
          $scope.isPaused = true;
        }, function (err) {
          console.log('recording failed to pause', err);
        });
      }
    };
}]);
