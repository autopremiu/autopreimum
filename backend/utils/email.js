const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `http://192.168.128.13:3000/encuesta/${servicioId}`;

    const mailOptions = {
        from: "sebasocampo721@gmail.com",
        to: cliente.email,
        subject: "Encuesta de Satisfacción - Taller",
        html: `
            <h2>Hola ${cliente.nombre}</h2>
            <p>Gracias por confiar en nuestro taller.</p>
            <p>Por favor califica nuestro servicio haciendo clic en el botón:</p>
            <a href="${linkEncuesta}" 
               style="background:#16a34a;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;">
               Responder Encuesta
            </a>
            <p>Tu opinión es muy importante para nosotros 🙌</p>
        `
    };

    await transporter.sendMail(mailOptions);
}

module.exports = enviarEncuestaEmail;
