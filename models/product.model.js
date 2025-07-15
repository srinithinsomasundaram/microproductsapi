const mongoose = require("mongoose")
const slugify = require("slugify") // Import slugify

const variantSchema = new mongoose.Schema({
  name: String,
  options: [String],
  price: Number,
  stock: Number,
  sku: String,
  images: [String],
  thumbnail: String,
  isActive: Boolean,
})

const productSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    sku: { type: String, unique: true },
    category: String,
    tags: [String],
    shortDescription: String,
    description: String,
    price: Number,
    hsnCode: String,
    taxPercentage: Number,
    stock: Number,
    lowStockAlert: { type: Number, default: 5 },
    allowBackorders: Boolean,
    thumbnail: String,
    gallery: [String],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    shippingClass: String,
    metaTitle: String,
    metaDescription: String,
    offer: String,
    hasVariants: Boolean,
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
    isFeatured: Boolean,
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    seoKeywords: [String],
    status: { type: String, default: "draft" },
  },
  { timestamps: true },
)

// Pre-save hook to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model("Product", productSchema)
