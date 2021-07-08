const Dotenv = require('dotenv');
Dotenv.config();

const configMySQL = {
    getConf: (config, database) => {
        if (!config) {
            config = {
                host: process.env.TRZ2_MYSQL_HOST,
                user: process.env.TRZ2_MYSQL_USER,
                password: process.env.TRZ2_MYSQL_PASSWORD,
                database: process.env.TRZ2_MYSQL_DBGESTION,
                port: process.env.TRZ2_MYSQL_PORT,
                charset : process.env.TRZ2_MYSQL_CHARSET || 'utf-8'
            };
        }
        if (database) {
            config.database = database
        }
        return config;
    }
}

module.exports = configMySQL;