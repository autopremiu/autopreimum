const SibApiV3Sdk = require('@getbrevo/brevo');
require("dotenv").config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

    const sendSmtpEmail = {
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

    await apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = enviarEncuestaEmail;