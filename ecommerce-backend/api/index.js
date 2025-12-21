const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
    try {
        await connectDB();
        return app(req, res);
    } catch (error) {
        console.error("Critical Database Connection Failure:", error);
        res.status(500).json({
            error: "Database Connectivity Error",
            message: "Server failed to connect to the database. Please try again later."
        });
    }
};
