#!/bin/bash

# ShareSmallBiz Deployment Fix Script
# This script fixes common deployment issues and ensures proper production build

echo "🔧 ShareSmallBiz Deployment Fix Script"
echo "========================================"

# Set production environment
export NODE_ENV=production

# Check Node.js version
echo "📋 System Information:"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Current directory: $(pwd)"

# Clean previous builds
echo ""
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf client/dist/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo ""
echo "🔨 Building application..."
npm run build

# Verify build output
echo ""
echo "✅ Verifying build output..."
if [ -f "dist/index.js" ]; then
    echo "✓ Server build: dist/index.js exists"
else
    echo "❌ Server build: dist/index.js missing"
    exit 1
fi

if [ -d "dist/public" ]; then
    echo "✓ Client build: dist/public exists"
    echo "✓ Client files: $(ls -1 dist/public | wc -l) files"
else
    echo "❌ Client build: dist/public missing"
    exit 1
fi

# Check for required files
if [ -f "dist/public/index.html" ]; then
    echo "✓ Main HTML: dist/public/index.html exists"
else
    echo "❌ Main HTML: dist/public/index.html missing"
    exit 1
fi

# List all built assets
echo ""
echo "📄 Built assets:"
ls -la dist/public/assets/ 2>/dev/null || echo "No assets directory found"

# Test production server startup
echo ""
echo "🚀 Testing production server..."
timeout 10s node start-prod.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✓ Production server started successfully"
    kill $SERVER_PID
else
    echo "❌ Production server failed to start"
    exit 1
fi

echo ""
echo "🎉 Deployment fix completed successfully!"
echo "💡 To deploy: Click the Deploy button in Replit"
echo "📝 The application is ready for production deployment"