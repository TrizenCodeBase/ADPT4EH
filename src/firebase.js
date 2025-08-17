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
import { 
  initializeFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';

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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Force XHR long-polling and disable fetch streams to avoid 400 WebChannel issues on some networks
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

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

export const ensureUserProfile = async (uid, data) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      createdAt: new Date().toISOString(),
      ...data,
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, code: error.code, error: error.message };
  }
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

    // Best-effort ensure profile exists in background
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ensureUserProfile(uid, { email });

    // Best-effort read profile with a 5s timeout; proceed if unavailable
    const userDoc = await withTimeout(getDoc(doc(db, 'users', uid)), 5000, { __timeout: true });
    const userData = userDoc && !userDoc.__timeout && userDoc.exists ? (userDoc.exists() ? userDoc.data() : null) : null;

    return { 
      user: userCredential.user, 
      userData,
      success: true 
    };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const uid = result.user.uid;

    // Background ensure profile
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ensureUserProfile(uid, {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      role: 'performer',
    });

    // Try read with timeout
    const userDoc = await withTimeout(getDoc(doc(db, 'users', uid)), 5000, { __timeout: true });
    const userData = userDoc && !userDoc.__timeout && userDoc.exists ? (userDoc.exists() ? userDoc.data() : null) : null;

    return { user: result.user, userData, success: true };
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

    // Non-blocking profile ensure
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ensureUserProfile(uid, { phoneNumber: result.user.phoneNumber, role: 'performer' });

    // Try to fetch profile with timeout
    const userDoc = await withTimeout(getDoc(doc(db, 'users', uid)), 5000, { __timeout: true });
    const userData = userDoc && !userDoc.__timeout && userDoc.exists ? (userDoc.exists() ? userDoc.data() : null) : null;

    return { 
      user: result.user, 
      userData,
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
