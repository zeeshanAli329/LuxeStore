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

        // Send Email Async
        const { sendOrderEmail } = require("../utils/mailer");
        sendOrderEmail(order, req.user.email);

        // Clear Cart
        await User.findByIdAndUpdate(req.user._id, { cart: [] });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

        // Send Email Async
        const { sendOrderEmail } = require("../utils/mailer");
        if (guestInfo.email) {
            sendOrderEmail(order, guestInfo.email);
        } else {
            // Just admin
            sendOrderEmail(order, null);
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
