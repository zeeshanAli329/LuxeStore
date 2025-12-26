const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus } = require("../controllers/boutiqueController");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");


// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `boutique-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only images (JPG, PNG) are allowed"));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Public route
router.post("/book", createBooking);



// Admin routes
router.get("/bookings", protect, admin, getBookings);
router.patch("/bookings/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
