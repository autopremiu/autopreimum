const express = require("express");
const router = express.Router();
const db = require("../config/db");


// 📊 Estadísticas por marca (para gráfica)
router.get("/estadisticas/marcas", (req, res) => {

    const sql = `
        SELECT 
            UPPER(TRIM(marca)) AS marca,
            COUNT(*) AS total
        FROM vehiculos
        GROUP BY UPPER(TRIM(marca))
        ORDER BY total DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });

});


// Listar vehículos
router.get("/", (req, res) => {
    const sql = `
        SELECT v.*, c.primer_nombre, c.primer_apellido 
        FROM vehiculos v
        JOIN clientes c ON v.cliente_id = c.id
    `;
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({error: err});
        res.json(results);
    });
});

// Crear vehículo
router.post("/", (req, res) => {
    const { cliente_id, placa, marca, modelo, anio, color } = req.body;
    const sql = "INSERT INTO vehiculos (cliente_id, placa, marca, modelo, anio, color) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [cliente_id, placa, marca, modelo, anio, color], (err, result) => {
        if(err) return res.status(500).json({error: err});
        res.json({message: "Vehículo registrado ✅"});
    });
});


router.put("/:id", (req, res) => {
    const { cliente_id, placa, marca, modelo, anio, color } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE vehiculos
        SET cliente_id=?, placa=?, marca=?, modelo=?, anio=?, color=?
        WHERE id=?
    `;

    db.query(sql, [cliente_id, placa, marca, modelo, anio, color, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Vehículo actualizado ✅" });
    });
});


router.delete("/:id", (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM vehiculos WHERE id=?", [id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Vehículo eliminado ✅" });
    });
});


module.exports = router;
