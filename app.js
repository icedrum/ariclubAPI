"use strict";
const Express = require('express');
const Cors = require('cors');
const Morgan = require('morgan');
const Winston = require('./winston');
const BodyParser = require("body-parser");
const ServeIndex = require('serve-index');
const path = require('path');


const app = Express();

if (process.env.NODE_ENV != "TEST") app.use(Morgan('combined', { stream: Winston.stream }));
app.use(Cors());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());

// Servidor de ficheros estáticos
app.use(Express.static(__dirname + '/www'));
app.use('/ficheros', Express.static(__dirname + '/ficheros'), ServeIndex(__dirname + '/ficheros', { 'icons': true, 'view': 'details' }));

app.use('/version', require('./api/version/version_controller'));
app.use('/test', require('./api/test/test_controller'));
app.use('/usuarios', require('./api/usuarios/usuarios_controller'));
/*
app.use('/correo', require('./api/correo/correo_controller'));
app.use('/palets-entrada', require('./api/palets-entrada/palets-entrada_controller'));
app.use('/traza', require('./api/traza/traza_controller'));
*/
app.use('/club', require('./api/club/club_controller'));


app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'www', 'index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    });
  });

app.use((req, res, next) => {
    const error = new Error("No se ha encontrado punto de entrada");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV != "TEST") Winston.error(error);
    //Winston.error(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app;
