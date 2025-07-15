const mongoose = require("mongoose")

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for products"))
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1) // Exit process with failure
  })

module.exports = mongoose
