(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .controller('IndexController', ['$scope', '$mdToast', 'Map', 'Entrega', 'Vendedor', 'notification', function($scope, $mdToast, Map, Entrega, Vendedor, notification) {
            var self = this;

            self.screen = {
                title: "Septua Trading"
                , dataCard: false
                , autocomplete: {
                    noCache: false
                }
            }

            self.entrega = {};

            self.searchAddress = searchAddress;
            self.originSelected = originSelected;
            self.destinationSelected = destinationSelected;
            self.viewEntrega = viewEntrega;
            self.addEntrega = addEntrega;
            self.addVendedor = addVendedor;

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
                    console.log("Entrega.get", response);

                    for (var i = 0; i < response.data.items.length; i++) {
                        var record = response.data.items[i];

                        Map.addMarker({
                            geometry: {
                                location: {
                                    lat: Number(record.lat)
                                    , lng: Number(record.lng)
                                }
                            }
                        });
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
                Map.addMarker(self.entrega.endAddress);
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
                self.screen.dataCard = !self.screen.dataCard;
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
                           , self.entrega.endAddress.geometry.location.lng).then(function(response) {

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

            function addVendedor() {
                Vendedor.dialog();
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
