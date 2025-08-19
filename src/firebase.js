import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// Note: Firestore imports removed - using backend API for data storage
// import {
//   initializeFirestore,
//   doc,
//   setDoc,
//   getDoc
// } from 'firebase/firestore';

// Helper to bound any async by a timeout
const withTimeout = async (promise, ms, onTimeoutReturn) => {
  let timeoutId;
  const timeout = new Promise(resolve => {
    timeoutId = setTimeout(() => resolve(onTimeoutReturn), ms);
  });
  const result = await Promise.race([promise, timeout]);
  clearTimeout(timeoutId);
  return result;
};

// Environment detection for debugging
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Check if using fallback credentials
const usingFallbackApiKey = !process.env.REACT_APP_FIREBASE_API_KEY;
const usingFallbackProjectId = !process.env.REACT_APP_FIREBASE_PROJECT_ID;

console.log('🔥 Firebase Environment Debug:', {
  environment: process.env.NODE_ENV || 'development',
  isProduction,
  isDevelopment,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'extrahand-app (fallback)',
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasAuthDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  usingFallbackApiKey: !process.env.REACT_APP_FIREBASE_API_KEY,
  usingFallbackProjectId: !process.env.REACT_APP_FIREBASE_PROJECT_ID,
  finalApiKey: (process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw').substring(0, 10) + '...',
  finalProjectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'extrahand-app',
  configSource: process.env.REACT_APP_FIREBASE_API_KEY ? 'environment' : 'fallback'
});

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'extrahand-app.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'extrahand-app',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'extrahand-app.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '961487777082',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:961487777082:web:dd95fe5a7658b0e3b1f403',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-GXB3LSMR5B'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Note: Firestore initialization removed - using backend API for data storage
// export const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true,
//   useFetchStreams: false,
//   timeoutSeconds: 60,
//   retryAttempts: 5,
//   cacheSizeBytes: 50 * 1024 * 1024,
//   ignoreUndefinedProperties: true,
// });

// Note: Firestore connection monitoring removed - using backend API for data storage
// Add connection state monitoring
// let isConnected = false;
// let connectionRetries = 0;
// const maxConnectionRetries = 3;

// Monitor Firestore connection state
// if (typeof window !== 'undefined') {
//   try {
//     // Enable network connectivity monitoring
//     import('firebase/firestore').then(({ enableNetwork, disableNetwork, onSnapshot }) => {
//       // Test connection with a simple operation
//       const testConnection = async () => {
//         try {
//           console.log('🔍 Testing Firestore connection...');
//           const testDoc = doc(db, '_test', 'connection');
//           await getDoc(testDoc);
//           isConnected = true;
//           connectionRetries = 0;
//           console.log('✅ Firestore connection successful');
//         } catch (error) {
//           console.warn('⚠️ Firestore connection test failed:', error.code);
//           isConnected = false;
//           
//           if (connectionRetries < maxConnectionRetries) {
//             connectionRetries++;
//             console.log(`🔄 Retrying Firestore connection (${connectionRetries}/${maxConnectionRetries})...`);
//             setTimeout(testConnection, 2000 * connectionRetries); // Exponential backoff
//           } else {
//             console.error('❌ Firestore connection failed after max retries');
//           }
//         }
//       };
//       
//       // Test connection on initialization
//       testConnection();
//     });
//   } catch (error) {
//     console.warn('⚠️ Could not initialize Firestore connection monitoring:', error);
//   }
// }

// Initialize Analytics (only in browser environment)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    // analytics not available
  }
}
export { analytics };

// Note: User profile management is now handled by the backend API
// This function is kept for backward compatibility but does nothing
export const ensureUserProfile = async (uid, data) => {
  console.log('ℹ️ User profile management moved to backend API - skipping Firestore operation');
  return { success: true };
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, code: error.code, error: error.message };
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile (displayName) — non-blocking if it fails; but we await since it's in-memory
    try { await updateProfile(user, { displayName: userData.name }); } catch {}

    // Fire-and-forget profile write — DO NOT BLOCK UI
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ensureUserProfile(user.uid, {
      name: userData.name,
      email: user.email,
      role: userData.role,
      location: userData.location,
    });

    return { user, success: true };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Note: User profile data will be fetched by AuthContext from backend API
    console.log('✅ Sign in successful - profile data will be fetched by AuthContext');

    return { 
      user: userCredential.user, 
      userData: null, // Will be fetched by AuthContext from backend API
      success: true 
    };
  } catch (error) {
    console.error('❌ Sign in failed:', error.code, error.message);
    return { error: error.message, code: error.code, success: false };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    // Note: User profile data will be fetched by AuthContext from backend API
    console.log('✅ Google sign in successful - profile data will be fetched by AuthContext');

    return { 
      user: result.user, 
      userData: null, // Will be fetched by AuthContext from backend API
      success: true 
    };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Sign Out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Phone Number Sign In (OTP)
export const signInWithPhone = async (phoneNumber, recaptchaVerifier) => {
  try {
    console.log('🔍 Attempting phone auth with:', {
      phoneNumber,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10) + '...',
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      currentDomain: window.location.hostname
    });
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('✅ Phone auth successful');
    return { confirmationResult, success: true };
  } catch (error) {
    console.error('❌ Phone auth failed:', {
      code: error.code,
      message: error.message,
      stack: error.stack?.substring(0, 200),
      fullError: error
    });
    return { error: error.message, code: error.code, success: false };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult, verificationCode) => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    const uid = result.user.uid;

    // Note: User profile data will be fetched by AuthContext from backend API
    console.log('✅ OTP verification successful - profile data will be fetched by AuthContext');

    return { 
      user: result.user, 
      userData: null, // Will be fetched by AuthContext from backend API
      success: true 
    };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Setup Recaptcha for Phone Auth
export const setupRecaptcha = (containerId, options = {}) => {
  console.log('Creating RecaptchaVerifier for container:', containerId);
  console.log('Firebase config:', {
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  });
  
  try {
    // Clear any existing reCAPTCHA
    if (window.grecaptcha && window.grecaptcha.reset) {
      try {
        window.grecaptcha.reset();
      } catch (e) {
        console.log('No existing reCAPTCHA to reset');
      }
    }
    
    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response) => {
        console.log('✅ reCAPTCHA solved:', response);
        if (options.callback) options.callback(response);
      },
      'expired-callback': () => {
        console.log('⚠️ reCAPTCHA expired');
        if (options['expired-callback']) options['expired-callback']();
      },
      'error-callback': (error) => {
        console.error('❌ reCAPTCHA error:', error);
        if (options['error-callback']) options['error-callback'](error);
      },
    });
    
    console.log('✅ RecaptchaVerifier created successfully');
    return verifier;
  } catch (error) {
    console.error('❌ Failed to create RecaptchaVerifier:', error);
    throw error;
  }
};

export default app;
