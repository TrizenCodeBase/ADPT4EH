// Configuration file for production-ready environment switching
// PRODUCTION CONFIGURATION - All URLs point to production

// Production API URL - no fallback to localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://extrahandbackend.llp.trizenventures.com';

// Environment detection - production by default
export const isDevelopment = process.env.REACT_APP_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Firebase configuration (same for both environments)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw",
  authDomain: "extrahand-app.firebaseapp.com",
  projectId: "extrahand-app",
  storageBucket: "extrahand-app.appspot.com",
  messagingSenderId: "961487777082",
  appId: "1:961487777082:web:dd95fe5a7658b0e3b1f403",
  measurementId: "G-GXB3LSMR5B"
};

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: !isDevelopment,
  enableErrorTracking: !isDevelopment,
  enablePWA: !isDevelopment,
  enableOfflineMode: !isDevelopment,
  showDevBanner: isDevelopment
};
