// Test script to check backend connectivity
const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';

async function testBackend() {
  console.log('🧪 Testing backend connectivity...');
  
  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/v1/health`);
    console.log('Health response status:', healthResponse.status);
    console.log('Health response ok:', healthResponse.ok);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log('Health response data:', healthData);
    }
    
    // Test profiles endpoint (GET)
    console.log('🔍 Testing profiles/me endpoint...');
    const profilesResponse = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: This will fail without auth, but we can see the CORS headers
      }
    });
    console.log('Profiles response status:', profilesResponse.status);
    console.log('Profiles response ok:', profilesResponse.ok);
    console.log('Profiles CORS headers:', {
      'access-control-allow-origin': profilesResponse.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': profilesResponse.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': profilesResponse.headers.get('access-control-allow-headers')
    });
    
    if (profilesResponse.ok) {
      const profilesData = await profilesResponse.text();
      console.log('Profiles response data:', profilesData);
    }
    
  } catch (error) {
    console.error('❌ Backend test failed:', error);
  }
}

// Run the test
testBackend();
