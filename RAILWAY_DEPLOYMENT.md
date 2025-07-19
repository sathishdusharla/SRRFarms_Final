# Railway Deployment Instructions

## 🚀 Deploy Backend on Railway (Recommended)

### Step 1: Sign up for Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account
3. Connect your GitHub account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `SRRFarms_Final` repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Configure Build Settings
Railway should auto-detect, but verify:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Port**: `3001` (from your server.js)

### Step 4: Add Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srrfarms?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_business_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-netlify-site.netlify.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads/

# Admin Configuration
ADMIN_EMAIL=admin@srrfarms.com
ADMIN_PHONE=+919490507045

# UPI Configuration
UPI_ID=9490507045-4@ybl
UPI_MERCHANT_NAME=SRR Farms
```

### Step 5: Deploy
1. Click "Deploy"
2. Railway will build and deploy automatically
3. You'll get a URL like: `https://your-app-name.railway.app`

### Step 6: Update Frontend
After deployment, update your Netlify environment variables:
- `VITE_API_URL=https://your-railway-app.railway.app/api`

## 🎯 That's it! Your backend will be live in ~5 minutes!
