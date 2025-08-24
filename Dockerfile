# Optimized Dockerfile for ExtraHand React Native Web App
FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with aggressive network timeout settings
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retries 10 && \
    npm install --prefer-offline --no-audit --network-timeout=600000 --maxsockets=1 --verbose

# Copy source code
COPY . .

# Set environment variables
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_MEASUREMENT_ID
ARG NODE_ENV=production
ARG REACT_APP_ENV=production

ENV REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID
ENV NODE_ENV=$NODE_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV

# Build the application
RUN npm run build:web

# Install nginx and curl for serving and health checks
RUN apk add --no-cache nginx curl

# Copy built files to nginx directory (correct path)
RUN mkdir -p /usr/share/nginx/html && \
    cp -r dist/* /usr/share/nginx/html/ && \
    rm -rf dist node_modules package*.json

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create necessary nginx directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /tmp/nginx /run

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]