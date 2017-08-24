(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .service('Map', function($http, $q) {

            this.marker = [];

            this.init = function() {
                var options = {
                    center: new google.maps.LatLng(-23.5947479, -46.686047599999995),
                    zoom: 10,
                    disableDefaultUI: true
                }
                this.map = new google.maps.Map(document.getElementById("map"), options);
                // this.places = new google.maps.places.PlacesService(this.map);
            }

            this.placeSearch = function(str) {
                var d = $q.defer();
                this.places.textSearch({query: str}, function(results, status) {
                    if (status == 'OK') {
                        d.resolve(results[0]);
                    }
                    else d.reject(status);
                });
                return d.promise;
            }

            this.addressSearch = function(str) {
                var address = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + str + '&key=AIzaSyDYuEz4jGQLqNpI4n8Zt62P3qV2egjdrJU';
                return $http.get(address);
            }

            this.addMarker = function(res, icon) {
                // if (this.marker.len) {
                //     this.marker.setMap(null);
                // }
                var marker = new google.maps.Marker({
                    map: this.map,
                    position: res.geometry.location,
                    animation: google.maps.Animation.DROP,
                });

                this.marker.push(marker);
                this.map.setCenter(res.geometry.location);
            }

            this.addBuildingMarker = function(res) {
                if (this.buildingMarker) {
                    this.buildingMarker.setMap(null);
                }
                this.buildingMarker = new google.maps.Marker({
                    map: this.map,
                    position: res.geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: 'https://maps.google.com/mapfiles/kml/shapes/buildings.png'
                });
                this.map.setCenter(res.geometry.location);
            }

            this.calcDistance = function(origin, destination, viewCallback) {

                if (origin == null || destination == null) {
                    return;
                }

                var originMap = new google.maps.LatLng(origin.geometry.location.lat, origin.geometry.location.lng);
                var destinationMap = new google.maps.LatLng(destination.geometry.location.lat, destination.geometry.location.lng);

                var service = new google.maps.DistanceMatrixService();

                service.getDistanceMatrix({
                    origins: [originMap],
                    destinations: [destinationMap],
                    travelMode: 'DRIVING',
                    // transitOptions: TransitOptions, when travelMode is TRANSIT
                    // drivingOptions: DrivingOptions, // when travelMode is DRIVING (only premium mode)
                    // unitSystem: UnitSystem, // default is METRIC (IMPERIAL)
                    // avoidHighways: Boolean,
                    // avoidTolls: Boolean,
                }, viewCallback);
            }

            // this.traceRoute = function(origin, destination) {
            //     // var paramOrigin = origin.geometry.location.lat + ',' + origin.geometry.location.lng
            //     // var paramDestination = destination.geometry.location.lat + ',' + destination.geometry.location.lng
            //     // var address = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + paramOrigin +'&destination=' + paramDestination + '&key=AIzaSyDYuEz4jGQLqNpI4n8Zt62P3qV2egjdrJU';
            //     // return $http.get(address);
            //
            //     if (origin == null || destination == null) {
            //         return;
            //     }
            //
            //     var originMap = new google.maps.LatLng(origin.geometry.location.lat, origin.geometry.location.lng);
            //     var destinationMap = new google.maps.LatLng(destination.geometry.location.lat, destination.geometry.location.lng);
            //
            //     var directionsService = new google.maps.DirectionsService();
            //
            //     directionsService.route({
            //         origin: originMap,
            //         destination: destinationMap,
            //         travelMode: 'DRIVING'
            //     }, this.callbackRoute);
            // }

            // this.callbackRoute = function(response, status) {
            //     if (status != google.maps.DirectionsStatus.OK) {
            //         return;
            //     }
            //     this.directionsDisplay = new google.maps.DirectionsRenderer();
            //     this.directionsDisplay.setDirections(response);
            //     this.directionsDisplay.setMap(this.map);
            // }

            // function callback(response, status) {
            //     if (status == 'OK') {
            //         var origins = response.originAddresses;
            //         var destinations = response.destinationAddresses;
            //
            //         for (var i = 0; i < origins.length; i++) {
            //             var results = response.rows[i].elements;
            //             for (var j = 0; j < results.length; j++) {
            //                 var element = results[j];
            //                 var distance = element.distance.text;
            //                 var duration = element.duration.text;
            //                 var from = origins[i];
            //                 var to = destinations[j];
            //
            //                 console.log("element", element);
            //                 console.log("distance", distance);
            //                 console.log("duration", duration);
            //                 console.log("from", from);
            //                 console.log("to", to);
            //             }
            //         }
            //     }
            // }
        });
})();
