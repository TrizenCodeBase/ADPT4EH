import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const GRAY = '#888';

const ChooseLocationMethodScreen = () => {
  const navigation = useNavigation();
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if we're on mobile web view
  useEffect(() => {
    const checkScreenSize = () => {
      if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        setIsMobileView(width <= 768);
      } else {
        setIsMobileView(true); // Always frameless on native mobile
      }
    };

    checkScreenSize();
    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkScreenSize);
      return () => subscription?.remove();
    }
  }, []);

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Pin Icon */}
        <View style={styles.androidPinContainer}>
          <View style={styles.androidPinOuter}>
            <View style={styles.androidPinInner} />
          </View>
          <View style={styles.androidPinLine} />
          <View style={styles.androidPinShadow} />
        </View>

        {/* Question */}
        <Text style={styles.androidQuestion}>Where do you want your services?</Text>

        {/* Buttons */}
        <TouchableOpacity
          style={styles.androidCurrentLocationBtn}
          onPress={() => navigation.navigate('LocationInput')}
        >
          <Text style={styles.androidCurrentLocationText}>At my current location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.androidManualLocationBtn}
          onPress={() => navigation.navigate('SearchLocation')}
        >
          <Text style={styles.androidManualLocationText}>I'll enter my location manually</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Desktop web layout (with form frame)
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Pin Icon */}
        <View style={styles.pinContainer}>
          <View style={styles.pinOuter}>
            <View style={styles.pinInner} />
          </View>
          <View style={styles.pinLine} />
          <View style={styles.pinShadow} />
        </View>
        <Text style={styles.question}>Where do you want your services?</Text>
        <TouchableOpacity
          style={styles.currentLocationBtn}
          onPress={() => {
            console.log('ChooseLocationMethod - Current location button pressed');
            console.log('Navigation object:', navigation);
            navigation.navigate('LocationInput');
          }}
        >
          <Text style={styles.currentLocationText}>At my current location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manualLocationBtn}
          onPress={() => {
            console.log('ChooseLocationMethod - Manual location button pressed');
            console.log('Navigation object:', navigation);
            navigation.navigate('SearchLocation');
          }}
        >
          <Text style={styles.manualLocationText}>I'll enter my location manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Web styles (existing)
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60, // Add space to center content better
  },
  pinContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pinOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pinInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  pinLine: {
    width: 2,
    height: 56,
    backgroundColor: DARK,
    marginBottom: -32,
  },
  pinShadow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f9b23340',
  },
  question: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 32,
  },
  currentLocationBtn: {
    width: '90%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  currentLocationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  manualLocationBtn: {
    width: '90%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 0,
  },
  manualLocationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Android-specific styles
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 80, // Add space for back button
  },
  androidBackButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    flexDirection: 'row', // Added for arrow and text alignment
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: DARK,
    marginRight: 8, // Space between arrow and text
  },
  backText: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
  },
  androidPinContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  androidPinOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: PRIMARY_YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  androidPinInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  androidPinLine: {
    width: 2,
    height: 56,
    backgroundColor: DARK,
    marginBottom: -32,
  },
  androidPinShadow: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f9b23340',
  },
  androidQuestion: {
    fontSize: 18,
    color: DARK,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
  },
  androidCurrentLocationBtn: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  androidCurrentLocationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  androidManualLocationBtn: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 0,
  },
  androidManualLocationText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChooseLocationMethodScreen; 