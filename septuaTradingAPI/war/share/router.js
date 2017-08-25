(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
            $routeProvider
                .when("/", { templateUrl : "/components/panel/panel.html" })
                .when("/vendedor", { templateUrl : "/components/vendedor/vendedor.html" })
                .when("/entregador", { templateUrl : "/components/entregador/entregador.html" });
        }]);
})();
