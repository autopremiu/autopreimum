const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { enviarEmail } = require("../utils/email");
const verificarToken = require("../middleware/authMiddleware");

const SECRET = process.env.JWT_SECRET;

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const result = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ message: "Usuario no encontrado" });

    const usuario = result.rows[0];

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida)
      return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =========================
   RECUPERAR CONTRASEÑA
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email requerido" });

    const result = await db.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    const usuario = result.rows[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE usuarios SET reset_token = $1, reset_expires = $2 WHERE id = $3",
      [token, expires, usuario.id]
    );

    const link = `https://autopreimum.onrender.com/reset.html?token=${token}`;

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
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword)
      return res.status(400).json({ message: "Datos incompletos" });

    const result = await db.query(
      "SELECT * FROM usuarios WHERE reset_token = $1 AND reset_expires > NOW()",
      [token]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Token inválido o expirado" });

    const usuario = result.rows[0];
    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE usuarios SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2",
      [hashed, usuario.id]
    );

    res.json({ message: "Contraseña actualizada" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   SOLICITUD DE REGISTRO
========================= */
router.post("/register-request", async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ message: "Datos incompletos" });

    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO solicitudes_usuarios (nombre, email, password, estado) VALUES ($1, $2, $3, 'pendiente')",
      [nombre, email, hashed]
    );

    res.json({ message: "Solicitud enviada. Espera aprobación." });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   LISTAR SOLICITUDES
========================= */
router.get("/solicitudes", verificarToken, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, nombre, email, created_at FROM solicitudes_usuarios WHERE estado = 'pendiente'"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   APROBAR SOLICITUD
========================= */
router.post("/aprobar/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "SELECT * FROM solicitudes_usuarios WHERE id = $1 AND estado = 'pendiente'",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    const solicitud = result.rows[0];

    await db.query(
      "INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)",
      [solicitud.nombre, solicitud.email, solicitud.password]
    );

    await db.query(
      "UPDATE solicitudes_usuarios SET estado = 'aprobado' WHERE id = $1",
      [id]
    );

    res.json({ message: "Usuario aprobado correctamente" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;