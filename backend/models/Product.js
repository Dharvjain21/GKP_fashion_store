// backend/models/Product.js
// Mongoose model for products in the store

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    // Optional: used for showing discount badges/strikethrough price
    type: Number,
    required: false,
  },
  image: {
    // For now: store an image URL.
    // Later (optional): you can support uploads and store the uploaded file URL here.
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
