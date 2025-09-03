// Configuration file for production-ready environment switching
// PRODUCTION CONFIGURATION - All URLs point to production

// API URL - Smart fallback for development vs production
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.REACT_APP_ENV === 'development' 
    ? 'http://localhost:4000'  // Local backend for development
    : 'https://extrahandbackend.llp.trizenventures.com'  // Production backend
  );

// Environment detection - production by default
export const isDevelopment = process.env.REACT_APP_ENV === 'development';

// CORS configuration for different environments
export const CORS_CONFIG = {
  development: {
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode,
  },
  production: {
    credentials: 'include' as RequestCredentials,
    mode: 'cors' as RequestMode,
  }
};

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
