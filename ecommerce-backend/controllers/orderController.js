const Order = require("../models/Order");
const User = require("../models/User");

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress } = req.body;
        console.log("Create Order Request:", { productsLength: products?.length, totalAmount, shippingAddress, user: req.user?._id });

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        // Validate Totals and Prices
        if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        // Validate Products
        const validProducts = products.every(p => p.unitPrice && !isNaN(Number(p.unitPrice)));
        if (!validProducts) {
            return res.status(400).json({ message: "Invalid product prices detected" });
        }

        // Validate Phone
        if (!shippingAddress || !shippingAddress.phone) {
            return res.status(400).json({ message: "Phone number is required for delivery" });
        }

        const order = await Order.create({
            user: req.user ? req.user._id : undefined, // Check if user exists
            products: products.map(item => ({
                product: item.product,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                image: item.image,
                unitPrice: item.unitPrice
            })),
            totalAmount,
            shippingAddress,
            paymentMethod: "COD",
            paymentStatus: "Pending",
        });

        // Send Email (Non-blocking but awaited for safety in some serverless contexts)
        try {
            const { sendOrderEmail } = require("../utils/mailer");
            const customerEmail = req.user ? req.user.email : (req.body.guestInfo?.email || null);
            await sendOrderEmail(order, customerEmail);
        } catch (mailError) {
            console.error("[Order] Email notification failed:", mailError.message);
        }

        // Clear Cart (only for logged in users) - Non-blocking
        if (req.user) {
            try {
                await User.findByIdAndUpdate(req.user._id, { cart: [] });
            } catch (cartError) {
                console.error("[Order] Cart cleanup failed:", cartError.message);
            }
        }

        return res.status(201).json(order);
    } catch (error) {
        console.error("Order Creation Error Stack:", error.stack);

        // Handle Mongoose Validation Errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation Failed",
                message: error.message,
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        // Handle Mongoose Cast Errors (Invalid IDs)
        if (error.name === "CastError") {
            return res.status(400).json({
                error: "Invalid ID Format",
                message: `Invalid format for field: ${error.path}`,
                details: error.reason?.message || error.message
            });
        }

        return res.status(500).json({
            error: "Order creation failed",
            message: error.message
        });
    }
};

// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "id name email");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE GUEST ORDER
exports.createGuestOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress, guestInfo } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        if (!guestInfo || !guestInfo.name || !guestInfo.phone) {
            return res.status(400).json({ message: "Guest name and phone are required" });
        }

        // Validate Totals
        if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        const validProducts = products.every(p => p.unitPrice && !isNaN(Number(p.unitPrice)));
        if (!validProducts) {
            return res.status(400).json({ message: "Invalid product prices detected" });
        }

        const order = await Order.create({
            // user: undefined // Explicitly undefined for guest
            products: products.map(item => ({
                product: item.product,
                quantity: item.quantity,
                selectedColor: item.selectedColor,
                selectedSize: item.selectedSize,
                image: item.image,
                unitPrice: item.unitPrice
            })),
            totalAmount,
            shippingAddress,
            guestInfo,
            paymentMethod: "COD",
            paymentStatus: "Pending",
        });

        // Send Email - Non-blocking
        try {
            const { sendOrderEmail } = require("../utils/mailer");
            const customerEmail = guestInfo.email || null;
            await sendOrderEmail(order, customerEmail);
        } catch (mailError) {
            console.error("[Order] Guest Email notification failed:", mailError.message);
        }

        return res.status(201).json(order);
    } catch (error) {
        console.error("Guest Order Creation Error Stack:", error.stack);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: "Validation Failed",
                message: error.message
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                error: "Invalid ID Format",
                message: `Invalid format for field: ${error.path}`
            });
        }

        return res.status(500).json({
            error: "Guest order failed",
            message: error.message
        });
    }
};

// TEST EMAIL
exports.testEmail = async (req, res) => {
    try {
        const { sendTestEmail } = require("../utils/mailer");
        await sendTestEmail();
        res.json({ message: "Test email sent to owner address." });
    } catch (err) {
        console.error("Test email failed:", err);
        res.status(500).json({ error: err.message });
    }
};
