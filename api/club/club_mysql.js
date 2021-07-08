const Mysql = require('mysql');
const MysqlConnector = require('../../connectors/mysql_connector');
const Password = require("../../utilities/password");
const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv');
const Path = require('path');
const Fs = require('fs');
const Pack = require('../../package.json');


Dotenv.config();

const clubMysql = {
   
    
    obtenerClubs: (obj) => {
        return new Promise((resolve, reject) => {
            let clubs = null;
            let token = null;

            console.log('obj',obj);

            let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
            let sql = "Select * from club c where idclub  in (SELECT"
            sql += " idclub FROM usuariosclub u where codusu= ? )";  
            sql = Mysql.format(sql, [obj.usuario]);
            console.log(sql);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) {
                        return reject({ status: 401, message: `Falló la autentificación e club` });
                    }
                    clubs = rows;

                    resolve({
                        clubs: clubs
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },

    //Dado un club o
    listaequipos: (obj) => {
        return new Promise((resolve, reject) => {
            let equipos = null;
            
            let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
            let sql = "SELECT * from equipostemporada e2  where idclub = ? ";
            sql += " order by temporada desc ,idequipo "  
            sql = Mysql.format(sql, [obj.club]);
            console.log(sql);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) {
                        return reject({ status: 401, message: `Falló la autentificación e club` });
                    }
                    equipos = rows;

                    resolve({
                        equipos: equipos
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },

    // jugadores jugadoresequipo
    jugadoresequipo: (obj) => {
        return new Promise((resolve, reject) => {
            let equipos = null;
            
            let db = new MysqlConnector.dbMysql(null, process.env.TRZ2_MYSQL_DBUSUARIOS);
            let sql = "SELECT * from equipostemporada e inner join jugadoresclubtemporada j ";
            sql += " on e.idequipo = j.idequipo inner join jugadores ju  on j.idjugador = ju.idjugador";
            sql += " where e.idequipo = ? ";
            sql += " order by j.idjugador "  ;
            sql = Mysql.format(sql, [obj.equipo]);
            console.log(sql);
            db.query(sql)
                .then(rows => {
                    db.close();
                    if (rows.length == 0) {
                        return reject({ status: 401, message: `Falló la autentificación e club` });
                    }
                    equipos = rows;

                    resolve({
                        equipos: equipos
                    });
                })
                .catch(err => { db.close(); reject(err); });
        });
    },

};





module.exports = clubMysql;