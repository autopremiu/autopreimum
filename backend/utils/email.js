require("dotenv").config();

async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

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
                email: cliente.email,
                name: cliente.nombre
            }],
            subject: "Encuesta de Satisfacción - Taller",
            htmlContent: `
                <h2>Hola ${cliente.nombre}</h2>
                <p>Gracias por confiar en nuestro taller.</p>
                <a href="${linkEncuesta}">Responder Encuesta</a>
            `
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Brevo error: ${errorData}`);
    }

    return await response.json();
}

module.exports = enviarEncuestaEmail;