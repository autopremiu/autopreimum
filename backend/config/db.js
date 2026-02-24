const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("🔥 Conectado a PostgreSQL Supabase"))
  .catch(err => console.error("❌ Error conexión PostgreSQL:", err));

module.exports = pool;