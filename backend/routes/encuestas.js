const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   LISTAR TODAS LAS ENCUESTAS
========================= */
router.get("/lista/todas", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM encuestas
      ORDER BY id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo encuestas" });
  }
});

/* =========================
   MOSTRAR FORMULARIO ENCUESTA
========================= */
router.get("/:servicioId", async (req, res) => {
  try {
    const servicioId = req.params.servicioId;

    const result = await db.query(`
      SELECT s.estado, e.id AS encuesta_id
      FROM servicios s
      LEFT JOIN encuestas e ON s.id = e.servicio_id
      WHERE s.id = $1
    `, [servicioId]);

    if (result.rows.length === 0)
      return res.send("<h2>Servicio no encontrado ❌</h2>");

    const servicio = result.rows[0];

    if (servicio.estado !== "entregado")
      return res.send("<h2>La encuesta aún no está disponible.</h2>");

    if (servicio.encuesta_id)
      return res.send("<h2>Esta encuesta ya fue respondida ✅</h2>");

    res.send(`
      <html>
      <head>
        <title>Encuesta</title>
        <style>
          body { font-family: Arial; text-align:center; padding:40px; }
          .card { max-width:400px; margin:auto; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); }
          select, textarea { width:100%; padding:10px; margin-top:10px; }
          button { background:#16a34a; color:white; border:none; padding:12px; margin-top:15px; width:100%; border-radius:6px; cursor:pointer; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Encuesta de Satisfacción</h2>
          <form method="POST">
            <label>Calificación</label>
            <select name="satisfaccion" required>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
              <option value="3">⭐⭐⭐ Bueno</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="1">⭐ Malo</option>
            </select>

            <textarea name="comentario" placeholder="Escribe tu comentario"></textarea>

            <button type="submit">Enviar Encuesta</button>
          </form>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.send("Error del servidor ❌");
  }
});

/* =========================
   GUARDAR ENCUESTA
========================= */
router.post("/:servicioId", async (req, res) => {
  try {
    const servicioId = req.params.servicioId;
    const { satisfaccion, comentario } = req.body;

    await db.query(`
      INSERT INTO encuestas (servicio_id, satisfaccion, comentario)
      VALUES ($1, $2, $3)
    `, [servicioId, satisfaccion, comentario]);

    // 🔥 ACTUALIZAR SERVICIO CON SATISFACCIÓN
    await db.query(`
      UPDATE servicios 
      SET satisfaccion = $1
      WHERE id = $2
    `, [satisfaccion, servicioId]);

    res.send(`
      <html>
        <body style="text-align:center;padding:40px;font-family:Arial">
          <h2>Gracias por tu opinión 🙌</h2>
          <p>Tu respuesta ha sido registrada correctamente.</p>
        </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.send("<h2>Error guardando encuesta ❌</h2>");
  }
});

module.exports = router;