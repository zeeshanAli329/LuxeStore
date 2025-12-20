# How to Fix "Network Error" on Mobile

When testing on a phone (same Wi-Fi) or Vercel, the frontend needs to know where the backend is. `localhost` on a phone refers to the phone itself, not your PC!

## 1. Find Your PC's Local IP
1. Open Command Prompt (Terminal).
2. Type `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
3. Look for "IPv4 Address" (e.g., `192.168.1.5`).

## 2. Create/Edit `.env.local` in Frontend
Create a file named `.env.local` in `d:\Front-End Development\components\my-app\` and add:

```env
NEXT_PUBLIC_API_BASE_URL=http://<YOUR_LAN_IP>:5000/api
```
*Replace `<YOUR_LAN_IP>` with your actual IP, e.g., `http://192.168.1.5:5000/api`*

## 3. Restart Frontend
You **MUST** stop and restart the frontend server (`npm run dev`) for the `.env` change to take effect.

## 4. Verification
1. Open `http://<YOUR_LAN_IP>:3000` on your phone.
2. Try to Login. It should work now.
3. Check `http://<YOUR_LAN_IP>:5000/api/health` in your phone browser to ensure backend is searchable.

---

## For Vercel Deployment
To make it work on Vercel production:
1. Go to Vercel Project Settings > Environment Variables.
2. Add `NEXT_PUBLIC_API_BASE_URL`.
3. Set usage to your **Deployed Backend URL** (e.g., `https://my-backend.onrender.com/api`).
   *(You cannot point Vercel to localhost! You must deploy the backend too.)*
