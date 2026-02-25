require("dotenv").config();
const fetch = require("node-fetch");

/* =========================================
   FUNCIÓN GENÉRICA PARA ENVIAR CORREOS
========================================= */
async function enviarEmail(toEmail, subject, htmlContent) {

    console.log("Enviando correo a:", toEmail);
    console.log("Usando API KEY:", process.env.BREVO_API_KEY ? "SI" : "NO");

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: "Autopremium",
                email: "comercialautopremium@gmail.com"
            },
            to: [{
                email: toEmail
            }],
            subject: subject,
            htmlContent: htmlContent
        })
    });

    const data = await response.text();

    if (!response.ok) {
        console.error("========== BREVO ERROR ==========");
        console.error("STATUS:", response.status);
        console.error("RESPONSE:", data);
        console.error("API KEY EXISTS:", !!process.env.BREVO_API_KEY);
        console.error("=================================");
        throw new Error(`Brevo error: ${data}`);
    }

    return data;
}

/* =========================================
   FUNCIÓN PARA ENCUESTAS
========================================= */
async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

    const html = `
        <h2>Hola ${cliente.nombre}</h2>
        <p>Gracias por confiar en nuestro taller.</p>
        <p>Queremos conocer tu opinión:</p>
        <a href="${linkEncuesta}" 
           style="display:inline-block;padding:10px 15px;background:#e10000;color:#ffffff;text-decoration:none;border-radius:5px;">
           Responder Encuesta
        </a>
    `;

    return await enviarEmail(
        cliente.email,
        "Encuesta de Satisfacción - Taller",
        html
    );
}

module.exports = {
    enviarEmail,
    enviarEncuestaEmail
};