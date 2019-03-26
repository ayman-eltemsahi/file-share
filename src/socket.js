const messages = require('./messages');
const WebSocketServer = require('websocket').server;

let clientId = 0;
let clients = [];
function initialize(server) {

    const wsServer = new WebSocketServer({ httpServer: server });
    wsServer.on('request', function (r) {
        const connection = r.accept();

        const id = clientId++;
        clients[id] = connection;
        const { remoteAddress } = connection
        const ipId = remoteAddress.split('.').reverse()[0];

        connection.on('message', (message) => {

            gotMessage(ipId + ' ' + message.utf8Data);
        });

        connection.on('close', (reasonCode, description) => {
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
