const Product = require("../models/Product");
const Notification = require("../models/Notification");
const BoutiqueBooking = require("../models/BoutiqueBooking");

// @desc    Create a new boutique booking request
// @route   POST /api/boutique/book
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const { productId, productName, customerName, phone, city, notes, requiredDate } = req.body;

        if (!productId || !productName || !customerName || !phone || !requiredDate) {
            return res.status(400).json({ message: "Please provide all required fields (productId, productName, customerName, phone, requiredDate)" });
        }

        // Fetch product to get price for 60% calculation (optional info for admin)
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const totalPrice = product.newPrice || product.price;
        // Advance amount is no longer mandatory for booking creation in this simplified flow
        const advancePaidAmount = 0;

        const booking = new BoutiqueBooking({
            productId,
            productName,
            customerName,
            phone,
            city,
            notes,
            requiredDate: new Date(requiredDate),
            totalPrice,
            advancePaidAmount,
            status: "New"
        });


        const savedBooking = await booking.save();

        // Create Admin Notification
        await Notification.create({
            type: "BOUTIQUE_BOOKED",
            audience: "admin",
            message: `New boutique booking received for ${productName} from ${customerName}`,
            meta: {
                userId: req.user ? req.user._id : null,
                bookingId: savedBooking._id,
                productId: productId
            }
        });

        res.status(201).json({ success: true, data: savedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get all boutique bookings
// @route   GET /api/boutique/bookings
// @access  Admin
exports.getBookings = async (req, res) => {
    try {
        const bookings = await BoutiqueBooking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update boutique booking status
// @route   PATCH /api/boutique/bookings/:id/status
// @access  Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate Status
        const allowedStatuses = ["New", "Contacted", "Confirmed", "Delivered", "Cancelled", "Advance Paid"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const booking = await BoutiqueBooking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = status;
        const updatedBooking = await booking.save({ validateBeforeSave: false });
        res.status(200).json(updatedBooking);
    } catch (error) {
        console.error("Boutique Status Update Error:", error);
        res.status(500).json({ message: error.message || "Failed to update status" });
    }
};
