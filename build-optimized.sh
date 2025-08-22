#!/bin/bash

# Optimized Docker build script for faster deployments
# This script enables BuildKit and other performance optimizations

set -e

echo "🚀 Starting optimized Docker build..."

# Enable BuildKit for better layer caching
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build arguments for environment variables
BUILD_ARGS=""

# Check if environment variables are set and add them as build args
if [ ! -z "$REACT_APP_FIREBASE_API_KEY" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY"
fi

if [ ! -z "$REACT_APP_FIREBASE_AUTH_DOMAIN" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN"
fi

if [ ! -z "$REACT_APP_FIREBASE_PROJECT_ID" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID"
fi

if [ ! -z "$REACT_APP_FIREBASE_STORAGE_BUCKET" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET"
fi

if [ ! -z "$REACT_APP_FIREBASE_MESSAGING_SENDER_ID" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
fi

if [ ! -z "$REACT_APP_FIREBASE_APP_ID" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID"
fi

if [ ! -z "$REACT_APP_FIREBASE_MEASUREMENT_ID" ]; then
    BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID"
fi

# Set default environment
BUILD_ARGS="$BUILD_ARGS --build-arg NODE_ENV=production"
BUILD_ARGS="$BUILD_ARGS --build-arg REACT_APP_ENV=production"

# Build the Docker image with optimizations
echo "🔨 Building with BuildKit enabled..."
docker build \
    --progress=plain \
    --no-cache=false \
    --target production \
    $BUILD_ARGS \
    -t extrahand-frontend:latest \
    .

echo "✅ Build completed successfully!"
echo "📦 Image size:"
docker images extrahand-frontend:latest --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo "🚀 Ready for deployment!"
