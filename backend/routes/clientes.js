const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   LISTAR CLIENTES ACTIVOS
========================= */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM clientes WHERE activo = true ORDER BY primer_nombre"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   CREAR CLIENTE
========================= */
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const sql = `
      INSERT INTO clientes 
      (nit, dv, naturaleza, primer_nombre, segundo_nombre, primer_apellido,
       segundo_apellido, empresa, direccion, telefono, movil, email)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
    `;

    const result = await db.query(sql, [
      data.nit,
      data.dv,
      data.naturaleza,
      data.primer_nombre,
      data.segundo_nombre,
      data.primer_apellido,
      data.segundo_apellido,
      data.empresa,
      data.direccion,
      data.telefono,
      data.movil,
      data.email
    ]);

    res.json({
      message: "Cliente registrado correctamente ✅",
      cliente: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   ACTUALIZAR CLIENTE
========================= */
router.put("/:id", async (req, res) => {
  try {
    const clienteId = req.params.id;
    const data = req.body;

    const sql = `
      UPDATE clientes SET
      nit=$1, dv=$2, naturaleza=$3, primer_nombre=$4, segundo_nombre=$5,
      primer_apellido=$6, segundo_apellido=$7, empresa=$8, direccion=$9,
      telefono=$10, movil=$11, email=$12
      WHERE id=$13
      RETURNING *
    `;

    const result = await db.query(sql, [
      data.nit,
      data.dv,
      data.naturaleza,
      data.primer_nombre,
      data.segundo_nombre,
      data.primer_apellido,
      data.segundo_apellido,
      data.empresa,
      data.direccion,
      data.telefono,
      data.movil,
      data.email,
      clienteId
    ]);

    res.json({
      message: "Cliente actualizado correctamente ✅",
      cliente: result.rows[0]
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   DESACTIVAR CLIENTE (SOFT DELETE)
========================= */
router.put("/:id/desactivar", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE clientes SET activo = false WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    res.json({ message: "Cliente desactivado 🗑" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;