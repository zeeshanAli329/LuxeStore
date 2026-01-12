const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Changed from images array to single string
            required: true,
        },
        oldPrice: {
            type: Number,
            required: true,
        },
        newPrice: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: function () {
                return this.ctaType === "BUY_NOW";
            },
            default: 0,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
        isOnSale: {
            type: Boolean,
            default: false,
        },
        saleLabel: {
            type: String,
        },
        saleEndsAt: {
            type: Date,
        },
        isDeal: {
            type: Boolean,
            default: false,
        },
        dealLabel: {
            type: String,
        },
        dealEndsAt: {
            type: Date,
        },
        dealNote: {
            type: String,
        },
        images: {
            type: [String],
            default: []
        },
        video: {
            type: String,
            default: ""
        },
        colors: [String], // Array of available colors
        sizes: [String],  // Array of available sizes (String to handle "42", "XL", etc.)
        isBoutique: {
            type: Boolean,
            default: false,
        },
        ctaType: {
            type: String,
            enum: ["BUY_NOW", "BOOK_NOW"], // Determines if "Buy Now" or "Book Now" is shown
            default: "BUY_NOW",
        },
        designTimeMinDays: {
            type: Number,
        },
        designTimeMaxDays: {
            type: Number,
        },
        visitLocationText: {
            type: String,
        },
        visitLocationMapUrl: {
            type: String,
        },
        isOnSale: {
            type: Boolean,
            default: false,
        },
        saleLabel: {
            type: String,
        },
        saleEndsAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
