(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('PanelController', ['$rootScope', '$scope', '$mdToast', 'Map', 'Entrega', 'Vendedor', 'Entregador', 'notification', function($rootScope, $scope, $mdToast, Map, Entrega, Vendedor, Entregador, notification) {
            var self = this;

            $rootScope.screen.title = "Septua Trading - Painel";

            self.screen = {
                dataCard: false
                , autocomplete: {
                    noCache: false
                }
            }

            self.entrega = {};

            self.searchAddress = searchAddress;
            self.originSelected = originSelected;
            self.destinationSelected = destinationSelected;
            self.viewEntrega = viewEntrega;
            self.hideCard = hideCard;
            // self.addEntrega = addEntrega;
            self.addVendedor = addVendedor;
            self.addEntregador = addEntregador;
            // self.addDelivery = addDelivery;

            Map.init();

            Vendedor.get().then(function(response) {
                self.vendedor = response.data.items[0];
                self.vendedor.geometry = {
                    location: {
                        lat: Number(self.vendedor.lat)
                        , lng: Number(self.vendedor.lng)
                    }
                }
                Map.addBuildingMarker(self.vendedor);
                getEntregas();
            });

            function getEntregas() {

                Entrega.get().then(function(response) {

                    for (var i = 0; i < response.data.items.length; i++) {
                        var record = response.data.items[i];

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

            function originSelected() {
                Map.addMarker(self.originAddress);
            }

            function destinationSelected() {
                // Map.addMarker(self.entrega.endAddress);
                Map.calcDistance(self.vendedor, self.entrega.endAddress, function(response, status) {
                    if (status == 'OK') {
                        var origins = response.originAddresses;
                        var destinations = response.destinationAddresses;

                        for (var i = 0; i < origins.length; i++) {
                            var results = response.rows[i].elements;
                            for (var j = 0; j < results.length; j++) {
                                var element = results[j];
                                var distance = element.distance.text;
                                var duration = element.duration.text;
                                // var from = origins[i];
                                // var to = destinations[j];

                                self.entrega.distancia = distance;
                                self.entrega.tempo = duration;
                            }
                        }
                        $scope.$apply();
                    }
                });
                // Map.traceRoute(self.vendedor, self.entrega.endAddress);
            }

            function viewEntrega() {
                self.screen.dataCard = true;
            }

            function hideCard() {
                self.screen.dataCard = false;
                self.entrega = null;
            }

            function addVendedor() {
                Vendedor.dialog();
            }

            function addEntregador() {
                Entregador.dialog();
            }

            // function getPosition() {
            //     navigator.geolocation.getCurrentPosition(function(location) {
            //         appendLocation(location, 'fetched');
            //     });
            //     // navigator.geolocation.watchPosition(appendLocation);
            // }
            //
            // function appendLocation(location, verb) {
            //
            //     var browserLocation = {
            //         geometry: {
            //             location: {
            //                 lat: location.coords.latitude
            //                 , lng: location.coords.longitude
            //             }
            //         }
            //     };
            //
            //     Map.addMarker(browserLocation);
            // }
        }]);
})();
