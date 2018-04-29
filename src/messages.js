const util = require('../util');

var messages = [];

function add(msg) {
    messages.unshift(msg);
}

function get() {
    return util.formatMessages(messages);
}

function initialize(app) {

    app.get('/message', function (req, res) {
        res.end(`<div style='background-color:#eee'>${get()}</div>`);
    });
}

module.exports = {
    initialize,
    add,
    get
}