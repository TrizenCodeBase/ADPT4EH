// Simple test script to verify API calls
const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com/';

async function testAPI() {
  console.log('🧪 Testing API endpoints...');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/v1/health`);
    console.log('Health status:', healthResponse.status);
    
    // Test CORS preflight
    console.log('2. Testing CORS preflight...');
    const corsResponse = await fetch(`${API_BASE_URL}/api/v1/health`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('CORS preflight status:', corsResponse.status);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': corsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': corsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': corsResponse.headers.get('Access-Control-Allow-Headers')
    });
    
    // Test profile endpoint (should fail without auth)
    console.log('3. Testing profile endpoint without auth...');
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/api/v1/profiles/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:8080'
        }
      });
      console.log('Profile status:', profileResponse.status);
      const profileData = await profileResponse.text();
      console.log('Profile response:', profileData);
    } catch (error) {
      console.log('Profile error (expected):', error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPI();
