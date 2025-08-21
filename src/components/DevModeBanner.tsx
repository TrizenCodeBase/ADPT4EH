import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DevModeBannerProps {
  isVisible: boolean;
  message?: string;
}

const DevModeBanner: React.FC<DevModeBannerProps> = ({ 
  isVisible, 
  message = "DEVELOPMENT MODE - Using Mock Data" 
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bannerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DevModeBanner;
