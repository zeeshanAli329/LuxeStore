const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Optional Auth Middleware
 * Populates req.user if a valid token is present.
 * Does NOT return an error if token is missing or invalid.
 */
const optionalAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            // If user found, req.user is set. If not found, it remains undefined.
        } catch (error) {
            // Silently fail auth for optional routes
            console.log("[Optional Auth] Invalid or expired token ignored.");
        }
    }

    next();
};

module.exports = optionalAuth;
