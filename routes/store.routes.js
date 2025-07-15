const express = require("express")
const router = express.Router()
const Product = require("../models/product.model")

// Get all active products for a specific store
router.get("/:storeId/products", async (req, res) => {
  try {
    const products = await Product.find({
      storeId: req.params.storeId,
      isActive: true, // Only fetch active products for storefront
    })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Get a single product by ID for a specific store
router.get("/:storeId/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      storeId: req.params.storeId,
      isActive: true, // Ensure product is active
    })
    if (product) {
      // Increment views count
      product.views++
      await product.save()
      res.json(product)
    } else {
      res.status(404).json({ message: "Product not found or not active for this store" })
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

// Search products for a specific store
router.get("/:storeId/search", async (req, res) => {
  try {
    const { q } = req.query // Get the search query from query parameters
    const storeId = req.params.storeId

    if (!q) {
      return res.status(400).json({ message: "Search query 'q' is required." })
    }

    // Build a search query using regex for partial matching on name, description, tags, category
    const searchCriteria = {
      storeId: storeId,
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } }, // Case-insensitive search
        { shortDescription: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { seoKeywords: { $regex: q, $options: "i" } },
      ],
    }

    const products = await Product.find(searchCriteria)
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})

module.exports = router
