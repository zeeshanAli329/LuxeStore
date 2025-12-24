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
            required: true,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
