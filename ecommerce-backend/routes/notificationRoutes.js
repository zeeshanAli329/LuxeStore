



const express = require("express");
const {
    getNotifications,
    getUnreadCount,
    markAllRead,
    markAsRead,
} = require("../controllers/notificationController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin Routes
router.get("/admin", protect, admin, getNotifications);
router.get("/admin/count", protect, admin, getUnreadCount);
router.patch("/admin/mark-all-read", protect, admin, markAllRead);

// User Routes (Me)
router.get("/me", protect, getNotifications);
router.get("/me/count", protect, getUnreadCount);
router.patch("/me/mark-all-read", protect, markAllRead);


// Mark single read (shared)
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
