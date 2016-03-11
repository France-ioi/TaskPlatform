import 'bootstrap/css/bootstrap.min.css!';
import 'font-awesome/css/font-awesome.min.css!';

// import $ from 'jquery';
// import _ from 'lodash';
// import R from 'raphael';
import 'brace';
import 'brace/mode/c_cpp';
import 'brace/worker/javascript';
// import jschannel from 'jschannel';
// import lamejs from 'lamejs/lame.all.js';
import 'scottschiller/SoundManager2/soundmanager2-nodebug-jsmin';

import angular from 'angular';
import 'angular-bootstrap';
import 'angular-ui-ace';
import 'incuna/angular-bind-html-compile';

import 'France-ioi/pem-task/platform-pr';
import 'France-ioi/pem-task/miniPlatform';
import 'France-ioi/submission-manager';
import 'France-ioi/submission-manager/dst/submission-manager.min.css!';
import 'fioi-editor2';

import '../commonFramework/modelsManager/modelsManager';
import '../shared/models';
import '../commonFramework/sync/syncQueue';
import {Languages, TabsetConfig, taskController} from './taskController';
import {PEMApi} from './pem-api';
import {limitsController} from './limits/controller';
import {hintsController} from './hints/controller';
import {recordController} from './record/recordController';
import {showSourceDirective} from './showSource';

var app = angular.module('pemTask',
  [
    'ui.bootstrap',
    'submission-manager',
    'fioi-editor2',
    'ui.ace',
    'angular-bind-html-compile'
  ]);

app.service('PEMApi', PEMApi);
app.service('Languages', Languages);
app.service('TabsetConfig', TabsetConfig);
app.controller('taskController', taskController);
app.controller('limitsController', limitsController);
app.controller('hintsController', hintsController);
app.controller('recordController', recordController);
app.directive('showSource', showSourceDirective);

app.run(['TabsetConfig', function (TabsetConfig) {
   TabsetConfig.initialize();
}]);

angular.element(document).ready(function () {
  angular.bootstrap(document, ['pemTask'], {strictDi: true});
});
