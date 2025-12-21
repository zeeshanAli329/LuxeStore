const mongoose = require("mongoose");

/**
 * Global cache for MongoDB connection across serverless function invocations.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            serverSelectionTimeoutMS: 10000, // 10s timeout to avoid buffering issues
            socketTimeoutMS: 45000, // 45s for long queries
        };

        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
            console.log("MongoDB Connected (New Connection Created)");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;
