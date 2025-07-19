# 🚀 Complete Deployment Checklist

## ✅ Backend Deployment Steps (Choose One Platform)

### **RECOMMENDED: Render.com (100% FREE)**

#### **Prerequisites:**
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Gmail account for email services (optional)

#### **Step 1: Database Setup**
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Create database user
- [ ] Configure network access (allow all IPs)
- [ ] Get connection string
- [ ] Test connection

#### **Step 2: Render.com Deployment (FREE)**
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub (no credit card needed)
- [ ] Click "New +" → "Web Service"
- [ ] Select "Build and deploy from a Git repository"
- [ ] Connect GitHub and choose `SRRFarms_Final` repository
- [ ] Configure settings:
  - Name: `srrfarms-backend`
  - Root Directory: `server`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Choose **FREE** plan (512MB RAM, 0.1 CPU)

#### **Step 3: Environment Variables**
Add these in Render dashboard → Environment Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srrfarms?retryWrites=true&w=majority
JWT_SECRET=srrfarms_super_secure_jwt_secret_key_2024_production_ready
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_business_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-netlify-site.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads/
ADMIN_EMAIL=admin@srrfarms.com
ADMIN_PHONE=+919490507045
UPI_ID=9490507045-4@ybl
UPI_MERCHANT_NAME=SRR Farms
```

#### **Step 4: Deploy & Test (FREE)**
- [ ] Click "Create Web Service" in Render
- [ ] Wait for build to complete (~5-10 minutes)
- [ ] Get your backend URL (e.g., `https://your-app.onrender.com`)
- [ ] Test API endpoint: `https://your-app.onrender.com/api/health`

#### **Step 5: Update Frontend**
- [ ] Go to Netlify dashboard
- [ ] Navigate to Site settings → Environment variables
- [ ] Update `VITE_API_URL` to your Render URL
- [ ] Redeploy frontend

---

## 🎯 **Quick Start Commands**

### Test Your Deployed Backend:
```bash
# Test health endpoint
curl https://your-app.onrender.com/api/health

# Test products endpoint
curl https://your-app.onrender.com/api/products
```

### Update Frontend Environment:
1. Netlify Dashboard → Site Settings → Environment Variables
2. Update: `VITE_API_URL=https://your-app.onrender.com/api`
3. Trigger redeploy

---

## 🔧 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check Node.js version (use Node 18)
2. **Database connection fails**: Verify MongoDB URI and network access
3. **CORS errors**: Ensure `FRONTEND_URL` matches your Netlify URL
4. **App sleeps**: Use UptimeRobot.com (free) to ping every 5 minutes

### Support Links:
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Free Monitoring: https://uptimerobot.com

---

## 🎉 **Success Criteria**

Your backend is successfully deployed when:
- [ ] Render shows "Live" status
- [ ] Health endpoint returns 200 OK
- [ ] Products API returns data
- [ ] Frontend can authenticate users
- [ ] Orders can be placed successfully

**Estimated Time: 15-30 minutes**
**Total Cost: $0.00/month (100% FREE)**
