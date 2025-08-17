import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InteractiveMap from './InteractiveMap';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

const MapTest: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    latitude: 17.3850,
    longitude: 78.4867
  });

  const handleLocationSelect = (location: Location) => {
    console.log('Location selected:', location);
    setSelectedLocation(location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Interactive Map Test</Text>
      <Text style={styles.subtitle}>Testing Leaflet Map Integration</Text>
      
      <View style={styles.mapContainer}>
        <InteractiveMap
          initialLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          height={400}
          width="100%"
          showCurrentLocation={true}
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Selected Location: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
        </Text>
        {selectedLocation.address && (
          <Text style={styles.addressText}>Address: {selectedLocation.address}</Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.testButton}
        onPress={() => {
          const newLocation = {
            latitude: 17.3850 + (Math.random() - 0.5) * 0.01,
            longitude: 78.4867 + (Math.random() - 0.5) * 0.01,
          };
          setSelectedLocation(newLocation);
        }}
      >
        <Text style={styles.buttonText}>Test Random Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  mapContainer: {
    height: 400,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapTest;
