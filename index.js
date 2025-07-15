require("dotenv").config()
const express = require("express")
const mongoose = require("./config/db")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 5005

// Middlewares
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Health check (IMPORTANT: Put this first!)
app.get("/product-api/api/health", (req, res) => {
  res.json({
    status: "✅ Product microservice running!",
    timestamp: new Date().toISOString(),
  })
})

// Route files
const adminRoutes = require("./routes/admin.routes")
const storeRoutes = require("./routes/store.routes")

// Use routes under clean prefixes
app.use("/product-api/api/admin", adminRoutes)
app.use("/product-api/api/store", storeRoutes)

// Fallback
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
app.listen(PORT, () =>
  console.log(`🚀 Product service running on port ${PORT}`)
)
