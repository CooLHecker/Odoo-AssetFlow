const express = require("express");
const cors = require("cors");
require("dotenv").config();

const healthRoutes = require("./routes/health.routes");
const assetsRoutes = require("./routes/assets.routes");
const bookingsRoutes = require("./routes/bookings.routes");
const notificationsRoutes = require("./routes/notifications.routes");
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

// Live modules
app.use("/api/assets", assetsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Feature modules — still stubbed, build these out next
app.use("/api/auth", stubRouter("auth"));
app.use("/api/departments", stubRouter("departments"));
app.use("/api/categories", stubRouter("asset-categories"));
app.use("/api/employees", stubRouter("employees"));
app.use("/api/allocations", stubRouter("allocations"));
app.use("/api/maintenance", stubRouter("maintenance"));
app.use("/api/audits", stubRouter("audits"));
app.use("/api/reports", stubRouter("reports"));

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
