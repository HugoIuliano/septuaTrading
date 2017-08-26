(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .factory('Entregador', ['$http', '$mdDialog', '$mdMedia', function($http, $mdDialog, $mdMedia) {

            const url = '/_ah/api/entregadorendpoint/v1/entregador';

            function Entregador(nome, documento) {
                return {
                    "id" : getUUID()
                    , "nome" : nome
                    , "documento" : documento
                }
            }

            function uuid() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            function getUUID() {
                return (uuid() + uuid() + "-" + uuid() + "-4" + uuid().substr(0,3) + "-" + uuid() + "-" + uuid() + uuid() + uuid()).toLowerCase();
            }

            var service = {
                get: function(entregadorId) {
                    var id = (entregadorId != null) ? '/' + entregadorId : '';
                    return $http.get(url + id);
                }

                , post: function(nome, documento) {
                    var entregador = new Entregador(nome, documento);
                    return $http.post(url, entregador);
                }

                , dialog: function() {
                    $mdDialog.show({
                        controller: 'EntregadorCtrl'
                        , controllerAs: 'entregadorDialog'
                        , fullscreen: $mdMedia('xs')
                        , locals: {}
                        , template:
                            '<md-dialog aria-label="Entregador" flex-xs="100" flex-sm="80" flex-md="65" flex-lg="50" flex-gt-lg="45">' +
                                '<md-toolbar class="animate-show md-whiteframe-z2 md-hue-2">' +
                                    '<div class="md-toolbar-tools">' +
                                        '<md-button class="md-icon-button" aria-label="Voltar" ng-click="entregadorDialog.close()">' +
                                            '<i class="material-icons" title="Fechar">close</i>' +
                                        '</md-button>' +
                                        '<h3 flex>' +
                                            '<span>{{ entregadorDialog.screen.actionTitle }}</span>' +
                                        '</h3>' +
                                    '</div>' +
                                '</md-toolbar>' +
                                '<div style="margin-top: 10px;" layout="column" layout-padding>' +
                                    '<div layout="row" flex="100">' +
                                        '<md-input-container flex="65">'  +
                                            '<label>Nome</label>' +
                                            '<input ng-model="entregadorDialog.entregador.nome" type="text">' +
                                        '</md-input-container>' +
                                        '<md-input-container flex="35">'  +
                                            '<label>Documento</label>' +
                                            '<input ng-model="entregadorDialog.entregador.documento" type="text">' +
                                        '</md-input-container>' +
                                    '</div>' +
                                '</div>' +
                                '<md-dialog-actions>' +
                                    '<md-button arial-label="cancelar" ng-click="entregadorDialog.close()">cancelar</md-button>' +
                                    '<md-button arial-label="salvar" ng-click="entregadorDialog.add()" class="md-accent md-raised">salvar</md-button>' +
                                '</md-dialog-actions>' +
                            '</md-dialog>'
                    });
                }
            }

            return service;
        }])

        .controller('EntregadorCtrl', ['$mdDialog', 'Map', 'Entregador', 'notification', function($mdDialog, Map, Entregador, notification) {

            var self = this;

            self.screen = {
                actionTitle: "Entregador"
            }

            self.close = close;
            self.searchAddress = searchAddress;
            self.add = add;
            self.entregador = {};

            function close() {
                $mdDialog.hide();
            }

            function searchAddress(textSearch) {
                return Map.addressSearch(textSearch).then(function(response) {
                    return response.data.results;
                });
            }

            function add() {
                Entregador.post(self.entregador.nome, self.entregador.documento).then(function(response) {
                    if (response.status != 200) {
                        notification.showMessage("Ocorreu um erro, o entregador não foi salvo");
                        return;
                    }
                    notification.showMessage("Entregador salvo");
                    $mdDialog.hide();
                });
            }
        }]);
})();
