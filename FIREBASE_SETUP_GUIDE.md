# Firebase Configuration Guide

## Current Issues
1. **Phone Authentication Error**: `auth/invalid-app-credential`
2. **Firestore Network Errors**: `net::ERR_ABORTED 400 (Bad Request)`

## Step-by-Step Firebase Console Configuration

### 1. Enable Phone Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `extrahand-app`
3. Navigate to **Authentication** → **Sign-in method**
4. Find **Phone** in the list and click on it
5. Click **Enable** to turn on phone authentication
6. Click **Save**

### 2. Configure reCAPTCHA

1. In the same **Authentication** section, go to **Settings** tab
2. Scroll down to **reCAPTCHA** section
3. Click **Enable reCAPTCHA v2**
4. Add authorized domains:
   - `localhost`
   - `127.0.0.1`
   - Your production domain (if deployed)
5. Click **Save**

### 3. Configure Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Update the rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read/write general data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### 4. Verify Project Settings

1. Go to **Project Settings** (gear icon)
2. Under **General** tab, verify:
   - Project ID: `extrahand-app`
   - Web API Key: `AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw`
   - Auth Domain: `extrahand-app.firebaseapp.com`

### 5. Test Configuration

After making these changes:

1. **Wait 5-10 minutes** for changes to propagate
2. **Clear browser cache** and reload the app
3. **Test phone authentication** with a valid phone number
4. **Check browser console** for any remaining errors

## Common Issues and Solutions

### Issue: Still getting `auth/invalid-app-credential`
**Solution**: 
- Ensure reCAPTCHA v2 is enabled (not v3)
- Verify the domain is added to authorized domains
- Wait for changes to propagate (can take up to 10 minutes)

### Issue: Firestore network errors
**Solution**:
- Check Firestore security rules
- Ensure the project is on the correct plan (Blaze plan for production)
- Verify network connectivity

### Issue: CORS errors with geocoding
**Solution**: 
- ✅ Already fixed by switching to BigDataCloud API
- The app now uses a CORS-free geocoding service

## Environment Variables Verification

Ensure your `.env` file contains:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw
REACT_APP_FIREBASE_AUTH_DOMAIN=extrahand-app.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=extrahand-app
REACT_APP_FIREBASE_STORAGE_BUCKET=extrahand-app.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=961487777082
REACT_APP_FIREBASE_APP_ID=1:961487777082:web:dd95fe5a7658b0e3b1f403
REACT_APP_FIREBASE_MEASUREMENT_ID=G-GXB3LSMR5B
```

## Testing Steps

1. **Start the app**: `npm run web`
2. **Navigate to phone authentication**
3. **Enter a valid phone number** (e.g., +1234567890)
4. **Check console** for any errors
5. **Verify OTP is received** (if using a real phone number)

## Support

If issues persist after following this guide:
1. Check Firebase Console for any error messages
2. Verify all configuration steps were completed
3. Ensure the Firebase project is active and not suspended
4. Contact Firebase support if needed
