const Notification = require("../models/Notification");

// GET ALL NOTIFICATIONS
exports.getNotifications = async (req, res) => {
    try {
        const { unreadOnly } = req.query;
        let query = {};
        if (unreadOnly === "1") {
            query.isRead = false;
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
        const count = await Notification.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// MARK ALL AS READ
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// MARK ONE AS READ
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { isRead: true } },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
