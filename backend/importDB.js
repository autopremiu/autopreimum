const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // ahora = railway
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
});

const filePath = path.join(__dirname, "autopremium.sql");
console.log("Importando en base:", process.env.DB_NAME);

const sql = fs.readFileSync(filePath, "utf8");

connection.query(sql, (err) => {
    if (err) console.error("Error importando:", err);
    else console.log("Base importada correctamente 🚀");
    connection.end();
});