const Notification = require("../models/Notification");

// GET NOTIFICATIONS (Admin or User)
exports.getNotifications = async (req, res) => {
    try {
        const { unreadOnly, since } = req.query;
        let query = {};

        // Audience filter
        if (req.user && req.user.role === "admin") {
            // Admin sees admin notifications
            query.audience = "admin";
        } else {
            // User sees their own notifications
            query.audience = "user";
            query.userId = req.user._id;
        }

        if (unreadOnly === "1") {
            query.isRead = false;
        }

        if (since) {
            query.createdAt = { $gt: new Date(since) };
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50); // Limit to latest 50

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET UNREAD COUNT
exports.getUnreadCount = async (req, res) => {
    try {
        let query = { isRead: false };

        if (req.user && req.user.role === "admin") {
            query.audience = "admin";
        } else {
            query.audience = "user";
            query.userId = req.user._id;
        }

        const count = await Notification.countDocuments(query);
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// MARK ALL AS READ
exports.markAllRead = async (req, res) => {
    try {
        let query = { isRead: false };

        if (req.user && req.user.role === "admin") {
            query.audience = "admin";
        } else {
            query.audience = "user";
            query.userId = req.user._id;
        }

        await Notification.updateMany(query, { $set: { isRead: true } });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// MARK ONE AS READ
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Check ownership/permissions
        if (notification.audience === "user" && notification.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        if (notification.audience === "admin" && req.user.role !== "admin") {
            return res.status(401).json({ message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
