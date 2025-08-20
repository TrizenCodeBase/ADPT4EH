# Production Deployment Guide

This guide covers deploying the Extrahand frontend application to production with best practices for security, performance, and reliability.

## Prerequisites

- Node.js 18+ installed
- Docker installed (for containerized deployment)
- Access to a production server or cloud platform
- Domain name configured with SSL certificate

## Environment Setup

### 1. Environment Variables

Create environment-specific files:

```bash
# Development
cp env.development .env.development

# Production
cp env.production .env.production
```

### 2. Required Environment Variables

Ensure these variables are set in your production environment:

```bash
# Application
NODE_ENV=production
REACT_APP_ENV=production

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
REACT_APP_API_BASE_URL=https://your-backend-domain.com

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_TRACKING=true
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_OFFLINE_MODE=true
```

## Build Process

### 1. Local Build

```bash
# Install dependencies
npm install

# Run security audit
npm run security:audit

# Run linting and type checking
npm run lint
npm run type-check

# Build for production
npm run build:web
```

### 2. Docker Build

```bash
# Build production image
docker build \
  --build-arg NODE_ENV=production \
  --build-arg REACT_APP_ENV=production \
  --build-arg REACT_APP_FIREBASE_API_KEY=your_api_key \
  --build-arg REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain \
  --build-arg REACT_APP_FIREBASE_PROJECT_ID=your_project_id \
  --build-arg REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket \
  --build-arg REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  --build-arg REACT_APP_FIREBASE_APP_ID=your_app_id \
  --build-APP_FIREBASE_MEASUREMENT_ID=your_measurement_id \
  -t extrahand:latest .

# Run container
docker run -d -p 80:80 --name extrahand-app extrahand:latest
```

## Deployment Options

### 1. Docker Deployment

```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Using Docker Swarm
docker stack deploy -c docker-compose.prod.yml extrahand
```

### 2. Nginx Deployment

```bash
# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/nginx.conf

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 3. Cloud Platform Deployment

#### AWS S3 + CloudFront

```bash
# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Security Configuration

### 1. SSL/TLS Setup

```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com

# Using Cloudflare
# Enable SSL/TLS encryption mode to "Full (strict)"
```

### 2. Security Headers

The nginx configuration includes security headers:

- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: Comprehensive CSP

### 3. Rate Limiting

Configured in nginx.conf:
- API endpoints: 10 requests per second
- Burst allowance: 10 requests

## Performance Optimization

### 1. Caching Strategy

- Static assets: 1 year cache
- HTML files: 1 hour cache
- Manifest/Service Worker: 1 day cache
- API responses: 5 minutes cache

### 2. Compression

- Gzip compression enabled
- Brotli compression (if available)

### 3. CDN Configuration

```bash
# Cloudflare settings
# Enable Auto Minify for JavaScript, CSS, and HTML
# Enable Brotli compression
# Enable Rocket Loader
```

## Monitoring and Logging

### 1. Health Checks

```bash
# Check application health
curl -f http://your-domain.com/health

# Docker health check
docker inspect --format='{{.State.Health.Status}}' container_name
```

### 2. Log Monitoring

```bash
# Nginx access logs
tail -f /var/log/nginx/access.log

# Nginx error logs
tail -f /var/log/nginx/error.log

# Docker logs
docker logs -f container_name
```

### 3. Performance Monitoring

- Google Analytics (if enabled)
- Error tracking service (if enabled)
- Server monitoring (CPU, memory, disk)

## Backup and Recovery

### 1. Application Backup

```bash
# Backup built files
tar -czf extrahand-backup-$(date +%Y%m%d).tar.gz dist/

# Backup nginx configuration
cp /etc/nginx/nginx.conf nginx-backup-$(date +%Y%m%d).conf
```

### 2. Database Backup

Ensure your backend database is properly backed up according to your backend deployment guide.

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   npm run clean
   npm run build:web
   ```

2. **Runtime Errors**
   ```bash
   # Check browser console
   # Check nginx error logs
   # Check application logs
   ```

3. **Performance Issues**
   ```bash
   # Analyze bundle size
   npm run build:web:analyze
   
   # Check network tab in browser dev tools
   # Monitor server resources
   ```

### Support

For production issues:
1. Check application logs
2. Review error tracking service
3. Monitor server metrics
4. Contact development team

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review security audit results
- [ ] Monitor performance metrics
- [ ] Backup application and configuration
- [ ] Update SSL certificates
- [ ] Review and update environment variables

### Update Process

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run tests
npm test

# Build and deploy
npm run build:web
# Deploy using your chosen method
```

## Compliance

Ensure your deployment complies with:
- GDPR (if serving EU users)
- CCPA (if serving California users)
- Industry-specific regulations
- Security standards (OWASP, etc.)

## Emergency Procedures

### Rollback Process

```bash
# Docker rollback
docker tag extrahand:previous extrahand:latest
docker-compose up -d

# Nginx rollback
sudo cp nginx-backup.conf /etc/nginx/nginx.conf
sudo systemctl reload nginx
```

### Incident Response

1. Assess impact
2. Implement immediate mitigation
3. Communicate with stakeholders
4. Investigate root cause
5. Implement permanent fix
6. Document lessons learned
