// importDB.js
const fs = require("fs");
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

const sql = fs.readFileSync("autopremium.sql", "utf8");

pool.query(sql, (err) => {
    if (err) {
        console.error("Error importando:", err);
    } else {
        console.log("Base importada correctamente 🚀");
    }
    process.exit();
});