const express = require("express");
const {
    registerUser,
    loginUser,
    getProfile,
    getCart,
    addToCart,
    removeFromCart,
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getAllUsers, // New controller
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Route: Get All Users
router.get("/", protect, admin, getAllUsers);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

// Cart Routes
router.get("/cart", protect, getCart);
router.post("/cart", protect, addToCart);
router.delete("/cart/:productId", protect, removeFromCart);

// Favorites Routes
router.get("/favorites", protect, getFavorites);
router.post("/favorites", protect, addToFavorites);
router.delete("/favorites/:productId", protect, removeFromFavorites);

module.exports = router;
