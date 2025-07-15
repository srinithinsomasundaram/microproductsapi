require("dotenv").config()
const express = require("express")
const mongoose = require("./config/db") // This will connect to MongoDB
const cors = require("cors")
const bodyParser = require("body-parser") // Added body-parser as it was in npm install

const app = express()

// Middleware
app.use(cors())
app.use(express.json()) // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded

// Import routes
const adminRoutes = require("./routes/admin.routes")
const storeRoutes = require("./routes/store.routes")

// Use routes
app.use("/api/admin/products", adminRoutes)
app.use("/api/store", storeRoutes)

// Basic route for health check
app.get("/", (req, res) => {
  res.send("Product microservice is running!")
})

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Something broke!")
})

const PORT = process.env.PORT || 5005
app.listen(PORT, () => console.log(`Product service running on port ${PORT}`))
