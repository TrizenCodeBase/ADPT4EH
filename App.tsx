import React from 'react';
import { Platform } from 'react-native';
import { NavigationProvider } from './src/SimpleNavigation';
import SimpleNavigation from './src/SimpleNavigation';
import { AuthProvider } from './src/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <NavigationProvider>
        <SimpleNavigation />
      </NavigationProvider>
    </AuthProvider>
  );
};

export default App; 