const mongoose = require("mongoose");

const boutiqueBookingSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        city: {
            type: String,
        },
        notes: {
            type: String,
        },
        requiredDate: {
            type: Date,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        advancePaidAmount: {
            type: Number,
        },
        paymentScreenshot: {
            type: String,
        },

        status: {
            type: String,
            enum: ["New", "Advance Paid", "Confirmed", "Delivered", "Cancelled"],
            default: "New",
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("BoutiqueBooking", boutiqueBookingSchema);
