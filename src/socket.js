const messages = require('./messages');
const WebSocketServer = require('websocket').server;

var clientId = 0;
var clients = [];
function initialize(server) {

    var wsServer = new WebSocketServer({ httpServer: server });
    wsServer.on('request', function (r) {
        var connection = r.accept();

        let id = clientId++;
        clients[id] = connection;
        let remoteAddress = connection.remoteAddress;
        let ipId = remoteAddress.split('.').reverse()[0];

        connection.on('message', function (message) {

            gotMessage(ipId + ' ' + message.utf8Data);
        });

        connection.on('close', function (reasonCode, description) {
            delete clients[id];
        });
    });
}


function gotMessage(msg) {
    if (!msg) return;

    messages.add(msg);

    clients.forEach(c => c.sendUTF(msg));
};

module.exports = {
    initialize
};
