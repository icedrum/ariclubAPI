const mysql2 = require('mysql2/promise');
const confMysql = require('../../connectors/config_mysql');
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();


const TrazaMysql = {
    getLineasConfeccion: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT * FROM trzlineas_confeccion `;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getBolsasCabecera: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT
                tlc.codlinconfe, tlc.nombre,
                tbc.codvarie, v.nomvarie, 
                sum(tbc.numcajones) as numcajones,
                sum(tbc.numkilos) as numkilos,
                concat(tlc.codlinconfe, '-', v.codvarie) as referencia
                FROM trzlineas_confeccion as tlc
                left join trz2_bolsas_confeccion as tbc on tbc.linea = tlc.codlinconfe
                left join variedades as v on v.codvarie = tbc.codvarie
                group by 1,3`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getBolsasDetalle: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT
                tlc.codlinconfe, tlc.nombre,
                tbc.codvarie, v.nomvarie,
                CONCAT(tlc.codlinconfe, '-', v.codvarie) AS referencia,
                tbc.idpalet, tbc.fecha AS fecha_entrada, tlcc.fecha AS fecha_abocamiento,
                tbc.numkilos, tbc.numcajones, tbc.codcampo,
                tbc.codsocio, s.nomsocio
                FROM trzlineas_confeccion AS tlc
                LEFT JOIN trz2_bolsas_confeccion AS tbc ON tbc.linea = tlc.codlinconfe
                LEFT JOIN trzlineas_cargas AS tlcc ON tlcc.idpalet = tbc.idpalet
                LEFT JOIN variedades AS v ON v.codvarie = tbc.codvarie
                LEFT JOIN rsocios AS s ON s.codsocio = tbc.codsocio`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getBolsasDetalleAgrupado: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT
                tlc.codlinconfe, tlc.nombre,
                tbc.codvarie, v.nomvarie,
                CONCAT(tlc.codlinconfe, '-', v.codvarie) AS referencia,
                tbc.idpalet, tbc.fecha AS fecha_entrada, tlcc.fecha AS fecha_abocamiento,
                tbc.numkilos, tbc.numcajones, tbc.codcampo,
                tbc.codsocio, s.nomsocio
                FROM trzlineas_confeccion AS tlc
                LEFT JOIN trz2_bolsas_confeccion AS tbc ON tbc.linea = tlc.codlinconfe
                LEFT JOIN trzlineas_cargas AS tlcc ON tlcc.idpalet = tbc.idpalet
                LEFT JOIN variedades AS v ON v.codvarie = tbc.codvarie
                LEFT JOIN rsocios AS s ON s.codsocio = tbc.codsocio
                ORDER BY tlc.codlinconfe, tbc.codvarie`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                const regs = TrazaMysql.crearJerarquiaInformacionBolsas(lineas);
                resolve(regs);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getPaletsConfeccionAbiertos: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `select
                p.linconfe, p.numpalet, pv.codvarie, v.nomvarie, 
                p.horaini, p.horafin,
                sum(pv.pesobrut) as pesobruto, sum(pv.pesoneto) as pesoneto, sum(pv.numcajas) as numcajas
                from palets as p
                left join palets_variedad as pv on pv.numpalet = p.numpalet
                LEFT join variedades as v on v.codvarie = pv.codvarie
                where p.cerrado = 0
                group by 1,2`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getPaletsConfeccionCerrados: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `select
                p.linconfe, p.numpalet, pv.codvarie, v.nomvarie, 
                p.horaini, p.horafin,
                sum(pv.pesobrut) as pesobruto, sum(pv.pesoneto) as pesoneto, sum(pv.numcajas) as numcajas
                from palets as p
                left join palets_variedad as pv on pv.numpalet = p.numpalet
                LEFT join variedades as v on v.codvarie = pv.codvarie
                where p.cerrado = 1
                group by 1,2`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getPaletsConfeccionCerradosNoAsignados: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `select
                p.linconfe, p.numpalet, pv.codvarie, v.nomvarie, 
                p.horaini, p.horafin,
                sum(pv.pesobrut) as pesobruto, sum(pv.pesoneto) as pesoneto, sum(pv.numcajas) as numcajas,
                ped.numpedid
                from palets as p
                left join palets_variedad as pv on pv.numpalet = p.numpalet
                left join variedades as v on v.codvarie = pv.codvarie
                left join pedidos as ped on ped.numpedid = p.numpedid
                where p.cerrado = 1 and ped.numpedid is null
                group by 1,2`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    getPaletsConfeccionCerradosNoServidos: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `select
                p.linconfe, p.numpalet, pv.codvarie, v.nomvarie, 
                p.horaini, p.horafin,
                sum(pv.pesobrut) as pesobruto, sum(pv.pesoneto) as pesoneto, sum(pv.numcajas) as numcajas,
                ped.numpedid
                from palets as p
                left join palets_variedad as pv on pv.numpalet = p.numpalet
                left join variedades as v on v.codvarie = pv.codvarie
                left join pedidos as ped on ped.numpedid = p.numpedid
                where p.cerrado = 1 and not ped.numpedid is null and ped.numalbar is null
                group by 1,2`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    postCerrarPaletConfeccion: (numpalet) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                conn.query('START TRANSACTION');
                let sql = `SELECT p.numpalet, pv.codvarie, SUM(pv.pesoneto) AS peso, p.cerrado, p.linconfe
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                WHERE p.numpalet = ${numpalet}
                GROUP BY 2`;
                const [lineas] = await conn.query(sql);
                for (i = 0; i < lineas.length; i++) {
                    const linea = lineas[i];
                    if (linea.cerrado) {
                        let err = new Error('El palet ya está cerrado');
                        err.status = 404;
                        return reject(err);
                    }
                    // Control de que en la bolsa hay suficientes kilos
                    sql = `select 
                    sum(numkilos) as kilos 
                    from trz2_bolsas_confeccion as b
                    where b.linea = ${linea.linconfe} and b.codvarie = ${linea.codvarie}
                    group by b.codvarie`;
                    let kilos = 0;
                    const [bolsas] = await conn.query(sql);
                    if (bolsas.length > 0) {
                        kilos = bolsas[0].kilos;
                    }
                    if (+linea.peso > +kilos) {
                        let err = new Error('No hay suficientes kilos para asignar');
                        err.status = 409;
                        return reject(err);
                    }
                    await TrazaMysql.buscarYProcesarEnLaBolsaPaletsCandidatos(linea, conn);
                }
                sql = `UPDATE palets SET cerrado = 1, 
                fechafin='${moment().format('YYYY-MM-DD')}',
                horafin='${moment().format('YYYY-MM-DD HH:mm:ss')}'
                WHERE numpalet = ${numpalet}`;
                await conn.query(sql);
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postCerrarPaletConfeccionLinea: (numpalet, linea) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                // Lo primero es asignarle la linea que nos han dicho al palet confeccionado.
                let sql = `UPDATE palets SET linconfe = ${linea}, codlinconf = ${linea} WHERE numpalet = ${numpalet}`;
                await conn.query(sql);
                sql = `SELECT p.numpalet, pv.codvarie, SUM(pv.pesoneto) AS peso, p.cerrado, p.linconfe
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                WHERE p.numpalet = ${numpalet}
                GROUP BY 2`;
                const [lineas] = await conn.query(sql);
                for (i = 0; i < lineas.length; i++) {
                    const linea = lineas[i];
                    if (linea.cerrado) {
                        let err = new Error('El palet ya está cerrado');
                        err.status = 409;
                        await conn.query('ROLLBACK');
                        await conn.end();
                        return reject(err);
                    }
                    // Control de que en la bolsa hay suficientes kilos
                    sql = `select 
                    sum(numkilos) as kilos 
                    from trz2_bolsas_confeccion as b
                    where b.linea = ${linea.linconfe} and b.codvarie = ${linea.codvarie}
                    group by b.codvarie`;
                    let kilos = 0;
                    const [bolsas] = await conn.query(sql);
                    if (bolsas.length > 0) {
                        kilos = bolsas[0].kilos;
                    }
                    if (+linea.peso > +kilos) {
                        let err = new Error('No hay suficientes kilos para asignar');
                        err.status = 409;
                        await conn.query('ROLLBACK');
                        await conn.end();
                        return reject(err);
                    }
                    await TrazaMysql.buscarYProcesarEnLaBolsaPaletsCandidatos(linea, conn);
                }
                sql = `UPDATE palets SET cerrado = 1, 
                fechafin='${moment().format('YYYY-MM-DD')}',
                horafin='${moment().format('YYYY-MM-DD HH:mm:ss')}'
                WHERE numpalet = ${numpalet}`;
                await conn.query(sql);
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    buscarYProcesarEnLaBolsaPaletsCandidatos: (linea, conn) => {
        return new Promise(async (resolve, reject) => {
            try {
                let peso = linea.peso;
                let sql = `SELECT * 
                FROM trz2_bolsas_confeccion
                WHERE codvarie = ${linea.codvarie}
                ORDER BY fecha`;
                const [candidatos] = await conn.query(sql);
                for (i = 0; i < candidatos.length; i++) {
                    // Procesamiento individual del candidato
                    const candidato = candidatos[i];
                    peso = peso - candidato.numkilos;
                    if (peso >= 0) {
                        // Ha cogido todos los kilos del candidato y lo eliminamos
                        sql = `DELETE FROM trz2_bolsas_confeccion WHERE bolsaConfeccionId = ${candidato.bolsaConfeccionId}`;
                        await conn.query(sql);
                        // Creamos el palet ligado
                        const ligado = {
                            numpalet: linea.numpalet,
                            idpalet: candidato.idpalet,
                            kilos: candidato.numkilos,
                            codsocio: candidato.codsocio,
                            codcampo: candidato.codcampo
                        }
                        sql = `INSERT INTO trz2_palets_traza SET ?`;
                        await conn.query(sql, ligado);
                        // Por último actualizamos el palet entrado
                        sql = `UPDATE trzpalets set estado = 2 WHERE idpalet = ${candidato.idpalet}`;
                        await conn.query(sql);
                        if (peso === 0) break;
                    } else {
                        // El exceso de kilos son los que el de la bolsa de queda
                        const kilos = peso * -1;
                        // Y la diferencia entre los que le quedan y los que tenía son
                        // los que ha puesto en la asociación
                        const k2 = candidato.numkilos - kilos;
                        // Creamos el palet ligado
                        const ligado = {
                            numpalet: linea.numpalet,
                            idpalet: candidato.idpalet,
                            kilos: k2,
                            codsocio: candidato.codsocio,
                            codcampo: candidato.codcampo
                        }
                        sql = `INSERT INTO trz2_palets_traza SET ?`;
                        await conn.query(sql, ligado);
                        // Y actualizamos la bolsa con los kilos restantes
                        sql = `UPDATE trz2_bolsas_confeccion SET numkilos = ${kilos} WHERE bolsaConfeccionId = ${candidato.bolsaConfeccionId}`;
                        await conn.query(sql);
                        // Siempre nos vamos
                        break;
                    }
                }
                resolve('OK')
            } catch (error) {
                reject(error);
            }
        })
    },
    postVaciarLineaConfeccion: (linea) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                conn.query('START TRANSACTION');
                let sql = `SELECT * 
                FROM trz2_bolsas_confeccion
                WHERE linea = ${linea}`;
                const [bolsas] = await conn.query(sql);
                for (i = 0; i < bolsas.length; i++) {
                    const bolsa = bolsas[i];
                    // Dar de alta en destrio
                    const destrio = {
                        linea,
                        idpalet: bolsa.idpalet,
                        tipo: bolsa.tipo,
                        fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
                        numkilos: bolsa.numkilos,
                        codvarie: bolsa.codvarie,
                        codsocio: bolsa.codsocio,
                        codcampo: bolsa.codcampo
                    };
                    await conn.query('INSERT INTO trz2_destrios SET ?', destrio);
                    // Eliminar de la línea de confección
                    await conn.query(`DELETE FROM trz2_bolsas_confeccion WHERE bolsaConfeccionId = ${bolsa.bolsaConfeccionId}`);
                    // Marcar el palet de entrada como procesado (estado = 2)ç
                    sql = `UPDATE trzpalets SET estado = 2 WHERE idpalet = ${bolsa.idpalet} AND tipo = ${bolsa.tipo}`;
                    await conn.query(sql);
                }
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postVaciarLineaConfeccionVariedad: (linea, codvarie) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                conn.query('START TRANSACTION');
                let sql = `SELECT * 
                FROM trz2_bolsas_confeccion
                WHERE linea = ${linea} AND codvarie=${codvarie}`;
                const [bolsas] = await conn.query(sql);
                for (i = 0; i < bolsas.length; i++) {
                    const bolsa = bolsas[i];
                    // Dar de alta en destrio
                    const destrio = {
                        linea,
                        idpalet: bolsa.idpalet,
                        tipo: bolsa.tipo,
                        fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
                        numkilos: bolsa.numkilos,
                        codvarie: bolsa.codvarie,
                        codsocio: bolsa.codsocio,
                        codcampo: bolsa.codcampo
                    };
                    await conn.query('INSERT INTO trz2_destrios SET ?', destrio);
                    // Eliminar de la línea de confección
                    await conn.query(`DELETE FROM trz2_bolsas_confeccion WHERE bolsaConfeccionId = ${bolsa.bolsaConfeccionId}`);
                    // Marcar el palet de entrada como procesado (estado = 2)ç
                    sql = `UPDATE trzpalets SET estado = 2 WHERE idpalet = ${bolsa.idpalet} AND tipo = ${bolsa.tipo}`;
                    await conn.query(sql);
                }
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postObtenerPaletConfeccionado: (numpalet) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                const respuesta = {};
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT * FROM palets WHERE numpalet = ${numpalet}`;
                const [palets] = await conn.query(sql);
                if (palets.length === 0) {
                    return resolve({ palet: null });
                }
                respuesta.palet = palets[0];
                sql = `SELECT
                pv.*,
                v.nomvarie, f.nomconfe
                FROM palets_variedad AS pv
                LEFT JOIN variedades AS v ON v.codvarie = pv.codvarie
                LEFT JOIN forfaits AS f ON f.codforfait = pv.codforfait
                WHERE pv.numpalet = ${numpalet}`
                const [lineas] = await conn.query(sql);
                respuesta.lineas = lineas;
                await conn.end();
                resolve(respuesta);
            } catch (error) {
                if (conn) {
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postObtenerPaletConfeccionadoResumen: (numpalet) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                let respuesta = undefined;
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                p.*, COALESCE(SUM(pv.pesobrut), 0) AS pesobruto, COALESCE(SUM(pv.pesoneto), 0) AS pesoneto
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                WHERE p.numpalet = ${numpalet}
                GROUP BY p.numpalet`;
                const [palets] = await conn.query(sql);
                if (palets.length === 0) {
                    return resolve({ palet: null });
                }
                respuesta = palets[0];
                await conn.end();
                resolve(respuesta);
            } catch (error) {
                if (conn) {
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postObtenerBolsasVariedad: (linea) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                let respuesta = undefined;
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT DISTINCT bc.codvarie, v.nomvarie
                FROM trz2_bolsas_confeccion AS bc
                LEFT JOIN variedades AS v ON v.codvarie = bc.codvarie
                WHERE bc.linea = ${linea}`;
                const [bolsas] = await conn.query(sql);
                respuesta = bolsas;
                await conn.end();
                resolve(respuesta);
            } catch (error) {
                if (conn) {
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postPaletConfeccionadoModificar: (numpalet, palet) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                let respuesta = undefined;
                // Primero obtenemor el total de cajas de ese palet
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT 
                p.*, 
                COALESCE(SUM(pv.numcajas), 0) AS numcajas
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                WHERE p.numpalet = ${numpalet}
                GROUP BY p.numpalet`;
                const [regs] = await conn.query(sql);
                if (regs.length === 0) {
                    return resolve('SUCCESS1');
                }
                respuesta = regs[0];
                let totalCajas = +respuesta.numcajas;
                if (totalCajas === 0) { totalCajas = 1 }; // Protegemos la división por cero.
                let pesoCajaBruto = palet.pesobruto / +totalCajas;
                let pesoCajaNeto = palet.pesoneto / +totalCajas;
                // Ahora leemos las diferentes lineas de cajas para aignarles sus pesos corregidos.
                const [lineasCajas] = await conn.query(`SELECT * FROM palets_variedad WHERE numpalet = ${numpalet}`);
                for (i = 0; i < lineasCajas.length; i++) {
                    let linea = lineasCajas[i];
                    linea.pesobrut = +linea.numcajas * +pesoCajaBruto;
                    linea.pesoneto = +linea.numcajas * +pesoCajaNeto;
                    sql = `UPDATE palets_variedad SET ? WHERE numpalet = ? AND numlinea = ?`;
                    sql = mysql2.format(sql, [linea, linea.numpalet, linea.numlinea]);
                    await conn.query(sql);
                };
                // Y por último modificamos el palet propiamente dicho
                let paletModificado = {
                    numpalet: numpalet,
                    codlinconf: palet.codlinconfe,
                    lincofe: palet.codlinconfe,
                    fechaini: palet.fechaini,
                    horaini: palet.horaini,
                    linconfe: palet.codlinconfe
                };
                sql = `UPDATE palets SET ? WHERE numpalet = ?`;
                sql = mysql2.format(sql, [paletModificado, numpalet])
                await conn.query(sql);
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postRecuperarPaletDeLineaDeConfeccion: (idpalet, numkilos) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT * FROM trz2_bolsas_confeccion WHERE idpalet = ${idpalet}`;
                const [regs] = await conn.query(sql);
                if (regs.length === 0) {
                    const err = new Error('El palet no está en la bolsa de confección');
                    err.status = 404;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                const palet = regs[0];
                if (palet.numkilos < numkilos) {
                    const err = new Error(`Los kilos del palet restantes (${palet.numkilos}) son inferiores a los solicitados (${numkilos})`);
                    err.status = 409;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                if (palet.numkilos === numkilos) {
                    // Pasa a el mismo palet entrado con los kilos disminuidos si fuera el caso.
                    sql = `UPDATE trzpalets SET numcajones = 0, numkilos = ${palet.numkilos}, estado = 0
                    WHERE idpalet = ${idpalet}`;
                    await conn.query(sql);
                    // Eliminamos el palet de la bolsa de confección
                    sql = `DELETE FROM trz2_bolsas_confeccion WHERE idpalet = ${idpalet}`;
                    await conn.query(sql);
                } else {
                    // Diferencia que restará en línea.
                    const diferencia = palet.numkilos - numkilos;
                    sql = `UPDATE trzpalets SET numcajones = 0, numkilos = ${numkilos}, estado = 0
                    WHERE idpalet = ${idpalet}`;
                    await conn.query(sql);
                    // Dejamos el resto en la linea
                    sql = `UPDATE trz2_bolsas_confeccion SET numkilos = ${diferencia}
                    WHERE idpalet = ${idpalet}`;
                    await conn.query(sql);
                }

                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postRestoPaletAbocado: (idpalet, linconfe) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                let respuesta = undefined;
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT * FROM trz2_bolsas_confeccion WHERE linea = ${linconfe} AND idpalet = ${idpalet}`;
                console.log('SQL', sql);
                const [palets] = await conn.query(sql);
                if (palets.length === 0) {
                    return resolve(null);
                }
                respuesta = palets[0];
                await conn.end();
                resolve(respuesta);
            } catch (error) {
                if (conn) {
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postDestrioPaletAbocado: (idpalet, linconfe) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                let regs = undefined;
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT * FROM trz2_bolsas_confeccion WHERE linea = ${linconfe} AND idpalet = ${idpalet}`;
                console.log('SQL', sql);
                const [palets] = await conn.query(sql);
                if (palets.length === 0) {
                    return resolve(null);
                }
                let reg = palets[0];
                const destrio = {
                    linea: reg.linconfe,
                    idpalet: reg.idpalet,
                    tipo: reg.tipo,
                    fecha: moment().format('YYYY-MM-DD'),
                    numkilos: reg.numkilos,
                    codvarie: reg.codvarie,
                    codsocio: reg.codsocio,
                    codcampo: reg.codcampo
                };
                sql = `INSERT INTO trz2_destrios SET ?`;
                await conn.query(sql, [destrio]);
                sql = `DELETE FROM trz2_bolsas_confeccion WHERE linea = ${linconfe} AND idpalet = ${idpalet}`;
                await conn.query(sql);
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    getPedidosNoServidos: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                p.numpedid, p.fechaped, p.codclien, c.nomclien,
                pv.codvarie, v.nomvarie, pv.codforfait, f.nomconfe,
                SUM(pv.numcajas) AS numcajas, SUM(pesoneto) AS pesoneto
                FROM pedidos AS p
                LEFT JOIN pedidos_variedad AS pv ON pv.numpedid = p.numpedid
                LEFT JOIN variedades AS v ON v.codvarie = pv.codvarie
                LEFT JOIN forfaits AS f ON f.codforfait = pv.codforfait
                LEFT JOIN clientes AS c ON c.codclien = p.codclien
                WHERE p.numalbar IS NULL
                GROUP BY p.numpedid, pv.codvarie, pv.codforfait
                ORDER BY p.fechaped`;
                const [pedidos] = await conn.query(sql);
                await conn.end();
                if (pedidos.length === 0) return resolve([]);
                let rped = {};
                let rpeds = [];
                let antped = null;
                let primero = true;
                for (i = 0; i < pedidos.length; i++) {
                    const pedido = pedidos[i];
                    if (pedido.numpedid !== antped) {
                        if (!primero) {
                            rpeds.push({ ...rped });
                        }
                        primero = false;
                        rped = {
                            numpedid: pedido.numpedid,
                            fechaped: pedido.fechaped,
                            codclien: pedido.codclien,
                            nomclien: pedido.nomclien,
                            lineas: []
                        }
                        antped = pedido.numpedid;
                    }
                    rped.lineas.push({
                        codvarie: pedido.codvarie,
                        nomvarie: pedido.nomvarie,
                        codforfait: pedido.codforfait,
                        nomconfe: pedido.nomconfe,
                        numcajas: pedido.numcajas,
                        pesoneto: pedido.pesoneto
                    });
                }
                if (rped !== {}) {
                    rpeds.push({ ...rped });
                }
                const respuesta = {
                    pedidos: rpeds,
                    registros: pedidos
                }
                resolve(respuesta);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    postAsignarPaletAPedido: (numpalet, numpedid) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT * FROM palets WHERE numpalet = ${numpalet}`;
                const [regs] = await conn.query(sql);
                if (regs.length === 0) {
                    const err = new Error('El palet no existe en la base de datos');
                    err.status = 404;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                const palet = regs[0];
                if (palet.numpedid) {
                    const err = new Error(`El palet ya está asignado al pedido ${palet.numpedid}`);
                    err.status = 409;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                // Pasa a el mismo palet entrado con los kilos disminuidos si fuera el caso.
                sql = `UPDATE palets SET numpedid = ${numpedid} WHERE numpalet = ${numpalet}`;
                await conn.query(sql);

                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    postObtenerLosPaletsDeUnPedido: (numpedid) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                p.*,
                pv.codvarie, v.nomvarie, pv.codforfait, f.nomconfe,
                SUM(numcajas) AS numcajas, SUM(pesoneto) AS pesoneto 
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                LEFT JOIN variedades AS v ON v.codvarie = pv.codvarie
                LEFT JOIN forfaits AS f ON f.codforfait = pv.codforfait
                WHERE numpedid = ${numpedid}
                GROUP BY p.numpalet, pv.codvarie, pv.codforfait`;
                const [palets] = await conn.query(sql);
                conn.end();
                resolve(palets);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        });
    },
    postDesasignarPaletAPedido: (numpalet) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT * FROM palets WHERE numpalet = ${numpalet}`;
                const [regs] = await conn.query(sql);
                if (regs.length === 0) {
                    const err = new Error('El palet no existe en la base de datos');
                    err.status = 404;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                const palet = regs[0];
                // Pasa a el mismo palet entrado con los kilos disminuidos si fuera el caso.
                sql = `UPDATE palets SET numpedid = null WHERE numpalet = ${numpalet}`;
                await conn.query(sql);

                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    getTrazabilidadDePaletsConfeccionados: () => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                pt.*, v.nomvarie, s.nomsocio
                FROM trz2_palets_traza AS pt
                LEFT JOIN trzpalets AS pe ON pe.idpalet = pt.idpalet
                LEFT JOIN rsocios AS s ON s.codsocio = pt.codsocio
                LEFT JOIN variedades AS v ON v.codvarie = pe.codvarie`;
                const [lineas] = await conn.query(sql);
                await conn.end();
                resolve(lineas);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    postObtenerLosPaletsDeUnPedido: (numpedid) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                p.*,
                pv.codvarie, v.nomvarie, pv.codforfait, f.nomconfe,
                SUM(numcajas) AS numcajas, SUM(pesoneto) AS pesoneto 
                FROM palets AS p
                LEFT JOIN palets_variedad AS pv ON pv.numpalet = p.numpalet
                LEFT JOIN variedades AS v ON v.codvarie = pv.codvarie
                LEFT JOIN forfaits AS f ON f.codforfait = pv.codforfait
                WHERE numpedid = ${numpedid}
                GROUP BY p.numpalet, pv.codvarie, pv.codforfait`;
                const [palets] = await conn.query(sql);
                conn.end();
                resolve(palets);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        });
    },
    postReasignarCajas: (numpalet_destino, numpalet_origen, numlinea, numcajas) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                await conn.query('START TRANSACTION');
                let sql = `SELECT * FROM palets WHERE numpalet = ${numpalet_destino}`;
                const [regs] = await conn.query(sql);
                if (regs.length === 0) {
                    const err = new Error('El palet de destino no existen en la base de datos');
                    err.status = 404;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                sql = `SELECT * FROM palets_variedad WHERE numpalet = ${numpalet_origen} AND numlinea=${numlinea}`;
                const [regs1] = await conn.query(sql);
                if (regs1.length === 0) {
                    const err = new Error('El palet y linea origen no existen en la base de datos');
                    err.status = 404;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                const palet = regs1[0];
                // Verificar que el número de cajas realmente se pueden enviar.
                if (palet.numcajas < numcajas) {
                    const err = new Error('La linea del palet origen tiene menos cajas que las solicitadas');
                    err.status = 409;
                    await conn.query('ROLLBACK');
                    await conn.end();
                    return reject(err);
                }
                // Obtener la línea del palet de destino en el que se pondrán las cajas pedidas.
                sql = `SELECT COALESCE(MAX(numlinea) + 1, 1) AS numlinea FROM palets_variedad WHERE numpalet = ${numpalet_destino}`;
                const [regs2] = await conn.query(sql);
                const nueva_linea = regs2[0].numlinea;
                // Calcular como quedará el registro de destino.
                const destino = { ...palet };
                destino.numpalet = numpalet_destino;
                destino.numlinea = nueva_linea;
                destino.numcajas = numcajas;
                destino.pesobrut = (palet.pesobrut / palet.numcajas) * numcajas;
                destino.pesoneto = (palet.pesoneto / palet.numcajas) * numcajas;
                // calcular como quedará el registro origen
                const origen = { ...palet };
                origen.numcajas = origen.numcajas - destino.numcajas;
                origen.pesobrut = origen.pesobrut - destino.pesobrut;
                origen.pesoneto = origen.pesoneto - destino.pesoneto;
                // Crear destino.
                sql = `INSERT INTO palets_variedad SET ?`;
                await conn.query(sql, [destino]);
                // Modificar el origen
                if (origen.numcajas <= 0) {
                    // Eliminamos la línea completamente
                    sql = `DELETE FROM palets_variedad WHERE numpalet=${origen.numpalet} AND numlinea=${origen.numlinea}`;
                    await conn.query(sql);
                } else {
                    // Modificamos el origen en consecuencia.
                    sql = `UPDATE palets_variedad SET ? WHERE numpalet=${origen.numpalet} AND numlinea=${origen.numlinea}`;
                    await conn.query(sql, [origen]);
                }
                // Si llegamos hasta aquí es que todo se ha podido hacer.
                await conn.query('COMMIT');
                await conn.end();
                resolve('SUCCESS');
            } catch (error) {
                if (conn) {
                    await conn.query('ROLLBACK');
                    await conn.end();
                }
                reject(error);
            }
        })
    },
    // crearJerarquiaInformacionBolsas:
    // Recibe las líneas de infomación de detalle de bolsas ordenadas por 
    // linea de confección y código de variedad. Devuelve un objeto con la 
    // jerarquía Linea -> Bolsa (Variedad) -> Palet. Con totales de kilos por 
    // Linea y Bolsa, calculados en la misma función.
    crearJerarquiaInformacionBolsas: (regs) => {
        let primero = true;
        let linea = undefined;
        let bolsa = undefined;
        let palet = undefined;
        let antLinea = undefined;
        let antBolsa = undefined;
        let cambioLinea = false;
        let cambioBolsa = false;
        let pesoBolsa = 0;
        let resultado = [];
        // Para evitar impactos async usamos bucle for 
        for (i = 0; i < regs.length; i++) {
            let reg = regs[i];
            cambioLinea = antLinea !== reg.codlinconfe;
            cambioBolsa = antBolsa !== reg.codvarie;
            // Comprobar si ha cambiado linea.
            if (cambioLinea) {
                if (!primero) {
                    bolsa.peso = pesoBolsa;
                    pesoBolsa = 0;
                    linea.bolsas.push({ ...bolsa });
                    resultado.push({ ...linea });
                }
                linea = {
                    codlinconfe: reg.codlinconfe,
                    nombre: reg.nombre,
                    bolsas: []
                };

                bolsa = {
                    codvarie: reg.codvarie,
                    nomvarie: reg.nomvarie,
                    palets: []
                };
            }
            // Comprobar si ha cambiado bolsa.
            if (cambioBolsa && !cambioLinea) {
                if (!primero) {
                    bolsa.peso = pesoBolsa;
                    pesoBolsa = 0;
                    linea.bolsas.push({ ...bolsa });
                }
                bolsa = {
                    codvarie: reg.codvarie,
                    nomvarie: reg.nomvarie,
                    palets: []
                }
            }
            primero = false;
            antLinea = reg.codlinconfe;
            antBolsa = reg.codvarie;
            pesoBolsa += reg.numkilos;
            // procesamiento del palet individual.
            palet = {
                idpalet: reg.idpalet,
                referencia: reg.referencia,
                fecha_entrada: reg.fecha_entrada,
                fecha_abocamiento: reg.fecha_abocamiento,
                numkilos: reg.numkilos,
                numcajones: reg.numcajones,
                codcampo: reg.codcampo,
                nomsocio: reg.nomsocio
            };
            bolsa.palets.push({ ...palet });
        }
        // Salida del bucle, asignación de elementos pendientes
        bolsa.peso = pesoBolsa;
        pesoBolsa = 0;
        linea.bolsas.push({ ...bolsa });
        resultado.push({ ...linea });
        return resultado;
    }
};

module.exports = TrazaMysql;