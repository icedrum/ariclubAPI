const Jwt = require('jsonwebtoken');
const Dotenv = require('dotenv'); 

module.exports = (req, res, next) => {
    Dotenv.config();

    const token= req.headers['x-token'];

   // console.log('xxxxxxxxx',token);
    
    if (!token) return next({ status: 401, message: 'Error de autentificación. No se ha encontrado token.' });
    //let token = req.h     eaders.token;
    try {
        let decode = Jwt.verify(token, process.env.TRZ2_JWT_KEY);
        //c onsole.log (decode);
        req.usuario_id =decode.usuario_id;
        req.nombre=decode.nombre;
        console.log (req.nombre);
        next();
    } catch (error) { 
        next({ status: 401, message: `Fallo de autentificación2.` });
    }
};
