#!/bin/bash

# Quick Fix Script for Deployment Issues

echo "🔧 Quick Fix: Resolving deployment issues..."

# Clean up everything
echo "🧹 Cleaning up..."
rm -rf node_modules package-lock.json dist

# Remove workbox dependency if it exists
if grep -q "workbox-webpack-plugin" package.json; then
    echo "📦 Removing workbox-webpack-plugin dependency..."
    npm uninstall workbox-webpack-plugin
fi

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm install

# Test build locally
echo "🔨 Testing build locally..."
npm run build:web

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    echo "🚀 Ready for deployment!"
    echo ""
    echo "To deploy:"
    echo "  npm run build:docker:simple"
    echo "  or"
    echo "  npm run deploy"
else
    echo "❌ Local build failed. Check the error above."
    exit 1
fi
