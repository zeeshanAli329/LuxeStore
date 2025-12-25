const express = require("express");
const {
    getNotifications,
    getUnreadCount,
    markAllRead,
    markAsRead,
} = require("../controllers/notificationController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// All notification routes are admin-only
router.use(protect, admin);

router.get("/", getNotifications);
router.get("/count", getUnreadCount);
router.patch("/mark-all-read", markAllRead);
router.patch("/:id/read", markAsRead);

module.exports = router;
