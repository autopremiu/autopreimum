const axios = require("axios");

const PHONE_NUMBER_ID = "1021621951033419";
const TOKEN = process.env.WHATSAPP_TOKEN;

async function enviarEncuestaWhatsApp(telefono, nombre, servicioId) {

  // Asegurar formato correcto (quitar + si viene)
  telefono = telefono.replace("+", "").replace(/\s/g, "");

  const link = `https://autopremium-crm.onrender.com/encuesta/${servicioId}`;

  try {
    await axios.post(
      `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: telefono,
        type: "template",
        template: {
          name: "encuesta_servicio",
          language: { code: "es" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: nombre },
                { type: "text", text: link }
              ]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ WhatsApp enviado correctamente");

  } catch (error) {
    console.error("❌ Error enviando WhatsApp:",
      error.response?.data || error.message
    );
    throw new Error("Error enviando WhatsApp");
  }
}

module.exports = { enviarEncuestaWhatsApp };