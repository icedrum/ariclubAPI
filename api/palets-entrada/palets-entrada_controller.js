"use strict";
const express = require('express');
const router = express.Router();
const paletsEntradaMysql = require('./palets-entrada_mysql');


router.get('/no-abocados', async (req, res, next) => {
    try {
        const respuesta = await paletsEntradaMysql.getPaletsNoAbocados();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/abocar-palet', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.crfid || data.linea == undefined) {
            return res.status(400).json('Error en el formato de la petición (crfid, linea)');
        }
        if (data.crfid.length < 18) {
            return res.status(400).json('La longitud del código es incorrecta');
        }
        const respuesta = await paletsEntradaMysql.postAbocarPalet(data.linea, data.crfid.substring(0,18));
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/lineas-confeccion', async (req, res, next) => {
    try {
        const respuesta = await paletsEntradaMysql.getLineasCofeccion();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});


router.post('/buscar', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.codigo) {
            return res.status(400).json('Error en el formato de la petición (codigo)');
        }
        if (data.codigo.length < 18) {
            return res.status(400).json('Lo longitud del código es incorrecta');
        }
        const respuesta = await paletsEntradaMysql.postBuscarUnPaletDeEntrada(data.codigo.substring(0,18));
        if (respuesta.length === 0) {
            return res.json(null);
        }
        res.json(respuesta[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;