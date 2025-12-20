# FINAL DEPLOYMENT STEPS (MANDATORY)

Your mobile app is likely failing because `NEXT_PUBLIC_API_BASE_URL` is set to a **placeholder** or a non-existent URL.

## 1. Get Your REAL Backend URL
You must deploy your backend code (`ecommerce-backend`) to a real hosting provider.
Examples:
- **Render.com**: `https://my-luxe-backend.onrender.com`
- **Railway.app**: `https://luxe-backend.up.railway.app`
- **Heroku**: `https://luxe-backend.herokuapp.com`

**If you have NOT deployed your backend, mobile will NEVER work.** (Mobile cannot access localhost).

## 2. Update Vercel Environment Variable
1. Go to Vercel Dashboard -> Your Project -> Settings -> Environment Variables.
2. Edit `NEXT_PUBLIC_API_BASE_URL`.
3. Set it to your **REAL** backend URL + `/api`.
   - **CORRECT**: `https://my-luxe-backend.onrender.com/api`
   - **WRONG**: `https://your-backend-app.onrender.com/api` (This is a placeholder!)
   - **WRONG**: `http://localhost:5000/api` (Mobile cannot see this)

## 3. Redeploy Frontend
After changing the environment variable, you **MUST** go to Deployments -> Redeploy for it to take effect.

## 4. Mobile Testing
Once you redeploy:
1. Open the Vercel URL on your phone.
2. Login/Signup should now work.
3. If it fails, check the Javascript Console (or rely on the "Network Error" message).

## Summary of Code Changes
- **API Client**: Updated `src/utils/api.js` to strictly use the Env Var in production.
- **Backend**: Updated `server.js` to allow your Vercel domain to access it (CORS).
- **Security**: Removed all hardcoded localhost references.
