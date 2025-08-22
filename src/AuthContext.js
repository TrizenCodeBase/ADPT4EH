import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { api } from './api';
import { sessionManager } from './SessionManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionRestored, setSessionRestored] = useState(false);

  const refreshUserData = async () => {
    if (currentUser) {
      try {
        console.log('🔄 Refreshing user data from backend API...');
        const userData = await api.me();
        setUserData(userData);
        
        // Save session data
        sessionManager.saveSession({
          isAuthenticated: true,
          lastRoute: sessionManager.getLastRoute()?.route || 'Landing'
        });
        
        console.log('✅ User data refreshed successfully:', userData);
      } catch (error) {
        console.warn('❌ Failed to refresh user data:', error.message);
      }
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user...');
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear session data
      sessionManager.clearSession();
      
      // Clear user state
      setCurrentUser(null);
      setUserData(null);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if Firebase signOut fails, clear local session
      sessionManager.clearSession();
      setCurrentUser(null);
      setUserData(null);
    }
  };

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const session = sessionManager.getSession();
        console.log('🔍 Restoring session:', session);

        if (session.isAuthenticated && sessionManager.isSessionValid()) {
          console.log('✅ Valid session found, restoring...');
          
          // Check if user is still authenticated with Firebase
          const user = auth.currentUser;
          if (user) {
            setCurrentUser(user);
            try {
              const userData = await api.me();
              setUserData(userData);
              console.log('✅ Session restored successfully');
            } catch (error) {
              console.warn('❌ Failed to restore user data:', error.message);
              setUserData(null);
            }
          } else {
            console.log('❌ Firebase user not found, clearing session');
            sessionManager.clearSession();
          }
        } else {
          console.log('❌ No valid session found');
          sessionManager.clearSession();
        }
      } catch (error) {
        console.warn('❌ Error restoring session:', error);
        sessionManager.clearSession();
      } finally {
        setSessionRestored(true);
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  useEffect(() => {
    if (!sessionRestored) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // Save authentication state
        sessionManager.saveSession({
          isAuthenticated: true,
          lastRoute: sessionManager.getLastRoute()?.route || 'Landing'
        });
        
        try {
          // Fetch user data from backend API instead of Firestore
          const userData = await api.me();
          setUserData(userData);
        } catch (error) {
          // If API call fails, continue with auth user only
          console.warn('Backend API offline; proceeding without profile data:', error.message);
          setUserData(null);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        
        // Clear session when user logs out
        sessionManager.clearSession();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [sessionRestored]);

  const value = { currentUser, userData, loading, refreshUserData, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
