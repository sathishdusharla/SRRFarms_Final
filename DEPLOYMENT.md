# Deployment Instructions for SRR Farms E-commerce Platform

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - **RECOMMENDED**

#### Frontend Deployment (Vercel):
1. Push code to GitHub repository
2. Connect Vercel to your GitHub account
3. Import your repository
4. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL=https://your-backend-url.com/api`
   - Add all Firebase config variables
5. Deploy automatically

#### Backend Deployment (Railway):
1. Create account on Railway.app
2. Connect GitHub repository
3. Select the `server` folder as root
4. Add environment variables from `.env.production`
5. Deploy automatically

### Option 2: DigitalOcean/AWS/Google Cloud

#### Requirements:
- Ubuntu 20.04+ server
- Node.js 18+
- MongoDB Atlas account
- Domain name
- SSL certificate

### Option 3: Shared Hosting (cPanel)

#### Requirements:
- Node.js support
- MongoDB database
- File upload permissions

## 🔧 Pre-Deployment Checklist

### Backend Configuration:
- [ ] MongoDB Atlas database created
- [ ] Environment variables configured
- [ ] Email SMTP configured
- [ ] File upload directory permissions set
- [ ] CORS origins updated for production domain

### Frontend Configuration:
- [ ] API URL updated for production
- [ ] Firebase project configured for production
- [ ] Build process tested locally
- [ ] Static assets optimized

### Database Setup:
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployment)
- [ ] Connection string updated in backend .env

### Security:
- [ ] JWT secret changed to strong random string
- [ ] Admin credentials secured
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Environment variables secured

## 📋 Step-by-Step Deployment Guide

### 1. Prepare MongoDB Atlas
```bash
1. Go to mongodb.com/atlas
2. Create new cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in backend .env
```

### 2. Deploy Backend (Railway Example)
```bash
1. Push code to GitHub
2. Connect Railway to GitHub
3. Select server folder
4. Add environment variables
5. Deploy
```

### 3. Deploy Frontend (Vercel Example)
```bash
1. Update VITE_API_URL with backend URL
2. Push to GitHub
3. Connect Vercel to GitHub
4. Configure build settings:
   - Framework: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variables
6. Deploy
```

### 4. Configure Domain & SSL
```bash
1. Point domain to deployment
2. Configure SSL certificate
3. Update CORS settings in backend
4. Test all functionality
```

## 🧪 Testing Deployment

### Backend Health Check:
```bash
GET https://your-backend-url.com/api/payments/test
Response: {"success": true, "message": "Payment system is operational"}
```

### Frontend Functionality:
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] UPI payment with screenshot upload
- [ ] COD payment
- [ ] Admin order management
- [ ] Email notifications

### File Upload Testing:
- [ ] Payment screenshots upload correctly
- [ ] File size limits enforced
- [ ] Image preview works
- [ ] Admin can view uploaded screenshots

## 🔍 Common Deployment Issues

### Backend Issues:
1. **CORS Error**: Update FRONTEND_URL in backend .env
2. **File Upload Fails**: Check upload directory permissions
3. **Database Connection**: Verify MongoDB URI and IP whitelist
4. **Email Not Sending**: Configure SMTP settings correctly

### Frontend Issues:
1. **API Calls Fail**: Check VITE_API_URL configuration
2. **Build Fails**: Ensure all dependencies are installed
3. **Images Not Loading**: Check public folder deployment
4. **Routing Issues**: Configure SPA redirects

### Solutions:
```bash
# Check backend logs
railway logs

# Check frontend build
npm run build
npm run preview

# Test API connectivity
curl https://your-backend-url.com/api/payments/test
```

## 🌍 Production-Ready Features

### ✅ Implemented:
- Complete authentication system
- Cart and order management
- UPI payment with admin verification
- Cash on Delivery option
- File upload for payment screenshots
- Admin dashboard for order management
- Email notifications system
- Rate limiting and security
- Error handling and validation
- Responsive design

### 🔧 Customization Options:
- Update UPI QR code in `/public/images/upi-qr-code.svg`
- Modify email templates in backend
- Customize product categories
- Add more payment methods
- Enhance admin features

## 📞 Support

All features will work online including:
- ✅ User Authentication (Email/Password)
- ✅ Product Management
- ✅ Shopping Cart
- ✅ UPI Payment with Screenshot Upload
- ✅ Cash on Delivery
- ✅ Admin Order Verification
- ✅ Email Notifications
- ✅ File Upload System
- ✅ Order Tracking
- ✅ Admin Dashboard

The system is fully production-ready! 🎉
