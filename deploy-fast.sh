#!/bin/bash

# Fast CapRover Deployment Script
# This script optimizes the deployment process for faster builds

set -e

echo "🚀 Starting fast CapRover deployment..."

# Enable BuildKit for better caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean up any previous builds
echo "🧹 Cleaning up previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies with optimizations
echo "📦 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Build the application
echo "🔨 Building application..."
npm run build:web

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📦 Build size:"
du -sh dist/

echo "🚀 Ready for CapRover deployment!"
echo "💡 Push to Git to trigger automatic deployment"
