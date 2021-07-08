"use strict";
const Express = require('express');
var router = Express.Router();
const clubMySql = require('./club_mysql');
const CheckAuth = require('../../middleware/check-auth');


router.get('/listaclub',CheckAuth, (req, res, next) => {
    clubMySql.obtenerClubs (req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.get('/listaequipos',CheckAuth, (req, res, next) => {
    clubMySql.listaequipos (req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.get('/jugadoresequipo',CheckAuth, (req, res, next) => {
    clubMySql.jugadoresequipo (req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});
module.exports = router;