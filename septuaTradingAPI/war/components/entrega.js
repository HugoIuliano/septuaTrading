(function() {
    'use strict';

    angular.module('SeptuaTradingApp')
        .factory('Entrega', ['$http', function($http) {

            const url = '/_ah/api/entregaendpoint/v1/entrega';

            function Entrega(id, vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino, situacao) {
                return {
                    "id" : id
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
                    , "situacao" : situacao
                }
            }

            function uuid() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

            function getUUID() {
                return (uuid() + uuid() + "-" + uuid() + "-4" + uuid().substr(0,3) + "-" + uuid() + "-" + uuid() + uuid() + uuid()).toLowerCase();
            }

            var service = {

                get: function(entregaId) {
                    var id = (entregaId != null) ? '/' + entregaId : '';
                    return $http.get(url + id);
                }

                , post: function(vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino, situacao) {
                    var id = getUUID();
                    var entrega = new Entrega(id, vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino, situacao);
                    return $http.post(url, entrega);
                }

                , delivery: function(id, vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino, situacao) {
                    var entrega = new Entrega(id, vendedorId, vendedorNome, recebedorNome, recebedorDocumento, produto, distancia, tempo, preco, endereco, latDestino, lngDestino, situacao);
                    return $http.put(url, entrega);
                }
            }

            return service;
        }]);
})();
