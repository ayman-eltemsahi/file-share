const http = require("http");
const express = require("express");
const morgan = require('morgan');
const ip = require('ip');
const opn = require('opn');
const config = require('./config');
const bodyParser = require('body-parser');
const permission = require('./src/permission');

const app = new express();
const server = http.createServer(app);

// app.use(permission.allowFirstNUsers(3));
app.use(express.static(config.publicFolder));
app.use(morgan('dev'));
app.use(bodyParser.text({ type: 'text/plain' }))

// set CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const application = require('./src/app');

application.initialize(app, server);

server.listen(config.portNumber, () => {
    console.log(`Server listening ::: ${config.portNumber}`);
    console.log("ip = " + ip.address());

    opn(`http://${ip.address()}:${config.portNumber}`);
});
