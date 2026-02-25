require("dotenv").config();


/* =========================================
   FUNCIÓN GENÉRICA PARA ENVIAR CORREOS
========================================= */
async function enviarEmail(toEmail, subject, htmlContent) {
    console.log("Intentando enviar a:", toEmail);
    console.log("API KEY existe:", !!process.env.BREVO_API_KEY);

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
            to: [{ email: toEmail }],
            subject,
            htmlContent
        })
    });

    const text = await response.text();

    console.log("STATUS:", response.status);
    console.log("RESPONSE BREVO:", text);

    if (!response.ok) {
        throw new Error(`Brevo error: ${text}`);
    }

    return text;
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