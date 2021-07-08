const Mysql = require('mysql');
const Dotenv = require('dotenv');
Dotenv.config();

module.exports.dbMysql = class Database {
    constructor(config, database) {
        this.config = config;
        if (!this.config) {
            this.config = {
                host: process.env.TRZ2_MYSQL_HOST,
                user: process.env.TRZ2_MYSQL_USER,
                password: process.env.TRZ2_MYSQL_PASSWORD,
                database: process.env.TRZ2_MYSQL_DBGESTION,
                port: process.env.TRZ2_MYSQL_PORT,
                charset : process.env.TRZ2_MYSQL_CHARSET || 'utf-8'
            };
        }
        if (database) {
            this.config.database = database
        }
        this.connection = Mysql.createConnection(this.config);
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        this.connection.destroy();
        // return new Promise((resolve, reject) => {
        //     this.connection.end(err => {
        //         //if (err) return reject(err);
        //         resolve();
        //     });
        // });
    }
};
