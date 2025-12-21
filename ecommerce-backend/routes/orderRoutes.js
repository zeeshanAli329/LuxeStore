const express = require("express");
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    createGuestOrder,
    testEmail
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

router.post("/", optionalAuth, createOrder);
router.get("/myorders", protect, getMyOrders);
router.post("/guest", createGuestOrder); // Public route
router.get("/test-email", protect, admin, testEmail); // Admin only test
router.get("/", protect, admin, getAllOrders);

module.exports = router;
