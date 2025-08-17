// Web shim for leaflet CSS
// This file ensures leaflet CSS is only imported on web platform

// Global type declarations for Leaflet
declare global {
  interface Window {
    L: any;
  }
}

// Import leaflet CSS only on web
if (typeof window !== 'undefined') {
  // Dynamic import to avoid webpack issues
  import('leaflet/dist/leaflet.css').catch(() => {
    console.warn('Failed to load Leaflet CSS');
  });
}

// Re-export leaflet components
export { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
