import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationProvider } from './src/SimpleNavigation';
import SimpleNavigation from './src/SimpleNavigation';
import { AuthProvider } from './src/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';

const App = () => {
  useEffect(() => {
    // Suppress touch event warnings in development
    if (process.env.NODE_ENV === 'development' && Platform.OS === 'web') {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('touch')) {
          return; // Suppress touch-related warnings
        }
        originalWarn.apply(console, args);
      };
    }
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NavigationProvider>
          <SimpleNavigation />
        </NavigationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 