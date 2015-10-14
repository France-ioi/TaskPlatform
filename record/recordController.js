app.controller('recordController', ['$scope', '$rootScope', '$uibModal', 'TabsetConfig', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'FioiEditor2Player', 'FioiEditor2Audio', 'Languages', '$timeout', function($scope, $rootScope, $uibModal, TabsetConfig, tabsets, signals, recorder, player, audio, Languages, $timeout) {
    'use strict';
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
      recorder.record(recorderOptions).then(function (result) {
        $scope.isRecording = true;
        $scope.sampleRate = result.sampleRate;
        tabsets.find('sources').focus();
      }, function (err) {
        console.log('recording failed to start:', err);
      });
    };

    function saveRecording(data) {
      var recording = ModelsManager.createRecord("tm_recordings");
      // Avoid saving the local audio URLs.
      var sData = angular.extend({}, data);
      delete sData.audioUrls;
      recording.sData = JSON.stringify(sData);
      ModelsManager.insertRecord("tm_recordings", recording);

      // If present, upload the audio blob to transloadit.
      if (data.audioUrls) {
        var modalInstance = $uibModal.open({
          templateUrl: 'record/encodingOptions.html',
          controller: 'EncodingOptionsController',
          resolve: {
            options: function () {
              return {
                numChannels: 1,
                sampleRateDiv: 1,
                sampleSize: 2,
                sampleRate: $scope.sampleRate,
                duration: data.duration
              };
            }
          }
        });
        modalInstance.result.then(function (encodingOptions) {
          recorder.finalize(data, encodingOptions).then(uploadAudio.bind(null, recording), function (err) {
            console.log('recording failed to be finalized:', err);
          });
        });
      }
    }

    function uploadAudio(recording, data) {
      $scope.audioUploadStatus = 'uploading audio...';
      var audioUploadFailure = function (message) {
        $scope.$apply(function () {
          $scope.audioUploadStatus = "uploading audio failed: " + message;
        });
      };
      var audioUploadProgress = function (progress) {
        $scope.$apply(function () {
          $scope.audioUploadStatus = 'uploading audio... ' + Math.round(progress) + '%';
        });
      };
      var audioUploadProcess = function () {
        $scope.$apply(function () {
          $scope.audioUploadStatus = 'processing audio...';
        });
      };
      var audioUploadSuccess = function (result) {
        $scope.$apply(function () {
          $scope.audioUploadStatus = false;
          // Update recording with the encoded file's URL.
          data.audioUrl = result.mp3[0].ssl_url;
          recording.sData = JSON.stringify(data);
          ModelsManager.updated("tm_recordings", recording.ID);
        });
      };
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
      transloadit.uploadFile(data.audioBlob);
    }

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

app.controller('EncodingOptionsController', ['$scope', 'options', '$modalInstance', function ($scope, options, $modalInstance) {
  angular.extend($scope, options);
  $scope.ok = function () {
    $modalInstance.close({
      numChannels: 1,
      sampleSize: $scope.sampleSize,
      sampleRate: $scope.sampleRate / $scope.sampleRateDiv
    });
  };
}]);
