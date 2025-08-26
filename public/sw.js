// Service Worker for ExtraHand - Disabled for Development
// This service worker is disabled to prevent CORS issues during development

self.addEventListener('install', (event) => {
  console.log('Service Worker installing (disabled)...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating (disabled)...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Disable service worker for development - let all requests pass through
  event.respondWith(fetch(event.request));
});
