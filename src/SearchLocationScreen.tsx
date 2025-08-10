import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const GRAY = '#888';
const LIGHT_GRAY = '#f5f5f5';

const SearchLocationScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('Gachibowli');
  const [isSearchFocused, setIsSearchFocused] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const searchInputRef = useRef<TextInput>(null);

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

  // Mock search results - in real app, these would come from Google Places API
  const searchResults = [
    {
      id: '1',
      name: 'Gachibowli',
      address: 'Hyderabad, Telangana, India'
    },
    {
      id: '2',
      name: 'Gachibowli ORR Entrance toward...',
      address: 'Telecom Nagar, Gachibowli, Hyderabad, Telangana, India'
    },
    {
      id: '3',
      name: 'Gachibowli Circle',
      address: 'Mushroom Rock Road, Gachibowli, Hyderabad, Telangana, India'
    },
    {
      id: '4',
      name: 'Gachibowli Stadium',
      address: 'Diamond Hills, Rajiv Gandhi Nagar, Gachibowli, Hyderabad, Telangana, India'
    },
    {
      id: '5',
      name: 'Gachibowli Flyover',
      address: 'Gachibowli, Hyderabad, Telangana, India'
    }
  ];

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUseCurrentLocation = () => {
    // Mock current location data
    const currentLocation = {
      doorNo: 'Current Location',
      area: 'Your Current Location',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500032',
      country: 'India'
    };
    
    navigation.navigate('LocationConfirmation', { addressDetails: currentLocation });
  };

  const handleLocationSelect = (location: any) => {
    // Parse the location data for LocationConfirmation
    const addressDetails = {
      doorNo: location.name,
      area: location.name,
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500032',
      country: 'India',
      fullAddress: location.address
    };
    
    navigation.navigate('LocationConfirmation', { addressDetails });
  };

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={handleBackPress}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.androidContent}>
          {/* Search Header */}
          <View style={styles.androidSearchHeader}>
            <TextInput
              ref={searchInputRef}
              style={styles.androidSearchInput}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search location..."
              placeholderTextColor={GRAY}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>

          {/* Use Current Location Option */}
          <TouchableOpacity style={styles.androidCurrentLocationRow} onPress={handleUseCurrentLocation}>
            <View style={styles.androidCurrentLocationIcon}>
              <Text style={styles.targetIcon}>🎯</Text>
            </View>
            <Text style={styles.androidCurrentLocationText}>Use current location</Text>
          </TouchableOpacity>

          {/* Search Results */}
          <ScrollView style={styles.androidResultsContainer} showsVerticalScrollIndicator={false}>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.androidResultRow}
                onPress={() => handleLocationSelect(result)}
              >
                <View style={styles.androidLocationIcon}>
                  <Text style={styles.pinIcon}>📍</Text>
                </View>
                <View style={styles.androidResultTextContainer}>
                  <Text style={styles.androidResultName}>{result.name}</Text>
                  <Text style={styles.androidResultAddress}>{result.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Powered by Google */}
          <View style={styles.androidPoweredByContainer}>
            <Text style={styles.poweredByText}>powered by </Text>
            <Text style={styles.googleText}>Google</Text>
          </View>
        </View>
      </View>
    );
  }

  // Desktop web layout (without back button)
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search location..."
            placeholderTextColor={GRAY}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </View>

          {/* Use Current Location Option */}
          <TouchableOpacity style={styles.currentLocationRow} onPress={handleUseCurrentLocation}>
            <View style={styles.currentLocationIcon}>
              <Text style={styles.targetIcon}>🎯</Text>
            </View>
            <Text style={styles.currentLocationText}>Use current location</Text>
          </TouchableOpacity>

          {/* Search Results */}
          <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
            {searchResults.map((result) => (
              <TouchableOpacity
                key={result.id}
                style={styles.resultRow}
                onPress={() => handleLocationSelect(result)}
              >
                <View style={styles.locationIcon}>
                  <Text style={styles.pinIcon}>📍</Text>
                </View>
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <Text style={styles.resultAddress}>{result.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Powered by Google */}
          <View style={styles.poweredByContainer}>
            <Text style={styles.poweredByText}>powered by </Text>
            <Text style={styles.googleText}>Google</Text>
          </View>
        </View>
      </div>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backIcon: {
    fontSize: 20,
    color: DARK,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: PRIMARY_YELLOW,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: DARK,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 12,
  },
  currentLocationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetIcon: {
    fontSize: 20,
    color: '#fff',
  },
  currentLocationText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  resultsContainer: {
    flex: 1,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIcon: {
    fontSize: 18,
    color: GRAY,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 18,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
  },
  poweredByText: {
    fontSize: 12,
    color: GRAY,
  },
  googleText: {
    fontSize: 12,
    color: '#4285F4',
    fontWeight: 'bold',
  },

  // Mobile/Android styles
  androidContainer: {
    flex: 1,
    backgroundColor: '#fff',
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
    flex: 1,
    paddingHorizontal: 16,
  },
  androidSearchHeader: {
    marginBottom: 16,
  },
  androidSearchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: PRIMARY_YELLOW,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
    color: DARK,
    backgroundColor: '#fff',
  },
  androidCurrentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: PRIMARY_YELLOW,
    borderRadius: 12,
    marginBottom: 12,
  },
  androidCurrentLocationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidCurrentLocationText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  androidResultsContainer: {
    flex: 1,
  },
  androidResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
  },
  androidLocationIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidResultTextContainer: {
    flex: 1,
  },
  androidResultName: {
    fontSize: 16,
    color: DARK,
    fontWeight: '500',
    marginBottom: 2,
  },
  androidResultAddress: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 18,
  },
  androidPoweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
  },
});

export default SearchLocationScreen; 