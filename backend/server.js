const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const verificarToken = require("./middleware/authMiddleware");

const clientesRoutes = require("./routes/clientes");
const vehiculosRoutes = require("./routes/vehiculos");
const serviciosRoutes = require("./routes/servicios");
const authRoutes = require("./routes/auth");
const encuestasRoutes = require("./routes/encuestas");

const app = express();

/* ==============================
   MIDDLEWARES GENERALES
============================== */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ==============================
   SERVIR FRONTEND
============================== */

app.use(express.static(path.join(__dirname, "public")));

/* ==============================
   RUTAS API
============================== */

// 🔓 Ruta pública (login)
app.use("/api/auth", authRoutes);

// 🔐 Rutas protegidas con JWT
app.use("/api/clientes",  clientesRoutes);
app.use("/api/vehiculos",  vehiculosRoutes);
app.use("/api/servicios",  serviciosRoutes);

// (si quieres que encuestas también esté protegida, agrégale verificarToken)
app.use("/encuesta", encuestasRoutes);

/* ==============================
   MANEJO DE ERRORES 404
============================== */

app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

/* ==============================
   INICIAR SERVIDOR
============================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
