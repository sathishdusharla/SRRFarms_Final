# ⚠️ Railway is Now Paid - Use Free Alternatives Below

## 🚀 FREE Backend Deployment Options

### **RECOMMENDED: Render.com (100% FREE)**

#### Step 1: Sign up for Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Connect your GitHub account

#### Step 2: Create Web Service (FREE)
1. Click "New +" → "Web Service"
2. Select "Build and deploy from a Git repository"
3. Connect GitHub and choose `SRRFarms_Final` repository
4. Configure settings:
   - **Name**: `srrfarms-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Step 3: Configure Free Tier Settings
- **Instance Type**: `Free` (0.1 CPU, 512 MB RAM)
- **Auto-Deploy**: `Yes`

#### Step 4: Add Environment Variables (FREE)
In Render dashboard, go to Environment tab and add:

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

#### Step 5: Deploy (FREE)
1. Click "Create Web Service"
2. Render will build and deploy automatically (takes 5-10 minutes)
3. You'll get a FREE URL like: `https://your-app-name.onrender.com`
4. **Note**: Free tier may sleep after 15 minutes of inactivity

#### Step 6: Update Frontend
After deployment, update your Netlify environment variables:
- `VITE_API_URL=https://your-app-name.onrender.com/api`

## 🎯 100% FREE! Your backend will be live in ~10 minutes!

---

## 🆓 Alternative FREE Options:

### **Option 2: Vercel (FREE)**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set root directory to `server`
4. Deploy (serverless functions)

### **Option 3: Netlify Functions (FREE)**
1. Deploy serverless functions on Netlify
2. Limited but free

### **Option 4: Heroku Alternative - Railway (Now Paid)**
⚠️ Railway is no longer free, but you can try their $5 trial

## 🏆 **RECOMMENDATION: Use Render.com**
- 100% FREE tier
- 512MB RAM, 0.1 CPU
- Automatic SSL
- GitHub integration
- Perfect for your Node.js backend
