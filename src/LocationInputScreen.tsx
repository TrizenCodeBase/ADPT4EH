import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Modal, ScrollView, Alert } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import InteractiveMap from './components/InteractiveMap';

import { reverseGeocode, type Location } from './services/geocoding';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

const LocationInputScreen = () => {
  const navigation = useNavigation();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [addressDetails, setAddressDetails] = useState({
    doorNo: '',
    area: '',
    city: '',
    state: '',
    pinCode: '',
    country: ''
  });

  const locationTags = useMemo(() => [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'office', label: 'office', icon: '🏢' },
    { id: 'other', label: 'other', icon: '❤️' }
  ], []);

  const handleLocationSelect = useCallback(async (location: Location) => {
    setSelectedLocation(location);
    
    try {
      // Get detailed address from coordinates
      const geocoded = await reverseGeocode(location.latitude, location.longitude);
      
      // Update the location with the fetched address
      const locationWithAddress = {
        ...location,
        address: geocoded.address
      };
      setSelectedLocation(locationWithAddress);
      
      // Update address details with geocoded information
      setAddressDetails({
        doorNo: geocoded.components.street || '',
        area: geocoded.components.street || '',
        city: geocoded.components.city || '',
        state: geocoded.components.state || '',
        pinCode: geocoded.components.postalCode || '',
        country: geocoded.components.country || ''
      });
    } catch (error) {
      console.error('Failed to geocode location:', error);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    console.log('🔍 LocationInput - handleConfirm called - START');
    
    if (!selectedLocation) {
      console.log('❌ LocationInput - No location selected, showing alert');
      Alert.alert('No Location Selected', 'Please select a location on the map first.');
      return;
    }
    
    console.log('✅ LocationInput - Location selected, proceeding with navigation');
    console.log('📍 Selected location:', selectedLocation);
    console.log('📝 Address details:', addressDetails);
    console.log('🧭 Navigation object:', navigation);
    console.log('🔧 Navigation methods available:', {
      navigate: typeof navigation?.navigate,
      goBack: typeof navigation?.goBack,
      currentRoute: navigation?.currentRoute
    });
    
    if (navigation && navigation.navigate) {
      console.log('🚀 LocationInput - Navigation object available, attempting navigation');
      try {
        const params = { 
          addressDetails,
          selectedLocation 
        };
        console.log('📦 Navigation params:', params);
        
        console.log('🔄 LocationInput - Calling navigation.navigate...');
        navigation.navigate('LocationConfirmation', params);
        console.log('✅ LocationInput - Navigation call completed successfully');
        
        // Add a small delay to ensure navigation completes
        setTimeout(() => {
          console.log('⏰ LocationInput - After navigation delay, checking route');
          console.log('📍 Current route should be LocationConfirmation');
          console.log('🔍 Navigation object after delay:', {
            currentRoute: navigation?.currentRoute,
            navigate: typeof navigation?.navigate
          });
        }, 500);
        
      } catch (error) {
        console.error('❌ LocationInput - Navigation failed with error:', error);
        Alert.alert('Navigation Error', 'Failed to navigate to confirmation screen. Please try again.');
      }
    } else {
      console.log('❌ LocationInput - Navigation object is null or navigate is not available');
      console.log('🔍 Navigation object details:', {
        navigation: !!navigation,
        navigate: typeof navigation?.navigate,
        goBack: typeof navigation?.goBack
      });
      Alert.alert('Navigation Error', 'Navigation is not available. Please refresh the page.');
    }
    
    console.log('🔍 LocationInput - Closing modal');
    setShowLocationModal(false);
    console.log('🔍 LocationInput - handleConfirm called - END');
  }, [selectedLocation, addressDetails, navigation]);

  const handleAddressChange = useCallback((field: string, value: string) => {
    setAddressDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleTagSelect = useCallback((tagId: string) => {
    setSelectedTag(tagId);
  }, []);

  const handleModalClose = useCallback(() => {
    setShowLocationModal(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setShowLocationModal(true);
  }, []);

  const LocationDetailsModal = useMemo(() => (
    <Modal
      visible={showLocationModal}
      animationType="slide"
      transparent={true}
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enter Location details</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Location Tagging Section */}
            <View style={styles.tagSection}>
              <Text style={styles.tagLabel}>Tag this location for later</Text>
              <View style={styles.tagButtons}>
                {locationTags.map((tag) => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.tagButton,
                      selectedTag === tag.id && styles.tagButtonSelected
                    ]}
                    onPress={() => handleTagSelect(tag.id)}
                  >
                    <Text style={styles.tagIcon}>{tag.icon}</Text>
                    <Text style={[
                      styles.tagText,
                      selectedTag === tag.id && styles.tagTextSelected
                    ]}>
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Address Input Fields */}
            <View style={styles.inputSection}>
              {/* Door No & Building Name */}
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Door No & Building Name"
                    value={addressDetails.doorNo}
                    onChangeText={(text) => handleAddressChange('doorNo', text)}
                  />
                  <Text style={styles.updateText}>Updated based on your exact map pin</Text>
                </View>
                <TouchableOpacity style={styles.changeButton}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>

              {/* Area & Street */}
              <TextInput
                style={styles.inputField}
                placeholder="Area & Street"
                value={addressDetails.area}
                onChangeText={(text) => handleAddressChange('area', text)}
              />

              {/* City */}
              <TextInput
                style={styles.inputField}
                placeholder="Enter your City"
                value={addressDetails.city}
                onChangeText={(text) => handleAddressChange('city', text)}
              />

              {/* State */}
              <TextInput
                style={styles.inputField}
                placeholder="State"
                value={addressDetails.state}
                onChangeText={(text) => handleAddressChange('state', text)}
              />

              {/* Pin Code and Country */}
              <View style={styles.horizontalInputs}>
                <TextInput
                  style={[styles.inputField, styles.halfInput]}
                  placeholder="Pin code"
                  value={addressDetails.pinCode}
                  onChangeText={(text) => handleAddressChange('pinCode', text)}
                />
                <TextInput
                  style={[styles.inputField, styles.halfInput]}
                  placeholder="Country"
                  value={addressDetails.country}
                  onChangeText={(text) => handleAddressChange('country', text)}
                />
              </View>
            </View>
          </ScrollView>

                     {/* Confirm Button */}
           <TouchableOpacity 
             style={styles.confirmButton} 
             onPress={() => {
               console.log('🔘 LocationInput - Confirm button pressed!');
               handleConfirm();
             }}
           >
             <Text style={styles.confirmButtonText}>Confirm</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ), [showLocationModal, selectedTag, addressDetails, locationTags, handleTagSelect, handleAddressChange, handleConfirm, handleModalClose]);

  if (Platform.select({ web: true, default: false })) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', background: '#fff' }}>
        <View style={styles.container}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <Text style={styles.topBarText}>confirm your Location</Text>
            <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search bar */}
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for area, Street name..."
              placeholderTextColor="#999"
            />
          </View>
          
          {/* Interactive Map for web */}
          <View style={styles.mapContainer}>
            <InteractiveMap
              onLocationSelect={handleLocationSelect}
              height={Platform.OS === 'web' ? 450 : 400}
              width="100%"
              showCurrentLocation={true}
            />
          </View>
          
          {/* Location details */}
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>Your Current Location</Text>
            <TouchableOpacity>
              <Text style={styles.changeText}>CHANGE</Text>
            </TouchableOpacity>
          </View>
          
          {/* Address display with pin icon */}
          <View style={styles.addressContainer}>
            <Text style={styles.locationPin}>📍</Text>
            <Text style={styles.addressText}>
              {selectedLocation?.address || 'Tap on the map to select your location'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleModalOpen}
          >
            <Text style={styles.addButtonText}>Add more address details</Text>
          </TouchableOpacity>
        </View>
        {LocationDetailsModal}
      </div>
    );
  }
  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>confirm your Location</Text>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for area, Street name..."
          placeholderTextColor="#999"
        />
      </View>
      
      {/* Interactive Map for mobile */}
      <View style={styles.mapContainer}>
        <InteractiveMap
          onLocationSelect={handleLocationSelect}
          height={Platform.OS === 'web' ? 450 : 400}
          width="100%"
          showCurrentLocation={true}
        />
      </View>
      
      {/* Location details */}
      <View style={styles.locationDetails}>
        <Text style={styles.locationLabel}>Your Current Location</Text>
        <TouchableOpacity>
          <Text style={styles.changeText}>CHANGE</Text>
        </TouchableOpacity>
      </View>
      
      {/* Address display with pin icon */}
      <View style={styles.addressContainer}>
        <Text style={styles.locationPin}>📍</Text>
        <Text style={styles.addressText}>
          {selectedLocation?.address || 'Tap on the map to select your location'}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleModalOpen}
      >
        <Text style={styles.addButtonText}>Add more address details</Text>
      </TouchableOpacity>
      
      {LocationDetailsModal}
    </View>
  );
};

export default LocationInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 8,
  },
  topBarText: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
  },
  skipText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 16,
  },
  searchBar: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: Platform.OS === 'web' ? '0 2px 8px rgba(0,0,0,0.1)' : undefined,
    elevation: Platform.OS === 'android' ? 2 : 0,
    marginTop: 8,
    marginBottom: 16,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 12,
    marginRight: 8,
    color: '#6b7280',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  mapContainer: {
    width: '90%',
    height: Platform.OS === 'web' ? 450 : 400,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  locationDetails: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationLabel: {
    fontSize: 15,
    color: DARK,
    fontWeight: '500',
  },
  changeText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 15,
  },
  addButton: {
    width: '90%',
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  locationPin: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
    color: '#ef4444',
  },
  addressText: {
    flex: 1,
    fontSize: 15,
    color: DARK,
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK,
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: DARK,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  tagSection: {
    marginBottom: 20,
  },
  tagLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tagButtonSelected: {
    backgroundColor: PRIMARY_YELLOW,
    borderColor: PRIMARY_YELLOW,
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  inputSection: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  updateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  changeButton: {
    paddingVertical: 8,
  },
  changeButtonText: {
    color: PRIMARY_YELLOW,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  confirmButton: {
    backgroundColor: PRIMARY_YELLOW,
    margin: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 