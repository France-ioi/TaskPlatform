'use strict';

app.controller('recordController', ['$scope', 'FioiEditor2Tabsets', 'FioiEditor2Signals', 'FioiEditor2Recorder', '$rootScope', function($scope, tabsets, signals, recorder, $rootScope) {

  function configureTabsets (tabsets) {
    // Configure the tabsets, as some options are not saved as part of a
    // state dump.
    var sources = tabsets.find('sources').update({
      languages: sourceLanguages,
      defaultLanguage: 'cpp',
      titlePrefix: 'Code'
    });
    var tests = tabsets.find('tests').update({
      languages: testLanguages,
      defaultLanguage: 'text',
      titlePrefix: 'Test',
      buffersPerTab: 2
    });
  }

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
      // tabs, and buffers.  The recording refers to tabsets, tabs and
      // buffers using their record-time ids.  Fresh ids are used when a state
      // is reloaded, and the recorder keeps track of the relationship between
      // record-time and play-time ids.
      tabsets.load(state.tabsets);
      // The configuration of the tabsets is not stored in the saved state.
      configureTabsets(tabsets);
    }

    var recorderOptions = {
      dumpState: dumpState,
      loadState: loadState
    };

    var recordings = [];
    $scope.recordings = [];

    signals.on('done', function () {
      $scope.$apply(function () {
        $scope.isPlaying = false;
      });
    });

    //
    // Controller actions for the playback mode.
    //

    $scope.startReplaying = function () {
      if ($scope.isPlaying)
        return; // already playing
      // Set a default recording, if we do not already have one.
      if (!$scope.recording)
        $scope.recording = sampleRecording;
      // Start playback.
      player.start($scope.recording, recorderOptions).then(function () {
        $scope.isPlaying = true;
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

    $scope.stopRecording = function () {
      recorder.stop().then(function (result) {
        $scope.isRecording = false;
        $scope.isPaused = false;
        window.recording = result;
        $scope.recording = result;
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
