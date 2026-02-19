const express = require("express");
const router = express.Router();
const db = require("../config/db");

// LISTAR CLIENTES ACTIVOS
router.get("/", (req, res) => {

    db.query(
        "SELECT * FROM clientes WHERE activo = 1 ORDER BY primer_nombre",
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
});

// CREAR CLIENTE
router.post("/", (req, res) => {

    const data = req.body;

    const sql = `
        INSERT INTO clientes 
        (nit,dv,naturaleza,primer_nombre,segundo_nombre,primer_apellido,
         segundo_apellido,empresa,direccion,telefono,movil,email)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.query(sql, [
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
    ], (err) => {

        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Cliente registrado correctamente ✅" });
    });
});

// ACTUALIZAR CLIENTE
router.put("/:id", (req, res) => {

    const clienteId = req.params.id;
    const data = req.body;

    const sql = `
        UPDATE clientes SET
        nit=?, dv=?, naturaleza=?, primer_nombre=?, segundo_nombre=?,
        primer_apellido=?, segundo_apellido=?, empresa=?, direccion=?,
        telefono=?, movil=?, email=?
        WHERE id=?
    `;

    db.query(sql, [
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
    ], (err) => {

        if (err) return res.status(500).json({ error: err });

        res.json({ message: "Cliente actualizado correctamente ✅" });
    });
});

// DESACTIVAR CLIENTE (SOFT DELETE)
router.put("/:id/desactivar", (req, res) => {

    db.query(
        "UPDATE clientes SET activo = 0 WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Cliente desactivado 🗑" });
        }
    );
});

module.exports = router;
