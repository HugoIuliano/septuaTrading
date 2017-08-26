(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('IndexController', ['$rootScope', function($rootScope) {
            var self = this;

            $rootScope.screen = {
                title: "Septua Trading"
            }
        }])

        .config(['$mdThemingProvider', function ($mdThemingProvider) {

            $mdThemingProvider.theme('default')
                // class="md-hue-2"
                .primaryPalette('grey', { 'default' : '500', 'hue-2' : '50' })
                .accentPalette('amber');
                // .primaryPalette('grey', { 'default' : '100', 'hue-1' : '100',  'hue-2' : '50' })
                // .backgroundPalette('grey', { 'default' : '50' })
                // .accentPalette('blue')
                // .warnPalette('red', { 'default': '300' });
        }]);
})();
