var app = angular.module('profile', ['ngSanitize', 'jm.i18next', 'ui.bootstrap']);

app.controller('profileController', ['$scope', '$uibModal', function($scope, $uibModal) {
    'use strict';

    $scope.loading = true;
    $scope.summary = null;

    var params = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p=a[i].split('=', 2);
            if (p.length == 1) {
                b[p[0]] = "";
            } else {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
            }
        }
        return b;
    })(window.location.search.substr(1).split('&'));


    function request(data, callback) {
        var p = Object.assign({}, params, data);
        $.ajax({
            type: 'POST',
            url: '/profile/account.php',
            data: p,
            timeout: 60000,
            success: function(res) {
                if(res.error) {
                    $scope.error = res.error;
                } else {
                    callback(res);
                }
            },
            error: function(request, status, err) {
                console.error(err)
            }
        });
    }


    request({ sAction: 'summary'}, function(res) {
        $scope.loading = false;
        $scope.summary = res;
        $scope.$apply();
    });


    $scope.exportUrl = function() {
        return '/profile/account.php' + window.location.search + '&sAction=export';
    }


    $scope.deleteAccount = function() {
        $uibModal.open({
            templateUrl: '/profile/deleteAccountConfirmation.html',
            controller: 'deleteAccountConfirmationController',
            resolve: {
                callback: function() {
                    return function() {
                        request({ sAction: 'delete'}, function(res) {
                            if(params.sReturnUrl) {
                                window.location.href = params.sReturnUrl;
                            }
                        });
                    }
                }
            },
            backdrop: 'static',
            keyboard: false
        });

    }

}]);



app.controller('deleteAccountConfirmationController', [
    '$scope', '$uibModalInstance', 'callback',
    function($scope, $uibModalInstance, callback) {

        $scope.checked = {
            cb1: false,
            cb2: false
        }


        $scope.close = function() {
            $uibModalInstance.dismiss('cancel');
        }


        $scope.confirm = function() {
            callback();
        }

    }
]);