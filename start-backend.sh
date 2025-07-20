#!/bin/bash

# Simple Backend Starter for SRR Farms

echo "🔧 Starting SRR Farms Backend Server..."

# Navigate to server directory
cd "$(dirname "$0")/server"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
fi

# Kill any existing server processes
pkill -f "node server.js" 2>/dev/null || true

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🚀 Starting server on port 3001..."
node server.js
