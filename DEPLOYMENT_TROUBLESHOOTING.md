# Deployment Troubleshooting Guide

This guide helps resolve common deployment issues with the Extrahand application.

## Common Issues and Solutions

### 1. npm ci Command Failed

**Error:**
```
npm error Usage: npm ci
npm error The command '/bin/sh -c npm ci' returned a non-zero code: 1
```

**Solution:**
- Use the simple Dockerfile: `Dockerfile.simple`
- Run: `npm run build:docker:simple`
- Or use the deployment script: `npm run deploy`

**Alternative Solutions:**
```bash
# Option 1: Use npm install instead of npm ci
docker build --file Dockerfile.simple -t extrahand:latest .

# Option 2: Regenerate package-lock.json
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

### 2. Build Process Fails

**Error:**
```
Module not found: Can't resolve 'react-native-web'
```

**Solution:**
```bash
# Install missing dependencies
npm install react-native-web

# Clear cache and rebuild
npm run clean
npm run build:web
```

### 3. Environment Variables Not Set

**Error:**
```
REACT_APP_FIREBASE_API_KEY is not set
```

**Solution:**
```bash
# Set environment variables
export REACT_APP_FIREBASE_API_KEY="your_api_key"
export REACT_APP_FIREBASE_AUTH_DOMAIN="your_domain"
export REACT_APP_FIREBASE_PROJECT_ID="your_project_id"

# Or create a .env file
cp env.production .env
```

### 4. Port Already in Use

**Error:**
```
Error response from daemon: driver failed programming external connectivity on endpoint
```

**Solution:**
```bash
# Stop existing container
docker stop extrahand-app
docker rm extrahand-app

# Or use a different port
docker run -d -p 3000:80 --name extrahand-app extrahand:latest
```

### 5. Permission Denied

**Error:**
```
permission denied: ./deploy.sh
```

**Solution:**
```bash
# Make script executable
chmod +x deploy.sh

# Or run directly
bash deploy.sh
```

### 6. Docker Build Context Too Large

**Error:**
```
failed to compute cache key: "/node_modules" requires following symlinks
```

**Solution:**
- Ensure `.dockerignore` is properly configured
- Remove unnecessary files from build context
- Use multi-stage builds for optimization

### 7. Webpack Build Fails

**Error:**
```
Module parse failed: Unexpected token
```

**Solution:**
```bash
# Check webpack configuration
npm run type-check

# Clear cache and rebuild
rm -rf node_modules/.cache
npm run build:web
```

### 8. GenerateSW Plugin Error

**Error:**
```
ERROR in Please check your GenerateSW plugin configuration:
Cannot read properties of undefined (reading 'properties')
```

**Solution:**
```bash
# Use the quick fix script
chmod +x quick-fix.sh
./quick-fix.sh

# Or manually fix:
# 1. Remove workbox dependency
npm uninstall workbox-webpack-plugin

# 2. Use simple webpack config
npm run build:web

# 3. Deploy with simple Dockerfile
npm run build:docker:simple
```

### 8. Nginx Configuration Issues

**Error:**
```
nginx: [emerg] directive "limit_req_zone" has no opening "{" in /etc/nginx/nginx.conf
```

**Solution:**
- Check nginx.conf syntax: `nginx -t`
- Ensure proper bracket matching
- Use simplified nginx configuration if needed

## Quick Fix Commands

### Reset Everything
```bash
# Stop and remove all containers
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Clean npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Quick Deployment
```bash
# Use simple deployment
npm run build:docker:simple

# Or use deployment script
npm run deploy
```

### Debug Build Issues
```bash
# Build with verbose output
docker build --file Dockerfile.simple --progress=plain -t extrahand:latest .

# Check container logs
docker logs extrahand-app

# Enter container for debugging
docker exec -it extrahand-app sh
```

## Environment-Specific Issues

### Development Environment
```bash
# Use development configuration
NODE_ENV=development npm run web:dev
```

### Production Environment
```bash
# Use production configuration
NODE_ENV=production npm run build:web
```

### Staging Environment
```bash
# Use staging configuration
NODE_ENV=staging npm run build:web
```

## Monitoring and Logs

### Check Application Status
```bash
# Health check
curl -f http://localhost/health

# Container status
docker ps

# Container logs
docker logs -f extrahand-app
```

### Performance Monitoring
```bash
# Check resource usage
docker stats extrahand-app

# Analyze bundle size
npm run build:web:analyze
```

## Emergency Rollback

### Quick Rollback
```bash
# Stop current container
docker stop extrahand-app

# Run previous version
docker run -d -p 80:80 --name extrahand-app extrahand:previous

# Or restore from backup
docker load < extrahand-backup.tar
```

### Data Recovery
```bash
# Backup current data
docker cp extrahand-app:/usr/share/nginx/html ./backup

# Restore from backup
docker cp ./backup extrahand-app:/usr/share/nginx/html
```

## Support

If you continue to experience issues:

1. Check the application logs: `docker logs extrahand-app`
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity
5. Review the production deployment guide
6. Contact the development team with error logs

## Prevention

To avoid deployment issues:

1. Always test builds locally before deployment
2. Use consistent environment variables
3. Keep dependencies updated
4. Monitor application health regularly
5. Maintain backup strategies
6. Document deployment procedures
