(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('IndexController', ['$rootScope', function($rootScope) {
            var self = this;

            $rootScope.screen = {
                title: "Septua Trading"
            }
        }]);
})();
