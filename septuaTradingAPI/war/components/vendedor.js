(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .factory('Vendedor', ['$http', '$mdDialog', '$mdMedia', function($http, $mdDialog, $mdMedia) {

            const url = '/_ah/api/vendedorendpoint/v1/vendedor';

            function Vendedor(nome, documento, endereco, latitude, longitude) {
                return {
                    "id": getUUID()
                    , "nome": nome
                    , "documento": documento
                    , "endereco": endereco
                    , "lat": latitude
                    , "lng": longitude
                }
            }

            function uuid() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            function getUUID() {
                return (uuid() + uuid() + "-" + uuid() + "-4" + uuid().substr(0,3) + "-" + uuid() + "-" + uuid() + uuid() + uuid()).toLowerCase();
            }

            var service = {
                get: function(vendedorId) {
                    var id = (vendedorId != null) ? '/' + vendedorId : '';
                    return $http.get(url + id);
                }

                , post: function(nome, documento, endereco, lat, lng) {
                    var vendedor = new Vendedor(nome, documento, endereco, lat, lng);
                    return $http.post(url, vendedor);
                }

                , dialog: function() {
                    $mdDialog.show({
                        controller: 'VendedorCtrl'
                        , controllerAs: 'vendedorDialog'
                        , fullscreen: $mdMedia('xs')
                        , locals: {}
                        , template:
                            '<md-dialog aria-label="Vendedor" flex-xs="100" flex-sm="80" flex-md="65" flex-lg="50" flex-gt-lg="45">' +
                                '<md-toolbar class="animate-show md-whiteframe-z2">' +
                                    '<div class="md-toolbar-tools">' +
                                        '<md-button class="md-icon-button" aria-label="Voltar" ng-click="vendedorDialog.close()">' +
                                            '<i class="material-icons" title="Voltar">close</i>' +
                                        '</md-button>' +
                                        '<h3 flex>' +
                                            '<span>{{ vendedorDialog.screen.actionTitle }}</span>' +
                                        '</h3>' +
                                    '</div>' +
                                '</md-toolbar>' +
                                '<div style="margin-top: 10px;" layout="column" layout-padding>' +
                                    '<div layout="row" flex="100">' +
                                        '<md-input-container flex="65">'  +
                                            '<label>Nome</label>' +
                                            '<input ng-model="vendedorDialog.vendedor.nome" type="text">' +
                                        '</md-input-container>' +
                                        '<md-input-container flex="35">'  +
                                            '<label>Documento</label>' +
                                            '<input ng-model="vendedorDialog.vendedor.documento" type="text">' +
                                        '</md-input-container>' +
                                    '</div>' +
                                    '<div layout="row" flex="100">' +
                                        '<md-autocomplete md-no-cache="false"' +
                                                         'md-selected-item="vendedorDialog.vendedor.address"' +
                                                         'md-search-text="vendedorDialog.searchText"' +
                                                         'md-items="item in vendedorDialog.searchAddress(vendedorDialog.searchText)"' +
                                                         'md-item-text="item.formatted_address"' +
                                                         'md-min-length="5"' +
                                                         'md-floating-label="Endereço"' +
                                                         'aria-label="Endereço"' +
                                                         'flex="100">' +
                                             '<md-item-template>' +
                                                 '<span md-highlight-text="index.searchText" md-highlight-flags="^i">{{ item.formatted_address }}</span>' +
                                             '</md-item-template>' +
                                             '<md-not-found>' +
                                                 'No address matching "{{ index.searchText }}" were found.' +
                                             '</md-not-found>' +
                                         '</md-autocomplete>' +
                                    '</div>' +
                                '</div>' +
                                '<md-dialog-actions>' +
                                    '<md-button arial-label="cancelar" ng-click="vendedorDialog.close()">cancelar</md-button>' +
                                    '<md-button arial-label="salvar" ng-click="vendedorDialog.add()" class="md-accent md-raised">salvar</md-button>' +
                                '</md-dialog-actions>' +
                            '</md-dialog>'
                    });
                }
            }

            return service;
        }])

        .controller('VendedorCtrl', ['$mdDialog', 'Map', 'Vendedor', 'notification', function($mdDialog, Map, Vendedor, notification) {

            var self = this;

            self.screen = {
                actionTitle: "Vendedor"
            }

            self.close = close;
            self.searchAddress = searchAddress;
            self.add = add;
            self.vendedor = {};

            function close() {
                $mdDialog.hide();
            }

            function searchAddress(textSearch) {
                return Map.addressSearch(textSearch).then(function(response) {
                    return response.data.results;
                });
            }

            function add() {
                Vendedor.post(self.vendedor.nome, self.vendedor.documento, self.vendedor.address.formatted_address, self.vendedor.address.geometry.location.lat, self.vendedor.address.geometry.location.lng).then(function(response) {
                    if (response.status != 200) {
                        notification.showMessage("Ocorreu um erro, o vendedor não foi salvo");
                        return;
                    }
                    notification.showMessage("Vendedor salvo");
                    $mdDialog.hide();
                });
            }
        }]);
})();
