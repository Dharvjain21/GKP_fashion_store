// backend/server.js
// Beginner-friendly Express + MongoDB API for GKP (Guru Kripa Paridhan)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// --- Middleware ---
app.use(express.json());

// CORS: allow your Netlify frontend to call this API
// Keep it simple. You can set CLIENT_ORIGIN in Railway (recommended).
const clientOrigin = process.env.CLIENT_ORIGIN;
app.use(
  cors({
    origin: clientOrigin ? clientOrigin.replace(/\/$/, "") : "*",
  })
);

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ message: "GKP Backend API is running" });
});

// Products CRUD
app.use("/api/products", productRoutes);

// Optional: basic login (hardcoded credentials, no JWT)
app.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  const ADMIN_USER = "gurukripaparidhan123";
  const ADMIN_PASS = "greshadharv781621";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true, message: "Login successful" });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials" });
});

// --- Server + DB ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
