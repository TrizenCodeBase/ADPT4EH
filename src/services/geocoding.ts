interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GeocodingResult {
  address: string;
  components: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

// Free geocoding service using OpenStreetMap Nominatim API
export const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodingResult> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Extrahand-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    return {
      address: data.display_name || 'Unknown location',
      components: {
        street: data.address?.road || data.address?.house_number,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country,
        postalCode: data.address?.postcode,
      },
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {
      address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
      components: {},
    };
  }
};

// Forward geocoding - convert address to coordinates
export const forwardGeocode = async (address: string): Promise<Location | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Extrahand-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        address: result.display_name,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Forward geocoding error:', error);
    return null;
  }
};

// Get current location using browser geolocation
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Get address for current location
        try {
          const geocoded = await reverseGeocode(location.latitude, location.longitude);
          location.address = geocoded.address;
        } catch (error) {
          console.warn('Failed to get address for current location:', error);
        }

        resolve(location);
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

// Search for places (limited functionality with free API)
export const searchPlaces = async (query: string): Promise<Array<{ name: string; address: string; location: Location }>> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          'User-Agent': 'Extrahand-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Place search request failed');
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.name || item.display_name.split(',')[0],
      address: item.display_name,
      location: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        address: item.display_name,
      },
    }));
  } catch (error) {
    console.error('Place search error:', error);
    return [];
  }
};

export type { Location, GeocodingResult };
