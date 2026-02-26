require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const applicationsRouter = require("./routes/applications");
const statsRouter = require("./routes/stats");
const configRouter = require("./routes/config");

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/applications", applicationsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/config", configRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Serve frontend static build in production
const frontendBuild = path.join(__dirname, "public");
const fs = require("fs");
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  // SPA fallback: serve index.html for non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendBuild, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found", status: 404 } });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

module.exports = app;
