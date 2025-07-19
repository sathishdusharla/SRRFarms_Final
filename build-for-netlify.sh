#!/bin/bash

echo "🚀 Building SRR Farms for Netlify Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output in 'dist' directory"
    
    # Show build stats
    echo "📊 Build Statistics:"
    ls -la dist/
    echo ""
    
    # Check for critical files
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html created"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ Assets directory created"
        echo "📂 Assets:"
        ls -la dist/assets/
    else
        echo "❌ Assets directory missing"
    fi
    
    echo ""
    echo "🌍 Ready for Netlify deployment!"
    echo "Deployment instructions:"
    echo "1. Push to GitHub repository"
    echo "2. Connect Netlify to GitHub"
    echo "3. Set build command: npm run build"
    echo "4. Set publish directory: dist"
    echo "5. Configure environment variables in Netlify dashboard"
    echo ""
    echo "Environment variables to set in Netlify:"
    echo "- VITE_API_URL=https://your-backend-url.com/api"
    echo "- VITE_FIREBASE_API_KEY=your_firebase_api_key"
    echo "- VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain"
    echo "- VITE_FIREBASE_PROJECT_ID=your_firebase_project_id"
    echo "- VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket"
    echo "- VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id"
    echo "- VITE_FIREBASE_APP_ID=your_firebase_app_id"
    
else
    echo "❌ Build failed!"
    echo "Please check the error messages above and fix any issues."
    exit 1
fi
