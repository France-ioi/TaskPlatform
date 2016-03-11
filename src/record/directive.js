import controlsTemplate from './controls.html!text';
import encodingOptionsTemplate from './encodingOptions.html!text';

recorderControlsDirective.$inject = [];
export function recorderControlsDirective () {
  return {
    scope: {
      mode: '=mode'
    },
    restrict: 'E',
    template: controlsTemplate,
    controllerAs: 'ctrl',
    bindToController: true,
    controller: RecordController
  };
};

RecordController.$inject = ['$scope', '$rootScope', '$uibModal', 'TabsetConfig', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', 'FioiEditor2Player', 'FioiEditor2Audio', 'Languages', '$timeout'];
export function RecordController ($scope, $rootScope, $uibModal, TabsetConfig, tabsets, signals, recorder, player, audio, Languages, $timeout) {
    var ctrl = this;

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
        ctrl.isPlaying = false;
      });
    });

    //
    // Controller actions for the playback mode.
    //

    ctrl.startReplaying = function (recordingID) {
      if (ctrl.isPlaying || !recordingID)
        return; // already playing
      // Start playback.
      var recording = ModelsManager.getRecord('tm_recordings', recordingID);
      if (!recording) {
         console.error('cannot find recording '+recordingID);
      }
      var recordingData = JSON.parse(recording.sData);
      player.start(recordingData, recorderOptions).then(function () {
        ctrl.isPlaying = true;
        ctrl.playingRecordingID = recordingID;
        ctrl.isPaused = false;
      }, function (err) {
        console.log('playback failed to start:', err);
      });
    };

    ctrl.stopReplaying = function () {
      if (!ctrl.isPlaying)
        return; // already stopped
      player.stop().then(function () {
        ctrl.isPaused = false;
        ctrl.isPlaying = false;
      }, function (err) {
        console.log('playback failed to stop:', err);
      });
    };

    ctrl.pauseReplaying = function () {
      if (!ctrl.isPlaying)
        return;
      if (ctrl.isPaused) {
        player.resume().then(function () {
          // tabsets.find('sources').focus();
          ctrl.isPaused = false;
        }, function (err) {
          console.log('playback failed to resume:', err);
        });
      } else {
        player.pause().then(function () {
          ctrl.isPaused = true;
          console.log('paused');
        }, function (err) {
          console.log('playback failed to pause', err);
        });
      }
    };

    ctrl.deleteRecording = function (recordingID) {
       if (ctrl.isPlaying && ctrl.playingRecordingID === recordingID)
          return;
       ModelsManager.deleteRecord('tm_recordings', recordingID);
    };

    //
    // Controller actions for the recording mode.
    //

    ctrl.startRecording = function () {
      if (ctrl.isRecording)
        return; // already recording
      recorder.record(recorderOptions).then(function (result) {
        ctrl.isRecording = true;
        ctrl.sampleRate = result.sampleRate;
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

      // If present, upload the audio blob.
      if (data.audioUrls) {
        var modalInstance = $uibModal.open({
          template: encodingOptionsTemplate,
          controller: EncodingOptionsController,
          resolve: {
            options: function () {
              return {
                numChannels: 1,
                sampleRateDiv: 1,
                sampleSize: 2,
                sampleRate: ctrl.sampleRate,
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
      ctrl.audioUploadStatus = 'uploading audio...';
      var audioUploadFailure = function (message) {
        $scope.$apply(function () {
          ctrl.audioUploadStatus = "uploading audio failed: " + message;
        });
      };
      var audioUploadProgress = function (progress) {
        $scope.$apply(function () {
          ctrl.audioUploadStatus = 'uploading audio... ' + Math.round(progress) + '%';
        });
      };
      var audioUploadProcess = function () {
        $scope.$apply(function () {
          ctrl.audioUploadStatus = 'processing audio...';
        });
      };
      var audioUploadSuccess = function (result) {
        $scope.$apply(function () {
          ctrl.audioUploadStatus = false;
          // Update recording with the encoded file's URL.
          data.audioUrl = result.mp3[0].ssl_url;
          recording.sData = JSON.stringify(data);
          ModelsManager.updated("tm_recordings", recording.ID);
        });
      };
      /*
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
      */
    }

    ctrl.stopRecording = function () {
      recorder.stop().then(function (result) {
        ctrl.isRecording = false;
        ctrl.isPaused = false;
        saveRecording(result);
      }, function (err) {
        console.log('recording failed to stop:', err);
      });
    };

    ctrl.pauseRecording = function () {
      if (!ctrl.isRecording)
        return;
      if (ctrl.isPaused) {
        // Start a new segment.
        recorder.resume().then(function () {
          ctrl.isPaused = false;
          tabsets.find('sources').focus();
        }, function (err) {
          console.log('recording failed to resume:', err);
        });
      } else {
        recorder.pause().then(function () {
          ctrl.isPaused = true;
        }, function (err) {
          console.log('recording failed to pause', err);
        });
      }
    };
}

EncodingOptionsController.$inject = ['$scope', 'options', '$uibModalInstance'];
function EncodingOptionsController ($scope, options, $uibModalInstance) {
  angular.extend($scope, options);
  $scope.ok = function () {
    $uibModalInstance.close({
      numChannels: 1,
      sampleSize: $scope.sampleSize,
      sampleRate: $scope.sampleRate / $scope.sampleRateDiv
    });
  };
}
