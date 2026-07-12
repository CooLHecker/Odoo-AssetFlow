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
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: "connected", result: rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", db: "not connected", message: err.message });
  }
});

module.exports = router;
