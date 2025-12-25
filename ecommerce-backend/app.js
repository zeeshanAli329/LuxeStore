const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://luxe-store-gray.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    const isVercel = origin && (origin.endsWith(".vercel.app") || origin.includes("vercel.app"));
    const isLocal = origin && (origin.includes("localhost") || origin.includes("127.0.0.1"));
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || isVercel || isLocal;

    if (!origin || isAllowed) {
      return callback(null, true);
    }
    console.warn("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Safe Preflight Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isVercel = origin && (origin.endsWith(".vercel.app") || origin.includes("vercel.app"));
  const isLocal = origin && (origin.includes("localhost") || origin.includes("127.0.0.1"));
  const isAllowed = allowedOrigins.indexOf(origin) !== -1 || isVercel || isLocal;

  if (isAllowed) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;
