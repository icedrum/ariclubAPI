"use strict";
const Express = require('express');
var router = Express.Router();
const jugMysql = require('./jug_mysql');
const CheckAuth = require('../../middleware/check-auth');



router.get('/jugador',CheckAuth, (req, res, next) => {
    jugMysql.jugadoresequipo (req.body)
        .then(result => res.json(result))
        .catch(err => next(err));
});


router.post('/anyadejugador', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.crfid || data.linea == undefined) {
            return res.status(400).json('Error en el formato de la petición (crfid, linea)');
        }
        // mas comprobaciones
        //if (data.crfid.length < 18) {
        //    return res.status(400).json('La longitud del código es incorrecta');
        //}
        const respuesta = await jugMysql.postAnyadeUsuario (data);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});



module.exports = router;