# Alternative Backend Deployment Options

## Option 2: Render.com

### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository: `SRRFarms_Final`
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Environment Variables
Same as Railway (see RAILWAY_DEPLOYMENT.md)

---

## Option 3: Vercel

### Step 1: Prepare Backend for Vercel
Create `server/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Step 2: Deploy
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `server`
4. Add environment variables

---

## Option 4: Railway CLI (Advanced)

### Install Railway CLI
```bash
npm install -g @railway/cli
```

### Deploy
```bash
cd server
railway login
railway init
railway up
```

---

## 🎯 Recommended: Use Railway
- Easiest setup
- Automatic deployments
- Free tier available
- Great for Node.js apps
- Built-in database options
