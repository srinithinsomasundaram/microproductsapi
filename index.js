require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin.routes");
const storeRoutes = require("./routes/store.routes");

const app = express();
const PORT = process.env.PORT || 5005;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a sub-router to mount under /product-api
const productRouter = express.Router();

// Health check
productRouter.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Product microservice running!",
    timestamp: new Date().toISOString(),
  });
});

// Mount your route files
productRouter.use("/api/admin", adminRoutes);
productRouter.use("/api/store", storeRoutes);

// Fallback for undefined routes under /product-api
productRouter.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Mount the sub-router at /product-api
app.use("/product-api", productRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Product service running on port ${PORT}`)
);
