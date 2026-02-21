const Brevo = require('@getbrevo/brevo');
require("dotenv").config();

const client = new Brevo.TransactionalEmailsApi();

client.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

    const email = {
        to: [{
            email: cliente.email,
            name: cliente.nombre
        }],
        sender: {
            email: "comercialautopremium@gmail.com",
            name: "Autopremium"
        },
        subject: "Encuesta de Satisfacción - Taller",
        htmlContent: `
            <h2>Hola ${cliente.nombre}</h2>
            <p>Gracias por confiar en nuestro taller.</p>
            <a href="${linkEncuesta}">Responder Encuesta</a>
        `
    };

    await client.sendTransacEmail(email);
}

module.exports = enviarEncuestaEmail;