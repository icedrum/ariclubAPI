const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv'); 

module.exports = (req, res, next) => {
    Dotenv.config();
    console.log(req.headers.token);

    if (!req.headers.token) return next({ status: 401, message: 'Error de autentificación. No se ha encontrado token.' });
    let token = req.headers.token;
    try {
        let decode = Jwt.verify(token, process.env.TRZ2_JWT_KEY);
        //c onsole.log (decode);
        req.usuario_id =decode.usuario_id;
        console.log (req)
        next();
    } catch (error) {
        next({ status: 401, message: `Fallo de autentificación2.` });
    }
};
