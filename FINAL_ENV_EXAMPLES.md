# ==========================================
# 1. FRONTEND (.env.local or Vercel Config)
# ==========================================

# CRITICAL: Address of your deployed backend
# MUST start with https://
# MUST be set in Vercel Project Settings > Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://your-backend-app.onrender.com/api

# ==========================================
# 2. BACKEND (Render/Railway Config)
# ==========================================

# Port (usually provided by host, but set 5000 for local)
PORT=5000

# MongoDB Database URL
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ecommerce

# JWT Secret for Auth
JWT_SECRET=your_super_secret_key_123

# Allow your Frontend to access Backend (CORS)
# Add your Vercel domains here
FRONTEND_URL=https://luxe-store-gray.vercel.app

# Email Settings (for Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
