#!/bin/bash

# Fix Dependencies and Lock File Script
# This script fixes package-lock.json sync issues and updates dependencies

set -e

echo "🔧 Fixing dependencies and lock file..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Remove existing node_modules and lock file
echo "🧹 Cleaning up existing dependencies..."
rm -rf node_modules/
rm -f package-lock.json

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Install dependencies fresh
echo "📦 Installing dependencies fresh..."
npm install

# Verify installation
echo "✅ Verifying installation..."
npm ls --depth=0

echo "🎉 Dependencies fixed successfully!"
echo "📦 You can now run: npm run build:web"
