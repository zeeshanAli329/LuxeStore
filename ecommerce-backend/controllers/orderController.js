const Order = require("../models/Order");
const User = require("../models/User");

// CREATE ORDER (Unified for User & Guest)
exports.createOrder = async (req, res) => {
    try {
        const { products, totalAmount, shippingAddress, guestInfo } = req.body;

        // Diagnostic Logging for Production
        console.log("--- CREATE ORDER DIAGNOSTICS ---");
        console.log("UserID:", req.user?._id || "Guest");
        console.log("Payload Keys:", Object.keys(req.body));
        console.log("Products Count:", products?.length);
        console.log("Shipping Phone:", shippingAddress?.phone);

        // Validation
        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        const validProducts = products.every(p => p.unitPrice && !isNaN(Number(p.unitPrice)));
        if (!validProducts) {
            return res.status(400).json({ message: "Invalid product prices detected" });
        }

        // Validate Shipping Address
        if (!shippingAddress || !shippingAddress.address || !shippingAddress.phone) {
            return res.status(400).json({ message: "Complete shipping address and phone are required" });
        }

        // Stock Check & Variant Validation
        const Product = require("../models/Product");
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            // Check Stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.title}. Only ${product.stock} left.` });
            }

            // Variant Validation (If product has sizes/colors, selection is required)
            if (product.sizes && product.sizes.length > 0 && !item.selectedSize) {
                return res.status(400).json({ message: `Please select a size for ${product.title}` });
            }
            if (product.colors && product.colors.length > 0 && !item.selectedColor) {
                return res.status(400).json({ message: `Please select a color for ${product.title}` });
            }
        }

        // Create the Order
        const order = await Order.create({
            user: req.user ? req.user._id : undefined,
            guestInfo: req.user ? undefined : guestInfo,
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

        // Reduce Stock
        if (order) {
            for (const item of products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }


        console.log("[Order] Created Successfully:", order._id);

        // CREATE NOTIFICATION (Non-blocking)
        try {
            const Notification = require("../models/Notification");
            await Notification.create({
                type: "ORDER_PLACED",
                message: `New Order #${order._id.toString().slice(-6)} placed by ${order.shippingAddress.fullName}`,
                meta: {
                    orderId: order._id,
                    userId: req.user ? req.user._id : undefined
                }
            });
        } catch (notifError) {
            console.error("[Order] Notification creation failed:", notifError.message);
        }

        // Send Email (Non-blocking)
        try {
            const { sendOrderEmail } = require("../utils/mailer");
            const customerEmail = req.user ? req.user.email : (guestInfo?.email || null);
            await sendOrderEmail(order, customerEmail);
        } catch (mailError) {
            console.error("[Order] Email notification failed:", mailError.message);
        }

        // Clear Cart (only for logged-in users)
        if (req.user) {
            try {
                await User.findByIdAndUpdate(req.user._id, { cart: [] });
            } catch (cartError) {
                console.error("[Order] Cart cleanup failed:", cartError.message);
            }
        }

        return res.status(201).json(order);
    } catch (error) {
        console.error("CRITICAL ORDER ERROR:", error.stack);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                error: "Validation Failed",
                message: messages.join(", ")
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                error: "Database Link Error",
                message: `Invalid ID provided for ${error.path}`
            });
        }

        return res.status(500).json({
            error: "Internal Server Error",
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

// UPDATE ORDER STATUS (ADMIN)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save({ validateBeforeSave: false });

        res.json(order);
    } catch (error) {
        console.error("Update Order Status Error:", error);
        res.status(500).json({ message: error.message });
    }
};


// DEPRECATED: Points to unified createOrder
exports.createGuestOrder = async (req, res) => {
    return exports.createOrder(req, res);
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
