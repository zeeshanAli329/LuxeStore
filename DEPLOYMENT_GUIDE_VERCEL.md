# Production Deployment Guide (Vercel & Mobile)

To make your app work on the deployed Vercel URL (e.g. `https://luxe-store-gray.vercel.app`) and on Mobile:

## 1. Backend MUST be Deployed
You cannot use `http://localhost:5000` for a site deployed on Vercel. Vercel runs in the cloud, it cannot see your laptop's localhost.
**You must deploy your backend** to a service like:
- Render
- Railway
- Heroku
- Fly.io

## 2. Configure Vercel Environment Variables
1. Go to your Vercel Project Dashboard.
2. Click **Settings** -> **Environment Variables**.
3. Add a new variable:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://<YOUR_DEPLOYED_BACKEND_URL>/api` 
     *(e.g., `https://luxe-store-backend.onrender.com/api`)*
4. **IMPORTANT**: You must **Redeploy** your frontend for this change to take effect! (Go to Deployments -> Redeploy).

## 3. Verify Connection
1. Open your Vercel URL on your phone.
2. Open Console (if possible) or check Login.
3. If it says "Cannot reach server", double check:
   - Is `NEXT_PUBLIC_API_BASE_URL` set correctly in Vercel?
   - Is your Backend running and accessible? (Try visiting `<BACKEND_URL>/api/health`)
   - Did you redeploy after changing the Env Var?

## 4. Local Development
For local dev, you can still use:
- `.env.local`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api` (for PC usage)
- OR `NEXT_PUBLIC_API_BASE_URL=http://<YOUR_LAN_IP>:5000/api` (for Phone testing on LAN)
