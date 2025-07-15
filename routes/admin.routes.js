const express = require("express")
const router = express.Router()
const controller = require("../controllers/product.controller")
const checkApiKey = require("../middlewares/apiKey.middleware")

// Apply API key middleware to all admin routes
router.use(checkApiKey)

// Admin product routes
router.get("/products", controller.getAllProducts)
router.post("/products", controller.createProduct)
router.get("/:id", controller.getProductById)
router.put("/:id", controller.updateProduct)
router.delete("/:id", controller.deleteProduct)
  router.get("/test", (req, res) => {
  res.send("Admin route working ✅")
})


module.exports = router
