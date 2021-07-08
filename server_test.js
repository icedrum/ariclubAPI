"use strict";
const Dotenv = require('dotenv');
const App = require('./app');
const Winston = require('./winston');
const Pack = require('./package.json');

Dotenv.config();

var apiPort = process.env.TRZ2_PORT || 8088;

const server = App.listen(apiPort, () => {
    Winston.info("TEST:" + Pack.name + " VRS: " + Pack.version);
    Winston.info("Listening on port " + server.address().port + "...");
});

module.exports = server;