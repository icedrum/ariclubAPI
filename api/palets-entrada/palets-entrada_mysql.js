const mysql2 = require('mysql2/promise');
const confMysql = require('../../connectors/config_mysql');
const dotenv = require('dotenv');
const moment = require('moment');
dotenv.config();

const PaletsEntradaMysql = {
    getPaletsNoAbocados: () => {
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
                WHERE estado = 0`;
                const [palets] = await conn.query(sql);
                await conn.end();
                resolve(palets);
            } catch (error) {
                if (conn) await conn.end();
                reject(error);
            }
        })
    },
    postAbocarPalet: (linea, crfid) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `START TRANSACTION`;
                await conn.query(sql);

                sql = `SELECT * FROM trzpalets WHERE CRFID= '${crfid}'`;
                const [palets] = await conn.query(sql);
                if (palets.length === 0) {
                    // No se ha encontrado el palet
                    await conn.query('ROLLBACK');
                    await conn.end();
                    let err = new Error('NO se ha encontrado el palet de entrada');
                    err.status = 404;
                    return reject(err);
                }
                const palete = palets[0];

                // Elimar el rfid del palet original marcándolo como abocado
                sql = `UPDATE trzpalets SET estado = 1 WHERE idpalet = ${palete.idpalet} AND tipo = ${palete.tipo}`;
                await conn.query(sql);

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