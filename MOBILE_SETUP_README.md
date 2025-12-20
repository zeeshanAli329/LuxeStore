# Mobile Setup Instructions (Fix Network Error)

To test on your real phone, you must point the frontend to your PC's LAN IP Address, because `localhost` on your phone does not reach your PC.

## 1. Find your LAN IP
- **Windows**: Open Terminal -> type `ipconfig` -> Look for `IPv4 Address` (e.g. `192.168.1.10`)
- **Mac/Linux**: Open Terminal -> type `ifconfig` -> Look for `inet 192.168...`

## 2. Update Frontend Config
1. Open the file `.env.local` in `src/` (or create it if missing).
2. Add or update this line:
```env
NEXT_PUBLIC_API_BASE_URL=http://<YOUR_LAN_IP>:5000/api
```
*Example: NEXT_PUBLIC_API_BASE_URL=http://192.168.1.10:5000/api*

## 3. Restart Servers
1. Stop the frontend terminal (Ctrl+C).
2. Run `npm run dev` again.
3. Ensure backend is running.

## 4. Test on Phone
1. Connect phone to **same Wi-Fi** as PC.
2. Open Chrome/Safari on phone.
3. Go to `http://<YOUR_LAN_IP>:5000/api/health` first.
   - If you see `{"status":"ok"...}`, backend is reachable!
4. Go to `http://<YOUR_LAN_IP>:3000`.
   - Login and Products should now work perfectly.

## Troubleshooting
- **Firewall**: If `api/health` times out, your Windows Firewall might be blocking Node.js. Allow Node.js through firewall or temporarily turn off firewall to test.
