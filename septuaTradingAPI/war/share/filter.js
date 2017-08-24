(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .filter('money', function(format) {
            return function(value) {
                if (value == null) {
                    return null;
                }
                return format.money(value);
            }
        })

        .directive("stMoney", ["$filter", function($filter) {
            function link(scope, element, attrs) {

                element.bind("keyup", function(e) {

                    if (element.val() == "" || element.val() == null) {
                        return;
                    }

                    var value = element.val();
                    value = value.replace(/\D/g,'');
                    value = value.replace(/(\d{1,2})$/, ',$1');
                    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

                    element.val(value);
                });
            }

            return {
                restrict: "A"
                , link: link
            }
        }]);
})();
