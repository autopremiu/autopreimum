const express = require("express");
const router = express.Router();
const db = require("../config/db");
const enviarEncuestaEmail = require("../utils/email"); // 👈 importante

// LISTAR SERVICIOS
// LISTAR SERVICIOS (con filtro opcional por fecha)
router.get("/", (req, res) => {

    const { desde, hasta } = req.query;

    let sql = `
        SELECT s.*, v.placa, v.marca
        FROM servicios s
        JOIN vehiculos v ON s.vehiculo_id = v.id
    `;

    const params = [];

    // Si vienen fechas → aplicar filtro
    if (desde && hasta) {
        sql += ` WHERE DATE(s.fecha) BETWEEN ? AND ? `;
        params.push(desde, hasta);
    }

    sql += ` ORDER BY s.fecha DESC`;

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});


// CREAR SERVICIO
router.post("/", (req, res) => {
    const { vehiculo_id, descripcion, tipo_servicio, precio, fecha, estado } = req.body;

    const sql = `
        INSERT INTO servicios 
        (vehiculo_id, descripcion, tipo_servicio, precio, fecha, estado) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [vehiculo_id, descripcion, tipo_servicio, precio, fecha, estado || 'pendiente'], (err) => {
        if(err) return res.status(500).json({error: err});
        res.json({message: "Servicio registrado ✅"});
    });
});

// 👇👇 AQUÍ VA EL NUEVO ENDPOINT 👇👇
router.put("/:id/entregar", (req, res) => {

    console.log("🔥 ENTREGAR SERVICIO LLAMADO");

    const servicioId = req.params.id;

    const updateSql = "UPDATE servicios SET estado = 'entregado' WHERE id = ?";

    db.query(updateSql, [servicioId], (err, result) => {

        if (err) {
            console.log("❌ Error update:", err);
            return res.status(500).json({ error: err });
        }

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        console.log("✅ Servicio actualizado");

        const sql = `
            SELECT 
                CONCAT(
                    c.primer_nombre, ' ',
                    IFNULL(c.segundo_nombre, ''), ' ',
                    c.primer_apellido
                ) AS nombre,
                c.email
            FROM servicios s
            JOIN vehiculos v ON s.vehiculo_id = v.id
            JOIN clientes c ON v.cliente_id = c.id
            WHERE s.id = ?
        `;

        db.query(sql, [servicioId], async (err, results) => {

            if (err) {
                console.log("❌ Error buscando cliente:", err);
                return res.status(500).json({ error: err });
            }

            if (!results || results.length === 0) {
                console.log("❌ Cliente no encontrado");
                return res.status(404).json({ message: "Cliente no encontrado" });
            }

            const cliente = results[0];

            console.log("📧 Intentando enviar a:", cliente.email);

            try {
                await enviarEncuestaEmail(cliente, servicioId);
                console.log("📧 CORREO ENVIADO");
                return res.json({ message: "Servicio entregado y encuesta enviada ✅" });
            } catch (error) {
                console.log("❌ ERROR ENVIANDO:", error);
                return res.status(500).json({
                    message: "Servicio entregado pero falló el envío",
                    error: error.message
                });
            }
        });
    });
});


try {
    await enviarEncuestaEmail(cliente, servicioId);
    console.log("📧 CORREO ENVIADO");
    return res.json({ message: "Servicio entregado y encuesta enviada ✅" });
} catch (error) {
    console.log("❌ ERROR ENVIANDO:");
    console.log(error);
    console.log("MENSAJE:", error.message);
    return res.status(500).json({
        message: "Servicio entregado pero falló el envío",
        error: error.message
    });
}


router.put("/:id/estado", (req, res) => {

    const servicioId = req.params.id;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "listo", "entregado"];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ message: "Estado inválido" });
    }

    const sql = "UPDATE servicios SET estado = ? WHERE id = ?";

    db.query(sql, [estado, servicioId], (err, result) => {

        if (err) return res.status(500).json({ error: err });

        if (result.affectedRows === 0)
            return res.status(404).json({ message: "Servicio no encontrado" });

        res.json({ message: "Estado actualizado correctamente ✅" });

    });
});


router.put("/:id", (req, res) => {

    const servicioId = req.params.id;
    const { descripcion, tipo_servicio, precio, fecha } = req.body;

    // Primero verificamos estado
    const checkSql = "SELECT estado FROM servicios WHERE id = ?";

    db.query(checkSql, [servicioId], (err, results) => {

        if (err) return res.status(500).json({ error: err });

        if (results.length === 0)
            return res.status(404).json({ message: "Servicio no encontrado" });

        if (results[0].estado === "entregado") {
            return res.status(400).json({ 
                message: "No se puede editar un servicio entregado ❌" 
            });
        }

        const updateSql = `
            UPDATE servicios
            SET descripcion=?, tipo_servicio=?, precio=?, fecha=?
            WHERE id=?
        `;

        db.query(updateSql,
            [descripcion, tipo_servicio, precio, fecha, servicioId],
            (err) => {

                if (err) return res.status(500).json({ error: err });

                res.json({ message: "Servicio actualizado correctamente ✅" });
            }
        );

    });
});


// 📊 Vehículos agrupados por marca
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




module.exports = router;
