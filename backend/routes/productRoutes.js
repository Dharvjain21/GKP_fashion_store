// backend/routes/productRoutes.js
// CRUD API routes for products

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const Product = require("../models/Product");

const router = express.Router();

// Multer: store file in memory (buffer) so we can upload directly to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Cloudinary config (use Railway environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function cloudinaryReady() {
  return (
    !!process.env.CLOUDINARY_CLOUD_NAME &&
    !!process.env.CLOUDINARY_API_KEY &&
    !!process.env.CLOUDINARY_API_SECRET
  );
}

// Upload a file buffer to Cloudinary, return the hosted image URL
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "gkp-products",
        resource_type: "image",
        ...options,
      },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, originalPrice, image } = req.body || {};

    // If user uploaded a file, upload it to Cloudinary and use the secure URL
    let imageUrl = typeof image === "string" ? image : "";
    if (req.file) {
      if (!cloudinaryReady()) {
        return res.status(500).json({ message: "Cloudinary env vars are missing" });
      }

      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice === undefined || originalPrice === "" ? undefined : Number(originalPrice);

    // Basic validation (beginner friendly)
    if (!name || Number.isNaN(numericPrice) || !imageUrl || !description || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await Product.create({
      name,
      price: numericPrice,
      originalPrice: Number.isFinite(numericOriginalPrice) ? numericOriginalPrice : undefined,
      image: imageUrl,
      description,
      category,
    });

    return res.status(201).json(toClientProduct(newProduct));
  } catch (err) {
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// PUT /api/products/:id -> update product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, originalPrice, image } = req.body || {};

    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Keep existing image unless new upload or a new URL is provided
    let imageUrl = existing.image;
    if (typeof image === "string" && image.trim()) {
      imageUrl = image.trim();
    }
    if (req.file) {
      if (!cloudinaryReady()) {
        return res.status(500).json({ message: "Cloudinary env vars are missing" });
      }

      const result = await uploadBufferToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const numericPrice = price === undefined || price === "" ? undefined : Number(price);
    const numericOriginalPrice = originalPrice === undefined || originalPrice === "" ? undefined : Number(originalPrice);

    if (numericPrice !== undefined && Number.isNaN(numericPrice)) {
      return res.status(400).json({ message: "Invalid price" });
    }
    if (numericOriginalPrice !== undefined && Number.isNaN(numericOriginalPrice)) {
      return res.status(400).json({ message: "Invalid originalPrice" });
    }

    if (name !== undefined) existing.name = name;
    if (numericPrice !== undefined) existing.price = numericPrice;
    existing.originalPrice = Number.isFinite(numericOriginalPrice) ? numericOriginalPrice : undefined;
    if (description !== undefined) existing.description = description;
    if (category !== undefined) existing.category = category;
    existing.image = imageUrl;

    const saved = await existing.save();

    return res.json(toClientProduct(saved));
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
