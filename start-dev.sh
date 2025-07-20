#!/bin/bash

# SRR Farms Development Startup Script

echo "🌾 Starting SRR Farms Development Environment..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    brew services start mongodb-community
    sleep 3
else
    echo "✅ MongoDB is already running"
fi

# Kill any existing server processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend server
echo "🔧 Starting Backend Server..."
cd server
npm install
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Test backend connection
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running on port 3001"
else
    echo "❌ Backend server failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting Frontend Development Server..."
npm install
npm run dev &
FRONTEND_PID=$!

echo "🚀 Development servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f "node server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
