const app = require("./app");
const { verifyTransport } = require("./utils/mailer");

// Server - USED FOR LOCAL DEVELOPMENT ONLY
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Accessible on LAN/WAN at http://0.0.0.0:${PORT}`);
  await verifyTransport();
});
