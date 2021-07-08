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
                        return reject({ status: 401, message: `Falló la autentificación` });
                    }
                    user = rows[0];

                    let passEncriptadoOk=passU.validate(user.passwordpropio,obj.password);
                    if (!passEncriptadoOk) {
                        return reject({ status: 401, message: `Falló la autentificación` });
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
                        usuario: user,
                        version: Pack.version,
                        token: token
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },
    verifyGeneralDirectory: () => {
        // Directorio general de ficheros
        genDir = Path.join(__dirname, '../../ficheros');
        //genDir = Path.join(process.env.TRZ2_DIRFICHEROS);
        if (!Fs.existsSync(genDir)) {
            // Si no existe el directorio general se crea
            Fs.mkdirSync(genDir);
        }
        fotoDir = genDir + "/fotos";
        if (!Fs.existsSync(fotoDir)) {
            // Si no existe el directorio de fotos se crea
            Fs.mkdirSync(fotoDir);
        }
        return;
    },
    verifyUserDirecory: (usuario_id) => {
        usuDir = Path.join(__dirname, '../../ficheros') + '/U' + usuario_id;
        //usuDir = Path.join(process.env.TRZ2_DIRFICHEROS) + '/U' + usuario_id;
        if (!Fs.existsSync(usuDir)) {
            // Si no existe el directorio de fotos se crea
            Fs.mkdirSync(usuDir);
        }
        return;
    }
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