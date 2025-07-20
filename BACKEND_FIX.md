# Backend Deployment & Error Fix Guide

## Current Issues
1. **Backend server is not available** - The frontend cannot connect to the backend API
2. **Failed to create order** - This is caused by the missing backend connection

## Solution Steps

### 1. Start MongoDB Service
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

### 2. Start Backend Server
```bash
# Navigate to project root
cd /Users/sathishdusharla/Downloads/srrfinal

# Option A: Using npm script
npm run start:backend

# Option B: Manual start
cd server
node server.js

# Option C: Development mode with auto-restart
cd server
npm run dev
```

### 3. Verify Backend is Running
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

### 4. Start Frontend Server
```bash
# In a new terminal, navigate to project root
cd /Users/sathishdusharla/Downloads/srrfinal

# Start frontend
npm run dev

# Frontend will be available at: http://localhost:5173
```

### 5. Test the Connection
- Open browser to `http://localhost:5173`
- Try to add items to cart and checkout
- The order creation should now work

## Configuration Files Fixed

### 1. Updated `.env` file
```
VITE_API_URL=http://localhost:3001/api
```

### 2. Updated `src/utils/api.ts`
```typescript
const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
};
```

### 3. Backend CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173` (Vite default)
- Production URLs

## Scripts Added to package.json
```json
"scripts": {
  "dev:backend": "cd server && npm start",
  "dev:full": "npm run dev:backend & npm run dev:frontend",
  "start:backend": "cd server && node server.js",
  "test:connection": "node test-backend-connection.js"
}
```

## Quick Start (All in One)
```bash
# From project root directory
./start-dev.sh
```

This will:
1. Start MongoDB if not running
2. Start backend server on port 3001
3. Start frontend server on port 5173
4. Show status of both servers

## Troubleshooting

### MongoDB Issues
```bash
# Install MongoDB if not installed
brew install mongodb-community

# Reset MongoDB if corrupted
brew services stop mongodb-community
rm -rf /opt/homebrew/var/mongodb
brew services start mongodb-community
```

### Port Conflicts
```bash
# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9

# Kill processes on port 5173
lsof -ti:5173 | xargs kill -9
```

### Permission Issues
```bash
# Make scripts executable
chmod +x start-dev.sh
chmod +x start-backend.sh
```

## API Endpoints Available
- Health Check: `GET /api/health`
- Products: `GET /api/products`
- Orders: `POST /api/orders/guest`
- Payments: `POST /api/payments/create-upi-order`
- And more...

## Environment Variables Required
Make sure these are set in `server/.env`:
- `MONGODB_URI=mongodb://localhost:27017/srrfarms`
- `PORT=3001`
- `JWT_SECRET=your-secret-key`
- `FRONTEND_URL=http://localhost:5173`
