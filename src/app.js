const pages = require('./pages');
const file = require('./serve-file');
const upload = require('./upload');
const socket = require('./socket');
const messages = require('./messages');

function initialize(app, server) {

    // serve the homepage and list of files in a folder
    pages.initialize(app);

    // serve the requested file
    file.initialize(app);

    // upload a file
    upload.initialize(app);

    // handle messaging
    messages.initialize(app);

    // the socket server
    socket.initialize(server);
}


module.exports = {
    initialize
};
