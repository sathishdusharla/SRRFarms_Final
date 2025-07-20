# 🚀 Quick Start Guide - SRR Farms Backend

## Current Issue
The frontend is working but showing "Backend server is not available" because the backend API server is not running.

## ⚡ Quick Fix (2 minutes)

### Option 1: One-Command Start
```bash
cd /Users/sathishdusharla/Downloads/srrfinal
./start-dev.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Start Backend
cd /Users/sathishdusharla/Downloads/srrfinal/server
node server.js

# Terminal 2 - Start Frontend (if not already running)
cd /Users/sathishdusharla/Downloads/srrfinal
npm run dev
```

### Option 3: Using npm scripts
```bash
# Terminal 1 - Backend
npm run start:backend

# Terminal 2 - Frontend
npm run dev
```

## ✅ Verification

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"OK","timestamp":"...","uptime":...}`

2. **Frontend**: 
   - Visit: http://localhost:5173
   - Try adding items to cart and checkout
   - Should work without "Backend not available" errors

## 🔧 Troubleshooting

### MongoDB Not Running?
```bash
brew services start mongodb-community
```

### Port 3001 Busy?
```bash
# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9
```

### Dependencies Missing?
```bash
cd server && npm install
```

## 📱 What Works After Backend Starts

✅ **Full E-commerce Features**:
- User registration/login
- Add to cart
- Checkout process
- Order management
- UPI payment integration
- Admin dashboard
- Email notifications
- Guest checkout

✅ **API Endpoints Available**:
- Authentication: `/api/auth/*`
- Products: `/api/products`
- Orders: `/api/orders/*`
- Payments: `/api/payments/*`
- Admin: `/api/admin/*`

## 🎯 Next Steps

1. Start backend server (see commands above)
2. Test the full application
3. For production deployment, see `DEPLOYMENT.md`

---
**Need help?** Check the full documentation in `BACKEND_FIX.md`
