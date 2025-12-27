const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        audience: {
            type: String,
            enum: ["admin", "user"],
            default: "admin"
        },
        type: {
            type: String,
            enum: ["ORDER_PLACED", "USER_REGISTERED", "CART_ADDED", "BOUTIQUE_BOOKED", "ORDER_STATUS_UPDATED", "NEW_PRODUCT"],
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
            bookingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BoutiqueBooking",
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
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
