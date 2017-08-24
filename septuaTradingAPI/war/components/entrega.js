(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .factory('Entrega', ['$http', function($http) {

            const url = 'http://127.0.0.1:8888/_ah/api/entregaendpoint/v1/entrega';

            function Entrega(vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino) {
                return {
                    "id" : getUUID()
                    , "vendedorId": vendedorId
                    , "vendedorNome": vendedorNome
                    , "recebedorNome" : recebedorNome
                    , "recebedorDocumento": recebedorDocumento
                    , "produto": produto
                    , "distancia": distancia
                    , "tempo": tempo
                    , "preco": preco
                    , "endereco": endereco
                    , "lat": latDestino
                    , "lng": lngDestino
                }
            }

            function uuid() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            function getUUID() {
                return (uuid() + uuid() + "-" + uuid() + "-4" + uuid().substr(0,3) + "-" + uuid() + "-" + uuid() + uuid() + uuid()).toLowerCase();
            }

            var service = {

                get: function() {
                    return $http.get(url);
                }

                , post: function(vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino) {
                    var entrega = new Entrega(vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino);
                    return $http.post(url, entrega);
                }
            }

            return service;
        }]);
})();
