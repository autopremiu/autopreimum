const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // tu contraseña
    database: "autopremium",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Pool MySQL creado correctamente");

module.exports = pool;
