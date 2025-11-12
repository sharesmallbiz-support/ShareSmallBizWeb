#!/bin/bash
set -e

echo "======================================"
echo "ShareSmallBiz - Unified Build Script"
echo "======================================"
echo ""

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf publish
mkdir -p publish

# Build .NET API
echo ""
echo "🔨 Building .NET API..."
cd api
dotnet restore
dotnet publish -c Release -o ../publish/api
cd ..
echo "✅ API build complete"

# Build Web App
echo ""
echo "🔨 Building Web App..."
cd web
npm install
npm run build
cd ..
echo "✅ Web build complete"

echo ""
echo "======================================"
echo "✅ Build Complete!"
echo "======================================"
echo ""
echo "Output directories:"
echo "  API: ./publish/api/"
echo "  Web: ./publish/web/"
echo ""
