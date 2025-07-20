#!/bin/bash

# Deploy Updated Backend URL to Production

echo "🚀 Deploying SRR Farms with updated backend URL..."

# Add all changes
git add .

# Commit changes
git commit -m "Fix: Update API URL to point to Render backend (https://srrfarms-backend.onrender.com)"

# Push to GitHub (this will trigger Netlify deployment)
git push origin main

echo "✅ Changes pushed to GitHub"
echo "📱 Netlify will auto-deploy at: https://srrfarms-final.netlify.app"
echo "🔧 Backend URL: https://srrfarms-backend.onrender.com/api"

# Test the backend
echo "🔍 Testing backend connection..."
curl -s https://srrfarms-backend.onrender.com/api/health || echo "❌ Backend not responding (might be sleeping)"

echo ""
echo "🎯 Next steps:"
echo "1. Wait for Netlify deployment (2-3 minutes)"
echo "2. Visit https://srrfarms-final.netlify.app"
echo "3. Test checkout functionality"
echo "4. If backend is sleeping, first request will wake it up (~30 seconds)"
