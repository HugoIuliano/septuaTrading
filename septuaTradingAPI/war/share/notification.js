(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .factory('notification', ['$mdToast', function($mdToast) {
            var service = {
                showMessageError: function(message) {
                    $mdToast.show({
                        hideDelay       : false,
                        position        : 'top right',
                        controller      : 'GenericToastCtrl',
                        template        : '<md-toast><div class="md-toast-content"><md-icon class="pk-toaster-icon">error_outline</md-icon><span flex="">' + message + '</span><md-button class="md-highlight" ng-click="closeToast()">fechar</md-button></div></md-toast>',
                    });
                }

                , showMessageAlert: function(message) {
                    $mdToast.show({
                        hideDelay       : 3500,
                        position        : 'top right',
                        controller      : 'GenericToastCtrl',
                        template        : '<md-toast><div class="md-toast-content"><md-icon class="pk-toaster-icon">error_outline</md-icon><span flex="">' + message + '</span></div></md-toast>',
                    });
                }

                , showMessage: function(message) {
                    $mdToast.show({
                        hideDelay       : 3500,
                        position        : 'top right',
                        controller      : 'GenericToastCtrl',
                        template        : '<md-toast><div class="md-toast-content"><span flex="">' + message + '</span></div></md-toast>'
                    });
                }
            }
            return service;
        }])

        .controller('GenericToastCtrl', function($scope, $mdToast) {
            $scope.closeToast = function() {
                $mdToast.hide();
            }
        });
})();
