# 🚀 Complete Deployment Checklist

## ✅ Backend Deployment Steps (Choose One Platform)

### **RECOMMENDED: Railway Deployment**

#### **Prerequisites:**
- [ ] GitHub account
- [ ] MongoDB Atlas account (free)
- [ ] Gmail account for email services

#### **Step 1: Database Setup**
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Create database user
- [ ] Configure network access (allow all IPs)
- [ ] Get connection string
- [ ] Test connection

#### **Step 2: Railway Deployment**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Click "New Project" → "Deploy from GitHub repo"
- [ ] Select `SRRFarms_Final` repository
- [ ] Set root directory to `server`
- [ ] Verify build settings:
  - Build Command: `npm install`
  - Start Command: `npm start`

#### **Step 3: Environment Variables**
Add these in Railway dashboard → Variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/srrfarms?retryWrites=true&w=majority
JWT_SECRET=srrfarms_super_secure_jwt_secret_key_2024_production_ready
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_business_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=3001
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

#### **Step 4: Deploy & Test**
- [ ] Click "Deploy" in Railway
- [ ] Wait for build to complete (~3-5 minutes)
- [ ] Get your backend URL (e.g., `https://your-app.railway.app`)
- [ ] Test API endpoint: `https://your-app.railway.app/api/health`

#### **Step 5: Update Frontend**
- [ ] Go to Netlify dashboard
- [ ] Navigate to Site settings → Environment variables
- [ ] Update `VITE_API_URL` to your Railway URL
- [ ] Redeploy frontend

---

## 🎯 **Quick Start Commands**

### Test Your Deployed Backend:
```bash
# Test health endpoint
curl https://your-railway-app.railway.app/api/health

# Test products endpoint
curl https://your-railway-app.railway.app/api/products
```

### Update Frontend Environment:
1. Netlify Dashboard → Site Settings → Environment Variables
2. Update: `VITE_API_URL=https://your-railway-app.railway.app/api`
3. Trigger redeploy

---

## 🔧 **Troubleshooting**

### Common Issues:
1. **Build fails**: Check Node.js version (use Node 18)
2. **Database connection fails**: Verify MongoDB URI and network access
3. **CORS errors**: Ensure `FRONTEND_URL` matches your Netlify URL
4. **Email not working**: Generate Gmail app password

### Support Links:
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

---

## 🎉 **Success Criteria**

Your backend is successfully deployed when:
- [ ] Railway shows "Deployed" status
- [ ] Health endpoint returns 200 OK
- [ ] Products API returns data
- [ ] Frontend can authenticate users
- [ ] Orders can be placed successfully

**Estimated Time: 15-30 minutes**
