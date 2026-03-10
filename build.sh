#!/bin/bash
set -e

echo "======================================"
echo "ShareSmallBiz - Web Build Script"
echo "======================================"
echo ""

# Clean previous build
echo "Cleaning previous build..."
rm -rf publish
mkdir -p publish

# Build Web App
echo ""
echo "Building Web App..."
cd web
npm install
npm run build
cd ..
echo "Web build complete"

echo ""
echo "======================================"
echo "Build Complete!"
echo "======================================"
echo ""
echo "Output: ./publish/web/"
echo ""
