import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Alert } from 'react-native';
import { api } from './api';
import { useNavigation } from './SimpleNavigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

const LocationConfirmationScreen = () => {
  const navigation = useNavigation();
  const { currentUser } = useAuth();
  const [isMobileView, setIsMobileView] = useState(false);
  const route = { params: navigation.params };
  // addressDetails and selectedLocation are expected to be passed via route.params
  console.log('LocationConfirmationScreen - route:', route);
  console.log('LocationConfirmationScreen - route.params:', route?.params);
  const address = useMemo(() => route?.params?.addressDetails || {}, [route?.params?.addressDetails]);
  const selectedLocation = useMemo(() => route?.params?.selectedLocation, [route?.params?.selectedLocation]);
  console.log('LocationConfirmationScreen - address:', address);
  console.log('LocationConfirmationScreen - selectedLocation:', selectedLocation);
  const areaName = address.area || address.doorNo || 'Selected Location';
  const fullAddress = selectedLocation?.address || [
    address.doorNo,
    address.area,
    address.city,
    address.state,
    address.pinCode,
    address.country
  ].filter(Boolean).join(', ');

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

  useEffect(() => {
    console.log('🔍 LocationConfirmationScreen - useEffect triggered');
    console.log('📍 Address details:', address);
    console.log('📍 Selected location:', selectedLocation);
    console.log('🧭 Navigation object:', navigation);
    
    const persistAndGo = async () => {
      console.log('🚀 LocationConfirmationScreen - persistAndGo called');
      
      // Try to save location data to Firestore, but don't block navigation if it fails
      if (currentUser) {
        try {
          const locationData = {
            address: fullAddress || areaName,
            lat: selectedLocation?.latitude || 0,
            lng: selectedLocation?.longitude || 0,
            addressDetails: address,
            selectedLocation: selectedLocation,
            updatedAt: new Date().toISOString()
          };
          console.log('💾 Attempting to save location data to Firestore:', locationData);
          
          // Save to Firestore directly
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            location: locationData,
            locationUpdatedAt: new Date().toISOString()
          });
          
          console.log('✅ Location data saved successfully to Firestore');
        } catch (firestoreError) {
          console.error('❌ Failed to save location data to Firestore:', firestoreError);
          
          // Fallback: Try the API method
          try {
            const location = {
              address: fullAddress || areaName,
              lat: selectedLocation?.latitude || 0,
              lng: selectedLocation?.longitude || 0,
            } as any;
            console.log('🔄 Trying API fallback for location save');
            
            const savePromise = api.upsertProfile({ name: 'User', roles: ['both'], location });
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Save timeout')), 5000)
            );
            
            await Promise.race([savePromise, timeoutPromise]);
            console.log('✅ Location data saved successfully via API');
          } catch (apiError) {
            console.error('❌ Failed to save location data via API:', apiError);
            console.log('⚠️ Continuing with navigation despite save failure');
            Alert.alert('Warning', 'Location saved locally but failed to sync with server. You can update it later.');
          }
        }
      } else {
        console.log('⚠️ No current user, skipping location save');
      }
      
      // Always attempt navigation, regardless of save success
      if (navigation && navigation.navigate) {
        console.log('🚀 LocationConfirmationScreen - Navigating to RoleSelection');
        try {
          navigation.navigate('RoleSelection');
          console.log('✅ Navigation to RoleSelection successful');
        } catch (navError) {
          console.error('❌ Navigation failed:', navError);
        }
      } else {
        console.log('❌ LocationConfirmationScreen - Navigation object not available');
      }
    };
    
    console.log('⏰ LocationConfirmationScreen - Setting timer for 1 second');
    const timer = setTimeout(persistAndGo, 1000);
    return () => {
      console.log('🧹 LocationConfirmationScreen - Cleaning up timer');
      clearTimeout(timer);
    };
  }, [navigation, address, selectedLocation, fullAddress, areaName, currentUser]);

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Content */}
                 <View style={styles.androidContent}>
           <View style={styles.androidPinContainer}>
             <View style={styles.androidPinOuter}>
               <Text style={styles.androidCheckIcon}>✓</Text>
             </View>
           </View>
          <Text style={styles.androidDeliveringText}>Delivering service at</Text>
          <Text style={styles.androidAreaName}>{areaName}</Text>
          <Text style={styles.androidFullAddress}>{fullAddress}</Text>
        </View>
      </View>
    );
  }

  // Desktop web layout (without back button)
  return (
    <View style={styles.container}>
             <View style={styles.content}>
         <View style={styles.pinContainer}>
           <View style={styles.pinOuter}>
             <Text style={styles.checkIcon}>✓</Text>
           </View>
         </View>
        <Text style={styles.deliveringText}>Delivering service at</Text>
        <Text style={styles.areaName}>{areaName}</Text>
        <Text style={styles.fullAddress}>{fullAddress}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Desktop web styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60,
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
  pinLine: {
    width: 2,
    height: 56,
    backgroundColor: '#888',
    marginBottom: -32,
  },
  checkIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  deliveringText: {
    color: PRIMARY_YELLOW,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  areaName: {
    color: DARK,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  fullAddress: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Mobile/Android styles
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingTop: 80,
  },
  androidBackButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: DARK,
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: DARK,
    fontWeight: 'bold',
  },
  androidContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
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
  androidPinLine: {
    width: 2,
    height: 56,
    backgroundColor: '#888',
    marginBottom: -32,
  },
  androidCheckIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  androidDeliveringText: {
    color: PRIMARY_YELLOW,
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  androidAreaName: {
    color: DARK,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  androidFullAddress: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LocationConfirmationScreen; 