const mysql = require("mysql2/promise");
const dns = require("dns");
require("dotenv").config();

// Aiven hostnames resolve to both an IPv4 (A) and IPv6 (AAAA) address. Node
// 18+ prefers IPv6 by default when both exist, and Vercel's serverless
// network frequently can't route that IPv6 address at all — the connection
// attempt just hangs until it hits ECONNECT_TIMEOUT (ETIMEDOUT). Forcing
// IPv4-first resolution avoids that dead end entirely.
dns.setDefaultResultOrder("ipv4first");

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
  connectTimeout: 20000,
  ssl:
  String(process.env.DB_SSL).toLowerCase() === "true"
    ? { rejectUnauthorized: false }
    : undefined,
});

module.exports = pool;
