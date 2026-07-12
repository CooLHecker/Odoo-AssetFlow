const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET /api/health -> basic liveness check (does not require DB)
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "AssetFlow API",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/health/db -> verifies MySQL connectivity
router.get("/db", async (req, res) => {
  const config = {
    host: process.env.DB_HOST || "(not set)",
    port: process.env.DB_PORT || "(not set, defaults to 3306)",
    user: process.env.DB_USER || "(not set)",
    database: process.env.DB_NAME || "(not set)",
    ssl: process.env.DB_SSL || "(not set)",
    passwordSet: !!process.env.DB_PASSWORD,
  };
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: "connected", result: rows[0], config });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "error",
        db: "not connected",
        message: err.message,
        config,
      });
  }
});

module.exports = router;
