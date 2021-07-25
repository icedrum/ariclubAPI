"use strict";
const Express = require('express');
var router = Express.Router();
const UsuariosMySql = require('./usuarios_mysql');
const CheckAuth = require('../../middleware/check-auth');
const { response } = require('express');
const { debug } = require('winston');
const request = require('request');


router.post('/login', (req, res, next) => {
    UsuariosMySql.loginUsuario(req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});

router.post('/login2', (req, res, next) => {
    UsuariosMySql.loginDavid(req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});


router.get('/renew', CheckAuth, (req, res=response,next) => {
    UsuariosMySql.renew(req)
    .then(result => res.json(result))
    .catch(err => next(err));
});

module.exports = router;