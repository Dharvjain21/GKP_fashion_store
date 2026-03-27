// backend/routes/productRoutes.js
// CRUD API routes for products

const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Helper: format MongoDB document for the frontend
// Your React app currently expects `id` (not `_id`).
function toClientProduct(doc) {
  const obj = doc.toObject({ versionKey: false });
  obj.id = obj._id.toString();
  delete obj._id;
  return obj;
}

// GET /api/products -> fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products.map(toClientProduct));
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST /api/products -> add product
router.post("/", async (req, res) => {
  try {
    const { name, price, image, description, category } = req.body || {};

    // Basic validation (beginner friendly)
    if (!name || price === undefined || !image || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await Product.create({
      name,
      price,
      image,
      description,
      category,
    });

    return res.status(201).json(toClientProduct(newProduct));
  } catch (err) {
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// PUT /api/products/:id -> update product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, description, category } = req.body || {};

    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, image, description, category },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(toClientProduct(updated));
  } catch (err) {
    return res.status(500).json({ message: "Failed to update product" });
  }
});

// DELETE /api/products/:id -> delete product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

module.exports = router;
