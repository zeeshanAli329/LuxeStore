const app = require("./app");
const { verifyTransport } = require("./utils/mailer");
const connectDB = require("./config/db");

// Server - USED FOR LOCAL DEVELOPMENT ONLY
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", async () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Accessible on LAN/WAN at http://0.0.0.0:${PORT}`);
      await verifyTransport();
    });
  } catch (error) {
    console.error("Failed to start local server:", error);
    process.exit(1);
  }
}

startServer();
