const Product = require("../models/product.model")
const slugify = require("slugify") // For generating slugs

// Get all products (Admin)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Create a new product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, storeId, ...rest } = req.body

    // Basic validation
    if (!name || !storeId) {
      return res.status(400).json({ message: "Product name and storeId are required." })
    }

    // Generate slug (handled by pre-save hook in model, but can be done here too if needed)
    const slug = slugify(name, { lower: true, strict: true })

    const newProduct = new Product({
      name,
      storeId,
      slug, // Assign the generated slug
      ...rest,
    })

    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: "Product with this name or SKU already exists.", error: err.message })
    }
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Get product by ID (Admin)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Update a product by ID (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { name, ...rest } = req.body
    const updateData = { ...rest }

    // If name is updated, regenerate slug
    if (name) {
      updateData.name = name
      updateData.slug = slugify(name, { lower: true, strict: true })
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }, // Return the updated document and run schema validators
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json(updatedProduct)
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(409).json({ message: "Product with this name or SKU already exists.", error: err.message })
    }
    res.status(500).json({ message: "Server error", error: err.message })
  }
}

// Delete a product by ID (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" })
    }
    res.json({ message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
}
