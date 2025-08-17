import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { reverseGeocode, type Location } from '../services/geocoding';

interface InteractiveMapProps {
  initialLocation?: Location;
  onLocationSelect?: (location: Location) => void;
  height?: number;
  width?: number | string;
  showCurrentLocation?: boolean;
}

// Real Interactive Map Component for Web using Leaflet
const WebMap: React.FC<InteractiveMapProps> = ({ 
  initialLocation, 
  onLocationSelect, 
  height = 300, 
  width = '100%',
  showCurrentLocation = true 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    initialLocation || { latitude: 17.3850, longitude: 78.4867 } // Default: Hyderabad
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<string>('Loading address...');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 20; // Maximum 1 second of retries (20 * 50ms)

  const fetchAddressForLocation = useCallback(async (lat: number, lng: number) => {
    try {
      const geocoded = await reverseGeocode(lat, lng);
      const address = geocoded.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentAddress(address);
      return address;
    } catch (error) {
      console.error('Failed to fetch address:', error);
      const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setCurrentAddress(fallbackAddress);
      return fallbackAddress;
    }
  }, []);

  const initializeMap = useCallback(async () => {
    if (isInitializing || mapInstanceRef.current) {
      return;
    }

    setIsInitializing(true);
    setLoadingError(null);

    try {
      console.log('🗺️ Starting map initialization...');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }

      // Check if map container exists and has dimensions
      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      const container = mapRef.current;

      // Load Leaflet CSS first
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        console.log('🎨 Adding Leaflet CSS...');
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);
        
        // Wait for CSS to load
        await new Promise((resolve) => {
          link.onload = resolve;
          link.onerror = resolve; // Continue even if CSS fails
        });
      }

      // Import Leaflet
      console.log('📦 Importing Leaflet...');
      const L = await import('leaflet');
      console.log('✅ Leaflet imported successfully');

      // Initialize map
      console.log('🗺️ Creating map instance...');
      mapInstanceRef.current = L.map(container).setView(
        [selectedLocation.latitude, selectedLocation.longitude], 
        13
      );
      console.log('✅ Map instance created');

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      console.log('✅ Tile layer added');

      // Add marker
      markerRef.current = L.marker([selectedLocation.latitude, selectedLocation.longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup('Selected Location');
      console.log('✅ Marker added');

      // Handle map clicks
      mapInstanceRef.current.on('click', async (e: any) => {
        const { lat, lng } = e.latlng;
        const newLocation = { latitude: lat, longitude: lng };
        console.log('🗺️ Map clicked at:', newLocation);
        
        // Update marker position
        markerRef.current.setLatLng([lat, lng]);
        
        // Update state
        setSelectedLocation(newLocation);
        onLocationSelect?.(newLocation);

        // Fetch and update address
        await fetchAddressForLocation(lat, lng);
      });

      // Force a map refresh after initialization
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          console.log('✅ Map size invalidated');
        }
      }, 100);

      setMapLoaded(true);
      console.log('✅ Map loaded successfully');
    } catch (error) {
      console.error('❌ Failed to initialize map:', error);
      setLoadingError(error instanceof Error ? error.message : 'Unknown error');
      setMapLoaded(false);
    } finally {
      setIsInitializing(false);
    }
  }, [selectedLocation.latitude, selectedLocation.longitude, onLocationSelect, isInitializing, fetchAddressForLocation]);

  useEffect(() => {
    // Clear any existing timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Wait for the container to be properly rendered and available
    const waitForContainer = () => {
      console.log('🔍 Checking for map container...');
      console.log('mapRef.current:', mapRef.current);
      
      if (mapRef.current) {
        const container = mapRef.current;
        const rect = container.getBoundingClientRect();
        console.log('📏 Container dimensions:', rect.width, 'x', rect.height);
        console.log('📏 Container style:', container.style.width, 'x', container.style.height);
        console.log('📏 Container computed style:', window.getComputedStyle(container).width, 'x', window.getComputedStyle(container).height);
        
        if (rect.width > 0 && rect.height > 0) {
          console.log('✅ Map container found with proper dimensions, initializing...');
          retryCountRef.current = 0; // Reset retry count
          initializeMap();
        } else {
          console.log('⏳ Container found but has no dimensions, waiting...');
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            initTimeoutRef.current = setTimeout(waitForContainer, 50);
          } else {
            console.error('❌ Map container has no dimensions after maximum retries');
            setLoadingError('Map container has no dimensions');
            setMapLoaded(false);
          }
        }
      } else if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        console.log(`⏳ Waiting for map container... (attempt ${retryCountRef.current}/${MAX_RETRIES})`);
        initTimeoutRef.current = setTimeout(waitForContainer, 50);
      } else {
        console.error('❌ Map container not found after maximum retries');
        setLoadingError('Map container not found after maximum retries');
        setMapLoaded(false);
      }
    };

    // Start waiting for container
    initTimeoutRef.current = setTimeout(waitForContainer, 100);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      retryCountRef.current = 0; // Reset retry count
      if (mapInstanceRef.current) {
        console.log('🗺️ Cleaning up map instance');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  // Initialize address when component loads
  useEffect(() => {
    fetchAddressForLocation(selectedLocation.latitude, selectedLocation.longitude);
  }, [fetchAddressForLocation, selectedLocation.latitude, selectedLocation.longitude]);

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setView([newLocation.latitude, newLocation.longitude], 15);
            markerRef.current.setLatLng([newLocation.latitude, newLocation.longitude]);
          }
          
          setSelectedLocation(newLocation);
          onLocationSelect?.(newLocation);
          
          // Fetch and update address for current location
          await fetchAddressForLocation(newLocation.latitude, newLocation.longitude);
        },
        (_error) => {
          Alert.alert('Location Error', 'Unable to get your current location. Please select manually.');
        }
      );
    } else {
      Alert.alert('Location Error', 'Geolocation is not supported by this browser.');
    }
  };

  const handleRetry = () => {
    setLoadingError(null);
    setMapLoaded(false);
    retryCountRef.current = 0; // Reset retry count
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    initializeMap();
  };

  // Show error state if map failed to load
  if (loadingError) {
    return (
      <View style={[styles.webMapContainer, { height, width: width as any }]}>
        <div 
          ref={(el) => {
            mapRef.current = el;
            if (el) {
              console.log('🎯 Map container div rendered (error state):', el);
            }
          }}
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: 12,
            zIndex: 1,
            position: 'relative'
          }}
        >
          <TouchableOpacity 
            style={styles.mapPlaceholder}
            onPress={handleRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.mapPlaceholderText}>🗺️ Map Loading Error</Text>
            <Text style={styles.mapPlaceholderSubtext}>Tap to retry</Text>
            <Text style={styles.mapPlaceholderCoords}>
              Error: {loadingError}
            </Text>
          </TouchableOpacity>
        </div>
      </View>
    );
  }

  // Show loading state
  if (!mapLoaded || isInitializing) {
    return (
      <View style={[styles.webMapContainer, { height, width: width as any }]}>
        <div 
          ref={(el) => {
            mapRef.current = el;
            if (el) {
              console.log('🎯 Map container div rendered (loading state):', el);
            }
          }}
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: 12,
            zIndex: 1,
            position: 'relative'
          }}
        >
          <TouchableOpacity 
            style={styles.mapPlaceholder}
            onPress={() => {
              const newLocation = {
                latitude: 17.3850 + (Math.random() - 0.5) * 0.01,
                longitude: 78.4867 + (Math.random() - 0.5) * 0.01,
              };
              setSelectedLocation(newLocation);
              onLocationSelect?.(newLocation);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.mapPlaceholderText}>🗺️ Interactive Map</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              {isInitializing ? 'Initializing map...' : 'Loading map...'}
            </Text>
            <Text style={styles.mapPlaceholderCoords}>
              Lat: {selectedLocation.latitude.toFixed(4)}, Lng: {selectedLocation.longitude.toFixed(4)}
            </Text>
            <Text style={styles.mapPlaceholderAddress}>
              {currentAddress}
            </Text>
          </TouchableOpacity>
          
          {showCurrentLocation && (
            <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
              <Text style={styles.currentLocationIcon}>📍</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              {selectedLocation.address || `Lat: ${selectedLocation.latitude.toFixed(4)}, Lng: ${selectedLocation.longitude.toFixed(4)}`}
            </Text>
          </View>
        </div>
      </View>
    );
  }

  return (
    <View style={[styles.webMapContainer, { height, width: width as any }]}>
      <div 
        ref={(el) => {
          mapRef.current = el;
          if (el) {
            console.log('🎯 Map container div rendered:', el);
          }
        }}
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: 12,
          zIndex: 1,
          position: 'relative'
        }}
      />
      
      {/* Debug panel - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugText}>
            Map Status: {mapLoaded ? 'Loaded' : isInitializing ? 'Initializing' : 'Not Loaded'}
          </Text>
          {loadingError && (
            <Text style={styles.debugError}>Error: {loadingError}</Text>
          )}
        </View>
      )}
      
      {showCurrentLocation && (
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
          <Text style={styles.currentLocationIcon}>📍</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          {currentAddress}
        </Text>
      </View>
    </View>
  );
};

// Mobile Map Component (placeholder for now)
const MobileMap: React.FC<InteractiveMapProps> = ({ 
  initialLocation, 
  onLocationSelect, 
  height = 300, 
  width = '100%',
  showCurrentLocation = true 
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    initialLocation || { latitude: 17.3850, longitude: 78.4867 } // Default: Hyderabad
  );

  const handleMapPress = () => {
    // Simulate map press - in real implementation this would get coordinates
    const newLocation = {
      latitude: 17.3850 + (Math.random() - 0.5) * 0.01,
      longitude: 78.4867 + (Math.random() - 0.5) * 0.01,
    };
    setSelectedLocation(newLocation);
    onLocationSelect?.(newLocation);
  };

  const handleCurrentLocation = () => {
    Alert.alert('Current Location', 'Getting current location...');
    // Implementation would go here
  };

  return (
    <View style={[styles.mobileMapContainer, { height, width: width as any }]}>
      <TouchableOpacity 
        style={styles.mapPlaceholder}
        onPress={handleMapPress}
        activeOpacity={0.8}
      >
        <Text style={styles.mapPlaceholderText}>🗺️ Interactive Map</Text>
        <Text style={styles.mapPlaceholderSubtext}>Tap to select location</Text>
        <Text style={styles.mapPlaceholderCoords}>
          Lat: {selectedLocation.latitude.toFixed(4)}, Lng: {selectedLocation.longitude.toFixed(4)}
        </Text>
      </TouchableOpacity>
      
      {showCurrentLocation && (
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleCurrentLocation}>
          <Text style={styles.currentLocationIcon}>📍</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.locationInfo}>
        <Text style={styles.locationText}>
          {selectedLocation.address || `Lat: ${selectedLocation.latitude.toFixed(4)}, Lng: ${selectedLocation.longitude.toFixed(4)}`}
        </Text>
      </View>
    </View>
  );
};

// Main InteractiveMap Component
const InteractiveMap: React.FC<InteractiveMapProps> = (props) => {
  const isWeb = Platform.OS === 'web';
  
  if (isWeb) {
    return <WebMap {...props} />;
  } else {
    return <MobileMap {...props} />;
  }
};

const styles = StyleSheet.create({
  webMapContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mobileMapContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mapPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  mapPlaceholderCoords: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
  mapPlaceholderAddress: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  currentLocationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  currentLocationIcon: {
    fontSize: 20,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  debugPanel: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 100,
  },
  debugText: {
    color: '#fff',
    fontSize: 12,
  },
  debugError: {
    color: '#ff6b6b',
    fontSize: 12,
  },
});

export default InteractiveMap;
