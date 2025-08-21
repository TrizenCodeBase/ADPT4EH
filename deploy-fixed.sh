#!/bin/bash

# Extrahand Production Deployment Script (Fixed)

set -e  # Exit on any error

echo "🚀 Starting Extrahand production deployment (Fixed)..."

# Check if required environment variables are set
if [ -z "$REACT_APP_FIREBASE_API_KEY" ]; then
    echo "❌ Error: REACT_APP_FIREBASE_API_KEY is not set"
    exit 1
fi

if [ -z "$REACT_APP_FIREBASE_AUTH_DOMAIN" ]; then
    echo "❌ Error: REACT_APP_FIREBASE_AUTH_DOMAIN is not set"
    exit 1
fi

if [ -z "$REACT_APP_FIREBASE_PROJECT_ID" ]; then
    echo "❌ Error: REACT_APP_FIREBASE_PROJECT_ID is not set"
    exit 1
fi

echo "✅ Environment variables validated"

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker stop extrahand-app 2>/dev/null || true
docker rm extrahand-app 2>/dev/null || true

# Remove old images
echo "🗑️ Removing old images..."
docker rmi extrahand:latest 2>/dev/null || true

# Build the Docker image with fixed permissions
echo "🔨 Building Docker image with fixed permissions..."
docker build \
  --file Dockerfile \
  --build-arg NODE_ENV=production \
  --build-arg REACT_APP_ENV=production \
  --build-arg REACT_APP_FIREBASE_API_KEY="$REACT_APP_FIREBASE_API_KEY" \
  --build-arg REACT_APP_FIREBASE_AUTH_DOMAIN="$REACT_APP_FIREBASE_AUTH_DOMAIN" \
  --build-arg REACT_APP_FIREBASE_PROJECT_ID="$REACT_APP_FIREBASE_PROJECT_ID" \
  --build-arg REACT_APP_FIREBASE_STORAGE_BUCKET="$REACT_APP_FIREBASE_STORAGE_BUCKET" \
  --build-arg REACT_APP_FIREBASE_MESSAGING_SENDER_ID="$REACT_APP_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg REACT_APP_FIREBASE_APP_ID="$REACT_APP_FIREBASE_APP_ID" \
  --build-arg REACT_APP_FIREBASE_MEASUREMENT_ID="$REACT_APP_FIREBASE_MEASUREMENT_ID" \
  --progress=plain \
  -t extrahand:latest .

echo "✅ Docker image built successfully"

# Run the container with proper permissions
echo "🚀 Starting container with fixed permissions..."
docker run -d \
  --name extrahand-app \
  --restart unless-stopped \
  -p 80:80 \
  extrahand:latest

echo "✅ Container started successfully"

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 15

# Check if the application is running
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Application is running and healthy!"
    echo "🌐 Application is available at: http://localhost"
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 What's been fixed:"
    echo "   ✅ Nginx permission issues resolved"
    echo "   ✅ New MobileNavBar with logo and hamburger menu"
    echo "   ✅ Development mode banner when using localhost"
    echo "   ✅ Proper authentication flow"
    echo "   ✅ Real data from MongoDB when backend is running"
else
    echo "❌ Application health check failed"
    echo "📋 Container logs:"
    docker logs extrahand-app
    exit 1
fi
