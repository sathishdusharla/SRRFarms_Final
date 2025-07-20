# 🚀 Production Deployment Fix

## The Real Issue
Your frontend on Netlify is trying to connect to `localhost:3001` instead of your deployed Render backend!

## ✅ Quick Fix

### 1. Find Your Render Backend URL
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service
3. Copy the URL (it looks like: `https://your-app-name.onrender.com`)

### 2. Update Environment Variables

**Option A: In Netlify Dashboard**
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your `srrfarms-final` site
3. Go to Site Settings > Environment Variables
4. Add/Update:
   ```
   VITE_API_URL = https://your-render-backend-url.onrender.com/api
   ```
5. Deploy > Trigger deploy

**Option B: Update Local .env and Redeploy**
1. Update `.env` file:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
2. Commit and push to GitHub
3. Netlify will auto-deploy

### 3. Verify Your Backend is Running
Test your Render backend:
```bash
curl https://your-render-backend-url.onrender.com/api/health
```

Should return: `{"status":"OK","timestamp":"...","uptime":...}`

## 🔍 Common Render Backend URLs
- `https://srrfarms.onrender.com/api`
- `https://srrfarms-backend.onrender.com/api`
- `https://srrfarms-final.onrender.com/api`
- `https://srrfarms-api.onrender.com/api`

## 🚨 If Backend is Sleeping (Render Free Tier)
Render free tier sleeps after 15 minutes of inactivity. First request takes ~30 seconds to wake up.

**Wake up your backend**:
```bash
curl https://your-render-backend-url.onrender.com/api/health
```

## ✅ After Fix
Your Netlify frontend will connect to Render backend and:
- Orders will work
- Payments will process
- No more "Backend not available" errors

---
**Need your exact Render URL?** Check your Render dashboard or share it here!
