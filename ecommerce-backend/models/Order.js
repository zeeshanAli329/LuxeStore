const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Optional for Guest Checkout
        },
        guestInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                selectedColor: String,
                selectedSize: String,
                image: String,     // Snapshot of product image at time of order
                unitPrice: Number, // Snapshot of price at time of order
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
            default: "Pending",
        },
        paymentMethod: {
            type: String,
            default: "COD",
            enum: ["COD"], // Strictly COD for now
        },
        paymentStatus: {
            type: String,
            default: "Pending",
            enum: ["Pending", "Paid", "Failed"],
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true, default: "Pakistan" },
            phone: { type: String, required: true },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
