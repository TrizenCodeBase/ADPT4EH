// Web shim for react-native-maps
import React from 'react';
import { View, Text } from 'react-native';

// Mock MapView component for web
export const MapView: React.FC<any> = ({ children, style, ...props }) => {
  return (
    <View style={[style, { backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: '#6b7280', fontSize: 16 }}>Map View (Web)</Text>
      <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 8 }}>Interactive maps available on mobile</Text>
      {children}
    </View>
  );
};

// Mock Marker component
export const Marker: React.FC<any> = ({ children, ...props }) => {
  return <View>{children}</View>;
};

// Mock PROVIDER_GOOGLE constant
export const PROVIDER_GOOGLE = 'google';

// Export all as default
export default {
  MapView,
  Marker,
  PROVIDER_GOOGLE,
};
