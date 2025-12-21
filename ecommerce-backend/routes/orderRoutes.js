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
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
