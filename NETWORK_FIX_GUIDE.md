# 🌐 Network Timeout Fix Guide

## 🚨 Current Issue
The build is failing due to network timeouts when downloading npm packages:
```
npm error network request to https://registry.npmjs.org/gzip-size/-/gzip-size-6.0.0.tgz failed, reason: 
npm error network This is a problem related to network connectivity.
```

## ✅ Solutions Implemented

### 1. **Updated Dockerfile.simple**
- **Extended timeouts**: 600 seconds (10 minutes) for network operations
- **Aggressive retries**: 10 retry attempts with exponential backoff
- **Single socket**: `--maxsockets=1` to avoid overwhelming the network
- **Verbose logging**: `--verbose` for better debugging

### 2. **Multiple Dockerfile Options**
- `Dockerfile.simple` - Single-stage with aggressive network settings
- `Dockerfile.fallback` - Multi-stage with npm network optimizations
- `Dockerfile.yarn` - Uses yarn instead of npm (often more reliable)

### 3. **CapRover Configuration**
- Using `Dockerfile.simple` for maximum reliability
- BuildKit enabled for better caching

## 🛠️ Current Status

**✅ Ready to deploy!** The fixes are already applied:

1. **Dockerfile.simple** has aggressive network timeout settings
2. **captain-definition** is configured to use the simple Dockerfile
3. **All optimizations** are in place

## 🚀 Deploy Now

Simply push the changes:

```bash
git add .
git commit -m "Fix network timeout issues with aggressive retry settings"
git push
```

## 📊 What the Fix Does

### Network Settings in Dockerfile.simple:
```dockerfile
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-timeout 600000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm config set fetch-retries 10 && \
    npm install --prefer-offline --no-audit --network-timeout=600000 --maxsockets=1 --verbose
```

This means:
- **10-minute timeout** for each network request
- **10 retry attempts** with exponential backoff
- **Single socket** to avoid network congestion
- **Verbose logging** to see exactly what's happening

## 🎯 Expected Results

After this fix:
- ✅ **Network timeouts resolved** with extended timeouts
- ✅ **Reliable package downloads** with aggressive retries
- ✅ **Better debugging** with verbose logging
- ✅ **Successful builds** even in poor network conditions

## 🚨 If It Still Fails

### Option 1: Try Yarn Version
If npm still fails, we can switch to yarn:

```bash
# Update captain-definition to use Dockerfile.yarn
# Change "dockerfilePath": "./Dockerfile.yarn"
```

### Option 2: Use Different Registry
If npm registry is the issue:

```bash
# Add to Dockerfile.simple
RUN npm config set registry https://registry.npmjs.org/
```

### Option 3: Pre-download Dependencies
Create a pre-built image with dependencies:

```bash
# Build a base image with dependencies
docker build -t extrahand-deps -f Dockerfile.deps .
```

## 📈 Monitoring

### Success Indicators:
- ✅ `npm install` completes without network errors
- ✅ All packages download successfully
- ✅ Build reaches the nginx stage
- ✅ Final image is created

### Common Success Messages:
```
✅ Dependencies installed successfully
✅ Build completed successfully
✅ Image built successfully
```

---

## 🎉 Result

Your build should now handle network issues gracefully with:
- **Extended timeouts** (10 minutes)
- **Aggressive retries** (10 attempts)
- **Better error handling**
- **Verbose logging** for debugging

Push the changes and your CapRover deployment should succeed! 🚀
