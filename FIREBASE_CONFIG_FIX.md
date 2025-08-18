# Firebase Configuration Fix Guide

## 🚨 **Current Issue: `auth/invalid-api-key` Error**

The error `Firebase: Error (auth/invalid-api-key)` indicates that your Firebase configuration is not properly set up for production.

## 🔧 **Step-by-Step Fix**

### **Step 1: Get Your Firebase Configuration**

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project** (or create one if you haven't)
3. **Go to Project Settings** (gear icon in the top left)
4. **Scroll down to "Your apps"** section
5. **Click on your web app** (or create one if needed)
6. **Copy the configuration values**

Your Firebase config should look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### **Step 2: Update Your `.env` File**

Replace the placeholder values in your `ADPT4EH/.env` file with your actual Firebase configuration:

```bash
# Replace these with your actual values from Firebase Console
REACT_APP_FIREBASE_API_KEY=AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### **Step 3: Verify Configuration**

After updating the `.env` file, verify it's correct:

```bash
# Check the .env file contents
type .env
```

### **Step 4: Rebuild the Application**

```bash
# Build for production
npm run build:web
```

### **Step 5: Deploy to Production**

After rebuilding, deploy your updated application to your production environment.

## 🔍 **Troubleshooting**

### **If you still get the error:**

1. **Check API Key**: Ensure the API key is correct and not truncated
2. **Check Project ID**: Verify the project ID matches your Firebase project
3. **Check Auth Domain**: Should be `your-project.firebaseapp.com`
4. **Clear Cache**: Clear browser cache and try again
5. **Check Environment**: Ensure `NODE_ENV=production` is set

### **Common Issues:**

- **Wrong API Key**: Double-check the API key from Firebase Console
- **Wrong Project**: Ensure you're using the correct Firebase project
- **Missing Values**: All Firebase config values are required
- **Caching**: Browser or CDN might be caching old configuration

## 📋 **Firebase Console Setup Checklist**

Make sure your Firebase project has:

- ✅ **Authentication enabled** (Email/Password, Google, Phone)
- ✅ **Firestore Database created**
- ✅ **Web app registered**
- ✅ **Security rules configured**
- ✅ **Authorized domains added** (for your production domain)

## 🚀 **After Fix**

Once you've updated the configuration:

1. **Test locally**: `npm run web`
2. **Build for production**: `npm run build:web`
3. **Deploy**: Upload the `dist/` folder to your hosting service
4. **Verify**: Check that the landing page loads without errors

## 📞 **Need Help?**

If you're still having issues:

1. **Check Firebase Console** for any project errors
2. **Verify all environment variables** are set correctly
3. **Check browser console** for additional error details
4. **Ensure your domain is authorized** in Firebase Console

## 🔒 **Security Note**

- Never commit your `.env` file to version control
- Keep your Firebase API keys secure
- Use different Firebase projects for development and production
