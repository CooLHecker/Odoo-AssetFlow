const mysql = require("mysql2/promise");
require("dotenv").config();

// Connection pool - reused across requests (important for serverless on Vercel,
// since a fresh pool per invocation would exhaust the DB connection limit)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

module.exports = pool;
