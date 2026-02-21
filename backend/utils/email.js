const brevo = require('@getbrevo/brevo');
require("dotenv").config();

async function enviarEncuestaEmail(cliente, servicioId) {

    const apiInstance = new brevo.TransactionalEmailsApi();

    apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Encuesta de Satisfacción - Taller";
    sendSmtpEmail.htmlContent = `
        <h2>Hola ${cliente.nombre}</h2>
        <p>Gracias por confiar en nuestro taller.</p>
        <a href="${linkEncuesta}">Responder Encuesta</a>
    `;
    sendSmtpEmail.sender = {
        name: "Autopremium",
        email: "comercialautopremium@gmail.com"
    };
    sendSmtpEmail.to = [{
        email: cliente.email,
        name: cliente.nombre
    }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
}

module.exports = enviarEncuestaEmail;