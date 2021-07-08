


const mysql2 = require('mysql2/promise');
const confMysql = require('../../connectors/config_mysql');
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

const jugMysql = {
    
    postAnyadeJugador: (jugador) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `START TRANSACTION`;
                await conn.query(sql);

                sql = `SELECT max(idjugador) FROM jugadores  `;
                const ID = await conn.query(sql);
                if (ID === 0) {
                    // No se ha encontrado el palet
                    await conn.query('ROLLBACK');
                    await conn.end();
                    let err = new Error('NO se ha encontrado usuarios');
                    err.status = 404;
                    return reject(err);
                }
                )

                // Elimar el rfid del palet original marcándolo como abocado
                sql = `UPDATE trzpalets SET estado = 1 WHERE idpalet = ${palete.idpalet} AND tipo = ${palete.tipo}`;
                await conn.query(sql);

                const bolsa;
                /*
                const bolsa = {
                    idpalet: palete.idpalet,
                    linea: linea,
                    tipo: palete.tipo,
                    fecha: moment().format('YYYY-MM-DD HH:mm:ss'),
                    codvarie: palete.codvarie,
                    numkilos: palete.numkilos,
                    numcajones: palete.numcajones,
                    codsocio: palete.codsocio,
                    codcampo: palete.codcampo
                }
                */
                sql = `INSERT INTO trz2_bolsas_confeccion SET ?`;
                await conn.query(sql, bolsa);

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
    getLineasCofeccion: () => {
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
    postBuscarUnPaletDeEntrada: (codigo) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `SELECT 
                trp.*,
                soc.nomsocio, v.nomvarie
                FROM trzpalets AS trp
                LEFT JOIN rsocios AS soc ON soc.codsocio = trp.codsocio
                LEFT JOIN variedades AS v ON v.codvarie = trp.codvarie
                WHERE CRFID = '${codigo}'`;
                const [palets] = await conn.query(sql);
                await conn.end();
                resolve(palets);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    }
};


module.exports = PaletsEntradaMysql;