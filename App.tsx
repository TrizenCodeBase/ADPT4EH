import React from 'react';
import { Platform } from 'react-native';
import { NavigationProvider } from './src/SimpleNavigation';
import SimpleNavigation from './src/SimpleNavigation';
import { AuthProvider } from './src/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';

const App = () => {
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