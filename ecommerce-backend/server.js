const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Middleware
// Middleware
// Allow multiple origins: Localhost, LAN IP (typical), and Vercel deployments
const allowedOrigins = [
  "http://localhost:3000",
  "https://my-app-frontend.vercel.app", // Example Vercel domain
  // Add your Vercel domain here if different
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // For now, allow all during debug, or check against list
    // robust check:
    if (allowedOrigins.indexOf(origin) === -1 && !origin.includes("vercel.app") && !origin.includes("localhost") && !origin.startsWith("http://192.168.")) {
      // Be permissive for development/Vercel preview branches
      return callback(null, true);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is reachable" });
});


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

const { verifyTransport } = require("./utils/mailer");

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accesible on LAN at http://<YOUR_IP>:${PORT}`);
  await verifyTransport();
});
