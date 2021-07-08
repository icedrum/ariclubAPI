var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
const Dotenv = require('dotenv');
Dotenv.config();

router.post('/enviar', async (req, res, next) => {
    try {
        const datos = req.body;
        const respuesta = await envio(datos);
        res.json(respuesta);
    } catch(err) {
        next(err);
    }
});


const envio = async(datos) => {
    return new Promise ((resolve, reject) => {
        if (!datos || !datos.asunto || !datos.cuerpo) {
            var err = new Error('Los datos para el correo son incorrectos');
            return reject(err);
        }
        // Montamos el transporte de correo basado en la configuración.
        const transporter = nodemailer.createTransport({
            host: process.env.TRZ2_EMAIL_HOST,
            port: process.env.TRZ2_EMAIL_PORT,
            secure: process.env.TRZ2_EMAIL_SECURE,
            auth: {
                user: process.env.TRZ2_EMAIL_USER,
                pass: process.env.TRZ2_EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        const mailOptions = {
            from: process.env.TRZ2_EMAIL_FROM,
            to: process.env.TRZ2_EMAIL_TO,
            subject: datos.asunto,
            html: datos.cuerpo
        };
        // Enviar el correo propiamente dicho
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return reject(err);
            }
            resolve('SUCCESS');
        });
    });
}

module.exports = router;