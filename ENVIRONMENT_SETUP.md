# Environment Setup Guide

## 🚨 Local vs Production Environment Issues

### **Problem:**
You're experiencing unmatched behavior between local and production environments due to missing environment variables and configuration differences.

### **Root Causes:**
1. **Missing .env file** - No environment variables in local development
2. **Different Firebase configurations** - Local vs production Firebase projects
3. **Build mode differences** - Development vs production optimizations
4. **Network connectivity** - Different Firestore connection behavior

---

## ✅ **Step-by-Step Fix**

### **1. Create .env File**

Create a `.env` file in the `ADPT4EH` directory with your Firebase configuration:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Environment
NODE_ENV=development
```

### **2. Get Firebase Configuration**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Copy the configuration values

### **3. Environment-Specific Configurations**

#### **Local Development:**
```bash
NODE_ENV=development
# Use development Firebase project or same as production
```

#### **Production:**
```bash
NODE_ENV=production
# Use production Firebase project
```

### **4. Build Commands**

#### **Local Development:**
```bash
npm run web
# Uses development mode with hot reload
```

#### **Production Build:**
```bash
npm run build:web
# Uses production mode with optimizations
```

---

## 🔧 **Additional Fixes**

### **1. Firebase Project Consistency**

**Option A: Use Same Project (Recommended)**
- Use the same Firebase project for both local and production
- This ensures consistent data and behavior

**Option B: Separate Projects**
- Create separate Firebase projects for development and production
- Update environment variables accordingly

### **2. Network Configuration**

Add these to your Firebase configuration to handle network issues:

```javascript
// In src/firebase.js
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
  // Add timeout configuration
  timeoutSeconds: 30,
});
```

### **3. Environment Detection**

Add environment detection to your app:

```javascript
// In your components
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

console.log('Environment:', process.env.NODE_ENV);
console.log('Firebase Project:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
```

---

## 🧪 **Testing Checklist**

### **Before Testing:**
- [ ] .env file created with correct Firebase configuration
- [ ] Firebase project settings match between environments
- [ ] All environment variables are defined
- [ ] Build process works in both modes

### **Test Scenarios:**
- [ ] Signup flow works in both environments
- [ ] OTP verification works
- [ ] Location selection works
- [ ] Navigation flow is consistent
- [ ] Firebase operations (Firestore) work
- [ ] Phone authentication works

### **Debug Commands:**
```bash
# Check environment variables
echo $REACT_APP_FIREBASE_PROJECT_ID

# Build for production testing
npm run build:web

# Start development server
npm run web
```

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Firebase config not found"**
**Solution:** Ensure .env file exists and has correct values

### **Issue 2: "Firestore connection failed"**
**Solution:** Check Firebase project settings and network configuration

### **Issue 3: "Environment variables undefined"**
**Solution:** Restart development server after creating .env file

### **Issue 4: "Different behavior between local/production"**
**Solution:** Use same Firebase project and configuration

---

## 📞 **Next Steps**

1. **Create the .env file** with your Firebase configuration
2. **Test the signup flow** in local development
3. **Compare behavior** with production
4. **Update Firebase settings** if needed
5. **Deploy the updated configuration**

**Need Help?** Check the Firebase Console and ensure all settings match between environments.
