(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('EntregadorController', ['$rootScope', '$scope', '$mdToast', 'Map', 'Entrega', 'Vendedor', 'Entregador', 'notification', function($rootScope, $scope, $mdToast, Map, Entrega, Vendedor, Entregador, notification) {

            var self = this;

            $rootScope.screen.title = "Septua Trading - Entregador";

            self.screen = {
                dataCard: false
                , autocomplete: {
                    noCache: false
                }
            }

            self.vendedor = {};
            self.entrega = {};
            self.myPosition = {};

            self.hideDelivery = hideDelivery;
            self.addDelivery = addDelivery;
            self.getPosition = getPosition;

            Map.init();
            getPosition();
            getVendedores();

            function getPosition() {
                navigator.geolocation.getCurrentPosition(function(location) {
                    appendLocation(location, 'fetched');
                });
                // navigator.geolocation.watchPosition(appendLocation);
            }

            function appendLocation(location, verb) {

                self.myPosition = {
                    geometry: {
                        location: {
                            lat: location.coords.latitude
                            , lng: location.coords.longitude
                        }
                    }
                };

                Map.addDeliveryMarker(self.myPosition, true);
            }

            function getVendedores() {
                Vendedor.get().then(function(response) {

                    for (var i = 0; i < response.data.items.length; i++) {
                        var record = response.data.items[i];

                        var contentString =
                        '<div style="display: flex; align-items: start; flex-flow: column;">' +
                            '<div style="margin: 10px 0;"><b>' + record.nome + '</b></div>' +
                            '<div style="margin: 7px 0;">' + record.endereco + '</div>' +
                        '</div>';

                        var object = { geometry: { location: { lat: Number(record.lat), lng: Number(record.lng) }}};

                        Map.addBuildingMarker(object, false, contentString, record, function(marker) {
                            getEntregas(marker.empresa.id);
                            self.vendedor = marker.empresa;
                        });
                    }
                });
            }

            function getEntregas(vendedorId) {

                Entrega.get().then(function(response) {

                    for (var i = 0; i < response.data.items.length; i++) {
                        var record = response.data.items[i];

                        if (i == 0) {
                            Map.cleanMarkers();
                        }

                        if (vendedorId != record.vendedorId) {
                            continue;
                        }

                        var contentString =
                        '<div style="display: flex; align-items: start; flex-flow: column;">' +
                            '<div style="margin: 10px 0;"><b>' + record.recebedorNome + '</b></div>' +
                            '<div style="margin: 7px 0;"> Frete: R$ ' + record.preco + ' &bull; Produto: ' + record.produto + '</div>' +
                            '<div style="margin: 7px 0;">' + record.endereco + '</div>' +
                        '</div>';

                        var object = { geometry: { location: { lat: Number(record.lat), lng: Number(record.lng) }}};
                        Map.addMarker(object, contentString, record, function(marker) {
                            fullEntrega(marker.entrega.id);
                        });
                    }
                });
            }

            function fullEntrega(entregaId) {
                Entrega.get(entregaId).then(function(response) {
                    self.screen.dataCard = true;
                    self.entrega = response.data;
                    self.entrega.nome = response.data.recebedorNome;
                    self.entrega.documento = response.data.recebedorDocumento;
                    self.entrega.endAddress = {
                        formatted_address: response.data.endereco
                        , geometry: {
                            location: {
                                lat: Number(response.data.lat)
                                , lng: Number(response.data.lng)
                            }
                        }
                    }
                });
            }

            function searchAddress(textSearch) {
                return Map.addressSearch(textSearch).then(function(response) {
                    return response.data.results;
                });
            }

            function hideDelivery() {
                self.screen.dataCard = false;
                self.entrega = {};
            }

            function addDelivery() {

                Entrega.delivery(self.entrega.id
                               , self.vendedor.id
                               , self.vendedor.nome
                               , self.entrega.nome
                               , self.entrega.documento
                               , self.entrega.produto
                               , self.entrega.distancia
                               , self.entrega.tempo
                               , self.entrega.preco
                               , self.entrega.endAddress.formatted_address
                               , self.entrega.endAddress.geometry.location.lat
                               , self.entrega.endAddress.geometry.location.lng
                               , 'EM_COLETA').then(function(response) {

                    if (response == null || response.status != 200) {
                        return;
                    }

                    notification.showMessage("Entrega aguardando coleta");
                    window.open('https://www.google.com/maps/dir/' + self.myPosition.geometry.location.lat + ',' + self.myPosition.geometry.location.lng + '/' + self.vendedor.lat + ',' + self.vendedor.lng + '/' + self.entrega.endAddress.geometry.location.lat + ',' + self.entrega.endAddress.geometry.location.lng);
                    self.screen.dataCard = false;
                    self.entrega = {};
                    getEntregas(self.vendedor.id);
                });
            }
        }]);
})();
