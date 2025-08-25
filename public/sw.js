// Service Worker for ExtraHand - API Proxy
const CACHE_NAME = 'extrahand-v1';
const API_BASE = 'https://extrahandbackend.llp.trizenventures.com';

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Intercept API calls to the backend
  if (url.hostname === 'extrahandbackend.llp.trizenventures.com') {
    console.log('Intercepting API call:', url.href);
    
    // Create a new request to the frontend domain
    const frontendUrl = new URL(event.request.url);
    frontendUrl.hostname = 'extrahand.in';
    frontendUrl.pathname = '/api' + url.pathname;
    
    const newRequest = new Request(frontendUrl.href, {
      method: event.request.method,
      headers: event.request.headers,
      body: event.request.body,
      mode: 'cors',
      credentials: 'include'
    });
    
    event.respondWith(fetch(newRequest));
    return;
  }
  
  // For all other requests, use the default behavior
  event.respondWith(fetch(event.request));
});
