const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================
   📊 ESTADÍSTICAS POR MARCA
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

/* =========================
   LISTAR VEHÍCULOS
========================= */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT v.*, c.primer_nombre, c.primer_apellido 
      FROM vehiculos v
      JOIN clientes c ON v.cliente_id = c.id
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   CREAR VEHÍCULO
========================= */
router.post("/", async (req, res) => {
  try {
    const { cliente_id, placa, marca, modelo, anio, color } = req.body;

    await db.query(`
      INSERT INTO vehiculos 
      (cliente_id, placa, marca, modelo, anio, color) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [cliente_id, placa, marca, modelo, anio, color]);

    res.json({ message: "Vehículo registrado ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   ACTUALIZAR VEHÍCULO
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { cliente_id, placa, marca, modelo, anio, color } = req.body;
    const id = req.params.id;

    const result = await db.query(`
      UPDATE vehiculos
      SET cliente_id=$1, placa=$2, marca=$3, modelo=$4, anio=$5, color=$6
      WHERE id=$7
    `, [cliente_id, placa, marca, modelo, anio, color, id]);

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Vehículo no encontrado" });

    res.json({ message: "Vehículo actualizado ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   ELIMINAR VEHÍCULO
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db.query(
      "DELETE FROM vehiculos WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Vehículo no encontrado" });

    res.json({ message: "Vehículo eliminado ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;