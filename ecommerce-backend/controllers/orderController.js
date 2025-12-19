const Order = require("../models/Order");
const User = require("../models/User");

// CREATE ORDER
exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        const order = new Order({
            user: req.user._id,
            products,
            totalAmount,
            shippingAddress,
        });

        const createdOrder = await order.save();

        // Clear user cart after order
        const user = await User.findById(req.user._id);
        user.cart = [];
        await user.save();

        res.status(201).json(createdOrder);
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
