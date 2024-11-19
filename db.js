const { Pool } = require('pg');

// Leer la URL de conexión desde las variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
