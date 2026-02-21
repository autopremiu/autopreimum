const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function enviarEncuestaEmail(cliente, servicioId) {

    const linkEncuesta = `https://autopreimum.onrender.com/encuesta/${servicioId}`;

    await resend.emails.send({
        from: 'Autopremium <onboarding@resend.dev>',
        to: cliente.email,
        subject: 'Encuesta de Satisfacción - Taller',
        html: `
            <h2>Hola ${cliente.nombre}</h2>
            <p>Gracias por confiar en nuestro taller.</p>
            <a href="${linkEncuesta}">Responder Encuesta</a>
        `
    });
}

module.exports = enviarEncuestaEmail;