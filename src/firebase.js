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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw",
  authDomain: "extrahand-app.firebaseapp.com",
  projectId: "extrahand-app",
  storageBucket: "extrahand-app.appspot.com",
  messagingSenderId: "961487777082",
  appId: "1:961487777082:web:dd95fe5a7658b0e3b1f403",
  measurementId: "G-GXB3LSMR5B"
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
    // noop - analytics not supported in this environment
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
    // If offline/unavailable, report but don't fail the auth flow
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
    
    // Update user profile (displayName)
    await updateProfile(user, { displayName: userData.name });

    // Try writing profile, but tolerate offline
    const profileResult = await ensureUserProfile(user.uid, {
      name: userData.name,
      email: user.email,
      role: userData.role,
      location: userData.location,
    });

    return { user, success: true, profileWriteOk: profileResult.success, profileWriteErrorCode: profileResult.code };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Email/Password Sign In
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Best-effort ensure profile exists
    await ensureUserProfile(uid, { email });

    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    
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

    await ensureUserProfile(uid, {
      name: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      role: 'performer',
    });

    const userDoc = await getDoc(doc(db, 'users', uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

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
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, success: true };
  } catch (error) {
    return { error: error.message, code: error.code, success: false };
  }
};

// Verify OTP
export const verifyOTP = async (confirmationResult, verificationCode) => {
  try {
    const result = await confirmationResult.confirm(verificationCode);
    
    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // New user, save to Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber,
        role: 'performer', // Default role
        createdAt: new Date().toISOString(),
      });
    }
    
    const userData = userDoc.exists() ? userDoc.data() : null;
    
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
export const setupRecaptcha = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response) => {
      console.log('Recaptcha verified');
    },
    'expired-callback': () => {
      console.log('Recaptcha expired');
    }
  });
};

export default app;
