const Mysql = require('mysql');
const MysqlConnector = require('../../connectors/mysql_connector');
const Password = require("../../utilities/password");
const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');
const Path = require('path');
const Fs = require('fs');
const Pack = require('../../package.json');

const passU= require('../../utilities/password');
const { debug } = require('winston');

Dotenv.config();

const userMysql = {
    loginUsuario: (obj) => {
        return new Promise((resolve, reject) => {
            let user = null;
            let token = null;
            let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
            let sql = "SELECT u.codusu ,u.nomusu ,u.nivelusu,u.login ,u.passwordpropio "
            sql += "FROM usuarios as u";
            sql += " WHERE u.login = ? AND u.passwordpropio = ?";  /// Vamos a encryptar
            sql = Mysql.format(sql, [obj.login, obj.password]);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) {
                        return reject({ status: 401, message: `Falló la autentificación` });
                    }
                    user = rows[0];

                    token = Jwt.sign({
                        nombre: user.nomusu,
                        usuario_id: user.codusu
                    },
                        process.env.TRZ2_JWT_KEY,
                        {
                            expiresIn: "5h"
                        });
                    resolve({
                        usuario: user,
                        token: token
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },
    /// aqyui aqqui   TODO
    loginDavid: (obj) => {
        return new Promise((resolve, reject) => {
            let user = null;
            let token = null;
            let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
            let sql = "SELECT u.codusu ,u.nomusu ,u.nivelusu,u.login ,u.passwordpropio "
            sql += "FROM usuarios as u";
            sql += " WHERE u.login = ? ";  /// Vamos a encryptar AND u.passwordpropio = ?
            sql = Mysql.format(sql, [obj.login]);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) {
                        return reject({ status: 401, message: `Usuario incorrecto` });
                    }


                    user = rows[0];
                    
                    let passEncriptadoOk=passU.validate(user.passwordpropio,obj.password);
                    if (!passEncriptadoOk) {
                        return reject({ status: 401, message: `Usuario no autenticado` });
                    }
                    
                    delete user.passwordpropio;



                    token = Jwt.sign({
                        nombre: user.nomusu,
                        usuario_id: user.codusu
                    },
                        process.env.TRZ2_JWT_KEY,
                        {
                            expiresIn: "5h"
                        });
                    resolve({
                        ok: true,
                        codusu: user.codusu,
                        nomusu: user.nomusu,
                        nivelusu: user.nivelusu,
                        token: token
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },
    postAnyadeUsuario: (usuario) => {
        return new Promise(async (resolve, reject) => {
            let conn = undefined;
            try {
                conn = await mysql2.createConnection(confMysql.getConf());
                let sql = `START TRANSACTION`;
                await conn.query(sql);

                sql = `select max(codusu) id,sum(if(login='root',1,0)) existe from usuarios u  `;
                const [ID] = await conn.query(sql);
                
                if (!ID) {
                    // No se ha encontrado el palet
                    await conn.query('ROLLBACK');
                    await conn.end();
                    let err = new Error('NO se ha encontrado usuarios');
                    err.status = 404;
                    return reject(err);
                };
                if (ID.existe>=1) {
                    // No se ha encontrado el palet
                    await conn.query('ROLLBACK');
                    await conn.end();
                    let err = new Error('Ya existe el usuario usuarios');
                    err.status = 404;
                    return reject(err);
                }

                // Elimar el rfid del palet original marcándolo como abocado
                //sql = `UPDATE trzpalets SET estado = 1 WHERE idpalet = ${palete.idpalet} AND tipo = ${palete.tipo}`;
                //await conn.query(sql);
                passwordcrypt=passU.crear(usuario.passwordpropio);
                usuario.passwordpropio=passwordcrypt;
                usuario.codusu=ID.id;
                
               sql = `INSERT INTO usuarios SET ?`;
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

    
    renew: (req) => {
        return new Promise(async (resolve, reject) => {

    
            const token= req.headers['x-token'];
            const {uid,nombre}=req;
            console.log(req,nombre);

            if (!token){
                let err = new Error('No viene token');
                err.status = 404;
                return reject(err);
            }

              



                resolve({
                    usuario: 'user',
                    token: token
                });





           
        } 
    )},

};

async function EncuentraUsuario(login){

    return new Promise((resolve, reject) => {

        let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
        let sql = "SELECT u.codusu ,u.nomusu ,u.nivelusu,u.login ,u.passwordpropio "
        sql += "FROM usuarios as u";
        sql += " WHERE u.login = ?";  /// Vamos a encryptar
        sql = Mysql.format(sql, login);
        db.query(sql)
            .then(rows => {
                db.close();
                if (rows.length == 0) {
                    reject({ status: 401, message: `Falló la autentificación` })
                } else {

                    resolve ( rows[0]);
                }
            })
            .catch(err => { db.close(); reject(err); });
    });
}




module.exports = userMysql;