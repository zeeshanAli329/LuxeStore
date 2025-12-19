const nodemailer = require("nodemailer");

// Check for required env vars
const requiredEnv = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "STORE_OWNER_EMAIL"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    console.warn(`[MAILER WARNING] Missing email env vars: ${missingEnv.join(", ")}. Email sending will be disabled.`);
}

// Build Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        // Force TLS if not secure port, or help with self-signed certs if needed (optional)
        // rejectUnauthorized: false 
    },
    logger: true, // Log to console
    debug: true,  // Include SMTP traffic in logs
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

// Verify Connection
exports.verifyTransport = async () => {
    if (missingEnv.length > 0) return;
    try {
        await transporter.verify();
        console.log("[MAILER] SMTP Connection Verified Successfully");
    } catch (error) {
        console.error("[MAILER] SMTP Connection Failed:", error.message);
    }
};

// Internal Send Helper
const sendEmail = async ({ to, subject, html, text, replyTo }) => {
    if (missingEnv.length > 0) {
        console.log("[MAILER] Skipped sending due to missing config.");
        return;
    }

    const from = process.env.SMTP_FROM || `Store <${process.env.SMTP_USER}>`;

    const mailOptions = {
        from, // verified sender
        to,   // recipient
        replyTo,
        subject,
        html,
        text: text || "Please view this email in an HTML compatible client.",
    };

    try {
        console.log(`[MAILER] Attempting send to ${to}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`[MAILER] Sent! MessageID: ${info.messageId} | Response: ${info.response}`);
        return info;
    } catch (error) {
        console.error("[MAILER] Send Failed:", {
            message: error.message,
            code: error.code,
            response: error.response,
        });
        // We do NOT throw here so order process continues, unless caller wants to handle it.
        // But for this use case, we just log.
    }
};

// Send Order Email
exports.sendOrderEmail = async (order, customerEmail) => {
    const adminEmail = process.env.STORE_OWNER_EMAIL;
    const itemsList = order.products.map(p => `
        <li>
            ${p.quantity} x <strong>${p.product}</strong><br/>
            ${p.unitPrice} PKR<br/>
            ${p.selectedSize ? `Size: ${p.selectedSize}, ` : ''} 
            ${p.selectedColor ? `Color: ${p.selectedColor}` : ''}
        </li>
    `).join('');

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Order #${order._id}</h2>
            <p><strong>Total:</strong> Rs ${order.totalAmount.toLocaleString()}</p>
            <p><strong>Method:</strong> ${order.paymentMethod}</p>
            <h3>Customer:</h3>
            <p>
                Name: ${order.guestInfo?.name || order.user?.name || "Guest"}<br/>
                Phone: ${order.shippingAddress?.phone || order.guestInfo?.phone}<br/>
                Address: ${order.shippingAddress?.address}, ${order.shippingAddress?.city}
            </p>
            <h3>Items:</h3>
            <ul>${itemsList}</ul>
            <p>Status: ${order.status}</p>
        </div>
    `;

    // 1. Send to Admin
    if (adminEmail) {
        await sendEmail({
            to: adminEmail,
            subject: `New Order Alert #${order._id}`,
            html: htmlContent,
            replyTo: customerEmail || order.guestInfo?.email // Reply to customer
        });
    }

    // 2. Send to Customer (if email exists)
    const targetEmail = customerEmail || order.guestInfo?.email;
    if (targetEmail) {
        await sendEmail({
            to: targetEmail,
            subject: `Order Confirmation #${order._id}`,
            html: `<p>Thank you for your order!</p>${htmlContent}`,
        });
    }
};

// Send Test Email
exports.sendTestEmail = async () => {
    const adminEmail = process.env.STORE_OWNER_EMAIL;
    if (!adminEmail) throw new Error("STORE_OWNER_EMAIL is not set");

    return sendEmail({
        to: adminEmail,
        subject: "SMTP Test Email",
        html: "<h1>It Works!</h1><p>Your SMTP configuration is correct.</p>",
        text: "It Works! Your SMTP configuration is correct."
    });
};
