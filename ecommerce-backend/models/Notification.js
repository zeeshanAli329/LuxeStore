const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["ORDER_PLACED", "USER_REGISTERED", "CART_ADDED"],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        meta: {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
