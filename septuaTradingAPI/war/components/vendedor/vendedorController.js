(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('VendedorController', ['$rootScope', '$scope', '$mdToast', 'Map', 'Entrega', 'Vendedor', 'Entregador', 'notification', function($rootScope, $scope, $mdToast, Map, Entrega, Vendedor, Entregador, notification) {

            var self = this;

            $rootScope.screen.title = "Vendedor";

            self.screen = {
                dataCard: false
                , autocomplete: {
                    noCache: false
                }
            }

            self.entrega = {};

            self.selectVendedor = selectVendedor;
            self.searchAddress = searchAddress;
            self.destinationSelected = destinationSelected;
            self.viewEntrega = viewEntrega;
            self.hideEntrega = hideEntrega;
            self.addEntrega = addEntrega;

            self.map = Map.init(document.getElementById('mapVendedor'));

            getVendedores().then(function(response) {
                if (response == null) {
                    return;
                }
                setVendedor(response[0]);
            });

            function getVendedores() {
                return Vendedor.get().then(function(response) {
                    if (response.data.items == null) {
                        return;
                    }
                    return response.data.items;
                });
            }

            function getEntregas() {

                Entrega.get().then(function(response) {

                    if (response.data.items == null) {
                        return;
                    }

                    Map.cleanMarkers();

                    for (var i = 0; i < response.data.items.length; i++) {
                        var record = response.data.items[i];

                        if (self.vendedor.id != record.vendedorId) {
                            continue;
                        }

                        var contentString =
                        '<div style="display: flex; align-items: start; flex-flow: column;">' +
                            '<div style="margin: 10px 0;"><b>' + record.recebedorNome + '</b></div>' +
                            '<div style="margin: 7px 0;"> Frete: R$ ' + record.preco + ' &bull; Produto: ' + record.produto + '</div>' +
                            '<div style="margin: 7px 0;">' + record.endereco + '</div>' +
                        '</div>';

                        var object = { geometry: { location: { lat: Number(record.lat), lng: Number(record.lng) }}};

                        Map.addMarker(self.map, object, contentString, record, function(marker) {
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

            function selectVendedor() {
                Vendedor.selectDialog(function(vendedor) {
                    setVendedor(vendedor);
                });
            }

            function setVendedor(vendedor) {
                self.vendedor = vendedor;
                self.vendedor.geometry = {
                    location: {
                        lat: Number(self.vendedor.lat)
                        , lng: Number(self.vendedor.lng)
                    }
                }
                Map.addBuildingMarker(self.map, self.vendedor, true);
                getEntregas();
            }

            function searchAddress(textSearch) {
                return Map.addressSearch(textSearch).then(function(response) {
                    return response.data.results;
                });
            }

            function destinationSelected() {

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

            function hideEntrega() {
                self.screen.dataCard = false;
                self.entrega = {};
            }

            function addEntrega() {

                Entrega.post(self.vendedor.id
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
                           , 'AGUARDANDO').then(function(response) {

                    if (response.status != 200) {
                        notification.showMessageError("Ocorreu um problema ao salvar a entrega");
                        return;
                    }

                    notification.showMessage("Entrega salva");
                    self.screen.dataCard = false;
                    self.entrega = {};
                    getEntregas();
                });
            }




        }]);
})();
