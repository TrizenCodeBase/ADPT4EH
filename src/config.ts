// Configuration file for easy environment switching
// CHANGE THIS FIELD TO SWITCH BETWEEN ENVIRONMENTS

// For LOCALHOST development:
export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';

// For PRODUCTION:
// export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';

// Environment detection
export const isDevelopment = API_BASE_URL.includes('localhost') || 
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
