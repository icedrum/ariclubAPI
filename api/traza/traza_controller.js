const express = require('express');
const router = express.Router();
const trazaMysql = require('./traza_mysql');

router.get('/lineas-confeccion', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getLineasConfeccion();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/bolsas-cabecera',  async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getBolsasCabecera();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/bolsas-detalle', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getBolsasDetalle();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/bolsas-detalle-agrupado', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getBolsasDetalleAgrupado();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/palets-abiertos', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getPaletsConfeccionAbiertos();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/palets-cerrados', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getPaletsConfeccionCerrados();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/palets-cerrados-noasignados', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getPaletsConfeccionCerradosNoAsignados();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/palets-cerrados-noservidos', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getPaletsConfeccionCerradosNoServidos();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/cerrar-confeccionado', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet) {
            return res.status(400).json('Error en el formato de la petición (numpalet)');
        }
        const respuesta = await trazaMysql.postCerrarPaletConfeccion(data.numpalet);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/cerrar-confeccionado-linea', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet || !data.linea) {
            return res.status(400).json('Error en el formato de la petición (numpalet, linea)');
        }
        const respuesta = await trazaMysql.postCerrarPaletConfeccionLinea(data.numpalet, data.linea);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/vaciar-linea', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.linea) {
            return res.status(400).json('Error en el formato de la petición (linea)');
        }
        const respuesta = await trazaMysql.postVaciarLineaConfeccion(data.linea);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/obtener-bolsas-variedad', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.linea) {
            return res.status(400).json('Error en el formato de la petición (linea)');
        }
        const respuesta = await trazaMysql.postObtenerBolsasVariedad(data.linea);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/vaciar-linea-variedad', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.linea || !data.codvarie) {
            return res.status(400).json('Error en el formato de la petición (linea, codvarie)');
        }
        const respuesta = await trazaMysql.postVaciarLineaConfeccionVariedad(data.linea, data.codvarie);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});



router.post('/palet-confeccionado', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet) {
            return res.status(400).json('Error en el formato de la petición (numpalet)');
        }
        if (data.numpalet.length < 7) {
            return res.status(400).json('Longitud del código incorrecta.');
        }
        const respuesta = await trazaMysql.postObtenerPaletConfeccionado(data.numpalet.substring(0, 7));
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/palet-confeccionado-resumen', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet) {
            return res.status(400).json('Error en el formato de la petición (numpalet)');
        }
        if (data.numpalet.length < 7) {
            return res.status(400).json('Longitud del código incorrecta.');
        }
        const respuesta = await trazaMysql.postObtenerPaletConfeccionadoResumen(data.numpalet.substring(0, 7));
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/palet-confeccionado-modificar', async (req, res, next) => {
    try {
        const data = req.body;
        console.log("data modificar", data, "numpalet", data.numpalet,
            "pesobruto", data.pesobruto, "pesoneto", data.pesoneto,
            "codlinconfe", data.codlinconfe,
            "fechaini", data.fechaini,
            "horaini", data.horaini);

        if (!data || !data.numpalet || !data.pesobruto || !data.pesoneto || !data.codlinconfe || !data.fechaini || !data.horaini) {
            return res.status(400).json('Error en el formato de la petición (numpalet, pesobruto, pesoneto, codlinconfe, fechaini, horaini)');
        }
        if (data.numpalet.length < 7) {
            return res.status(400).json('Longitud del código incorrecta.');
        }
        const respuesta = await trazaMysql.postPaletConfeccionadoModificar(data.numpalet, data);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/recuperar-palet', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.idpalet || !data.kilos) {
            return res.status(400).json('Error en el formato de la petición (idpalet)');
        }
        const respuesta = await trazaMysql.postRecuperarPaletDeLineaDeConfeccion(data.idpalet, data.kilos);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/resto-palet-abocado', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.idpalet || !data.linconfe) {
            return res.status(400).json('Error en el formato de la petición (idpalet, linconfe)');
        }
        const respuesta = await trazaMysql.postRestoPaletAbocado(data.idpalet, data.linconfe);
        if (!respuesta) {
            return res.status(404).json(`No se ha encontrado en bolsas el palet ${data.idpalet} de la linea ${data.linconfe}`);
        }
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/destrio-palet-abocado', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.idpalet || !data.linconfe) {
            return res.status(400).json('Error en el formato de la petición (idpalet, linconfe)');
        }
        const respuesta = await trazaMysql.postDestrioPaletAbocado(data.idpalet, data.linconfe);
        if (!respuesta) {
            return res.status(404).json(`No se ha encontrado en bolsas el palet ${data.idpalet} de la linea ${data.linconfe}`);
        }
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/pedidos-noservidos', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getPedidosNoServidos();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/asignar-palet-pedido', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet || !data.numpedid) {
            return res.status(400).json('Error en el formato de la petición (numpalet, numpedid)');
        }
        const respuesta = await trazaMysql.postAsignarPaletAPedido(data.numpalet, data.numpedid);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/desasignar-palet-pedido', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet) {
            return res.status(400).json('Error en el formato de la petición (numpalet, numpedid)');
        }
        const respuesta = await trazaMysql.postDesasignarPaletAPedido(data.numpalet);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.post('/palets-pedido', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpedid) {
            return res.status(400).json('Error en el formato de la petición (numpedid)');
        }
        const respuesta = await trazaMysql.postObtenerLosPaletsDeUnPedido(data.numpedid);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

router.get('/palets-traza', async (req, res, next) => {
    try {
        const respuesta = await trazaMysql.getTrazabilidadDePaletsConfeccionados();
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

// /reasignar-cajas

router.post('/reasignar-cajas', async (req, res, next) => {
    try {
        const data = req.body;
        if (!data || !data.numpalet_destino || !data.numpalet_origen || !data.numlinea || !data.numcajas) {
            return res.status(400).json('Error en el formato de la petición (numpalet_origen, numpalet_destino, numlinea, numcajas)');
        }
        const respuesta = await trazaMysql.postReasignarCajas(data.numpalet_destino, data.numpalet_origen, data.numlinea, data.numcajas);
        res.json(respuesta);
    } catch (error) {
        next(error);
    }
});

module.exports = router;