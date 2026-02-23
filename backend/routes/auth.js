const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const enviarEmail = require("../utils/email");
const verificarToken = require("../middleware/authMiddleware");

const SECRET = process.env.JWT_SECRET;

/* =========================
   LOGIN
========================= */
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Email y contraseña requeridos" });

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {

        if (err) return res.status(500).json({ error: err });

        if (results.length === 0)
            return res.status(401).json({ message: "Usuario no encontrado" });

        const usuario = results[0];

        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida)
            return res.status(401).json({ message: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario.id },
            SECRET,
            { expiresIn: "8h" }
        );

        res.json({ token });
    });
});

/* =========================
   RECUPERAR CONTRASEÑA
========================= */
router.post("/forgot-password", (req, res) => {

    const { email } = req.body;

    if (!email)
        return res.status(400).json({ message: "Email requerido" });

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {

        if (err)
            return res.status(500).json({ message: err.message });

        if (results.length === 0)
            return res.status(404).json({ message: "Usuario no encontrado" });

        const usuario = results[0];

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 15 * 60 * 1000);

        db.query(
            "UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE id = ?",
            [token, expires, usuario.id],
            async (err2) => {

                if (err2)
                    return res.status(500).json({ message: "Error guardando token" });

                const link = `https://autopreimum.onrender.com/reset.html?token=${token}`;

                try {
                    await enviarEmail(
                        email,
                        "Recuperar contraseña",
                        `Haz click aquí para cambiar tu contraseña: ${link}`
                    );

                    res.json({ message: "Correo enviado" });

                } catch (error) {
                    console.error("ERROR REAL:", error);
                    res.status(500).json({ message: error.message });
                }
            }
        );
    });
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {

    const { token, newPassword } = req.body;

    if (!token || !newPassword)
        return res.status(400).json({ message: "Datos incompletos" });

    db.query(
        "SELECT * FROM usuarios WHERE reset_token = ? AND reset_expires > NOW()",
        [token],
        async (err, results) => {

            if (results.length === 0)
                return res.status(400).json({ message: "Token inválido o expirado" });

            const usuario = results[0];
            const hashed = await bcrypt.hash(newPassword, 10);

            db.query(
                "UPDATE usuarios SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
                [hashed, usuario.id]
            );

            res.json({ message: "Contraseña actualizada" });
        }
    );
});

/* =========================
   SOLICITUD DE REGISTRO
========================= */
router.post("/register-request", async (req, res) => {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
        return res.status(400).json({ message: "Datos incompletos" });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
        "INSERT INTO solicitudes_usuarios (nombre, email, password, estado) VALUES (?, ?, ?, 'pendiente')",
        [nombre, email, hashed]
    );

    res.json({ message: "Solicitud enviada. Espera aprobación." });
});

/* =========================
   LISTAR SOLICITUDES
   (cualquier usuario logueado)
========================= */
router.get("/solicitudes", verificarToken, (req, res) => {

    db.query(
        "SELECT id, nombre, email, created_at FROM solicitudes_usuarios WHERE estado = 'pendiente'",
        (err, results) => {
            res.json(results);
        }
    );
});

/* =========================
   APROBAR SOLICITUD
   (cualquier usuario logueado)
========================= */
router.post("/aprobar/:id", verificarToken, (req, res) => {

    const { id } = req.params;

    db.query(
        "SELECT * FROM solicitudes_usuarios WHERE id = ? AND estado = 'pendiente'",
        [id],
        (err, results) => {

            if (results.length === 0)
                return res.status(404).json({ message: "Solicitud no encontrada" });

            const solicitud = results[0];

            db.query(
                "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
                [solicitud.nombre, solicitud.email, solicitud.password]
            );

            db.query(
                "UPDATE solicitudes_usuarios SET estado = 'aprobado' WHERE id = ?",
                [id]
            );

            res.json({ message: "Usuario aprobado correctamente" });
        }
    );
});

module.exports = router;
