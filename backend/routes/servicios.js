const express = require("express");
const router = express.Router();
const db = require("../config/db");
const enviarEncuestaEmail = require("../utils/email");

/* =========================
   LISTAR SERVICIOS
========================= */
router.get("/", async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    let sql = `
      SELECT s.*, v.placa, v.marca
      FROM servicios s
      JOIN vehiculos v ON s.vehiculo_id = v.id
    `;

    const params = [];

    if (desde && hasta) {
      sql += ` WHERE s.fecha BETWEEN $1 AND $2 `;
      params.push(desde, hasta);
    }

    sql += ` ORDER BY s.fecha DESC`;

    const result = await db.query(sql, params);
    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   CREAR SERVICIO
========================= */
router.post("/", async (req, res) => {
  try {
    const { vehiculo_id, descripcion, tipo_servicio, precio, fecha, estado } = req.body;

    await db.query(`
      INSERT INTO servicios 
      (vehiculo_id, descripcion, tipo_servicio, precio, fecha, estado) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      vehiculo_id,
      descripcion,
      tipo_servicio,
      precio,
      fecha,
      estado || "pendiente"
    ]);

    res.json({ message: "Servicio registrado ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   ENTREGAR SERVICIO
========================= */
router.put("/:id/entregar", async (req, res) => {
  try {
    const servicioId = req.params.id;

    const update = await db.query(
      "UPDATE servicios SET estado = 'entregado' WHERE id = $1",
      [servicioId]
    );

    if (update.rowCount === 0)
      return res.status(404).json({ message: "Servicio no encontrado" });

    const result = await db.query(`
      SELECT 
        (c.primer_nombre || ' ' || COALESCE(c.segundo_nombre,'') || ' ' || c.primer_apellido) AS nombre,
        c.email
      FROM servicios s
      JOIN vehiculos v ON s.vehiculo_id = v.id
      JOIN clientes c ON v.cliente_id = c.id
      WHERE s.id = $1
    `, [servicioId]);

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Cliente no encontrado" });

    const cliente = result.rows[0];

    try {
      await enviarEncuestaEmail(cliente, servicioId);
      return res.json({ message: "Servicio entregado y encuesta enviada ✅" });
    } catch (error) {
      return res.status(500).json({
      message: "Servicio entregado pero falló el envío",
      error: error.message,
      stack: error.stack
    });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   CAMBIAR ESTADO
========================= */
router.put("/:id/estado", async (req, res) => {
  try {
    const servicioId = req.params.id;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "listo", "entregado"];

    if (!estadosValidos.includes(estado))
      return res.status(400).json({ message: "Estado inválido" });

    const result = await db.query(
      "UPDATE servicios SET estado = $1 WHERE id = $2",
      [estado, servicioId]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Servicio no encontrado" });

    res.json({ message: "Estado actualizado correctamente ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   EDITAR SERVICIO
========================= */
router.put("/:id", async (req, res) => {
  try {
    const servicioId = req.params.id;
    const { descripcion, tipo_servicio, precio, fecha } = req.body;

    const check = await db.query(
      "SELECT estado FROM servicios WHERE id = $1",
      [servicioId]
    );

    if (check.rows.length === 0)
      return res.status(404).json({ message: "Servicio no encontrado" });

    if (check.rows[0].estado === "entregado")
      return res.status(400).json({
        message: "No se puede editar un servicio entregado ❌"
      });

    await db.query(`
      UPDATE servicios
      SET descripcion=$1, tipo_servicio=$2, precio=$3, fecha=$4
      WHERE id=$5
    `, [descripcion, tipo_servicio, precio, fecha, servicioId]);

    res.json({ message: "Servicio actualizado correctamente ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   ESTADÍSTICAS MARCAS
========================= */
router.get("/estadisticas/marcas", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        UPPER(TRIM(marca)) AS marca,
        COUNT(*) AS total
      FROM vehiculos
      GROUP BY UPPER(TRIM(marca))
      ORDER BY total DESC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;