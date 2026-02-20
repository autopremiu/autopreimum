const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

const DB_NAME = process.env.DB_NAME;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
});

const filePath = path.join(__dirname, "autopremium.sql");
console.log("Buscando archivo en:", filePath);

const sql = fs.readFileSync(filePath, "utf8");

connection.connect((err) => {
    if (err) {
        console.error("Error conexión:", err);
        return;
    }

    connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`, (err) => {
        if (err) {
            console.error("Error creando DB:", err);
            return;
        }

        connection.query(`USE \`${DB_NAME}\`;`, (err) => {
            if (err) {
                console.error("Error seleccionando DB:", err);
                return;
            }

            connection.query(sql, (err) => {
                if (err) {
                    console.error("Error importando:", err);
                } else {
                    console.log("Base importada correctamente 🚀");
                }
                connection.end();
            });
        });
    });
});