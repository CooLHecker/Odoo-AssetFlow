const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health.routes");
const stubRouter = require("./routes/stub.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root
app.get("/", (req, res) => {
  res.json({ message: "AssetFlow API is running", docs: "/api/health" });
});

// Core
app.use("/api/health", healthRoutes);

// Feature modules — stubbed for now, build these out one by one
app.use("/api/auth", stubRouter("auth"));
app.use("/api/departments", stubRouter("departments"));
app.use("/api/categories", stubRouter("asset-categories"));
app.use("/api/employees", stubRouter("employees"));
app.use("/api/assets", stubRouter("assets"));
app.use("/api/allocations", stubRouter("allocations"));
app.use("/api/bookings", stubRouter("bookings"));
app.use("/api/maintenance", stubRouter("maintenance"));
app.use("/api/audits", stubRouter("audits"));
app.use("/api/reports", stubRouter("reports"));
app.use("/api/notifications", stubRouter("notifications"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
