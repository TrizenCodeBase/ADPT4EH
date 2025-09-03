// Test production backend health
async function testProductionBackend() {
  console.log('🔍 Testing Production Backend...\n');
  
  const backendUrl = 'http://localhost:4000';
  const frontendUrl = 'https://extrahand.in';
  
  // Test 1: Backend Health Endpoint
  console.log('1. Testing Backend Health Endpoint...');
  try {
    const healthResponse = await fetch(`${backendUrl}/api/v1/health`);
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   OK: ${healthResponse.ok}`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.text();
      console.log(`   Data: ${healthData}`);
    } else {
      console.log(`   Error: ${healthResponse.statusText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
  
  // Test 2: Frontend Health Endpoint
  console.log('2. Testing Frontend Health Endpoint...');
  try {
    const frontendResponse = await fetch(`${frontendUrl}/health`);
    console.log(`   Status: ${frontendResponse.status}`);
    console.log(`   OK: ${frontendResponse.ok}`);
    
    if (frontendResponse.ok) {
      const frontendData = await frontendResponse.text();
      console.log(`   Data: ${frontendData}`);
    } else {
      console.log(`   Error: ${frontendResponse.statusText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
  
  // Test 3: Frontend Main Page
  console.log('3. Testing Frontend Main Page...');
  try {
    const mainPageResponse = await fetch(frontendUrl);
    console.log(`   Status: ${mainPageResponse.status}`);
    console.log(`   OK: ${mainPageResponse.ok}`);
    
    if (mainPageResponse.ok) {
      const pageData = await mainPageResponse.text();
      console.log(`   Content Length: ${pageData.length} characters`);
      console.log(`   Is HTML: ${pageData.includes('<!DOCTYPE html>')}`);
    } else {
      console.log(`   Error: ${mainPageResponse.statusText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
  
  console.log('');
  
  // Test 4: Backend with proper headers
  console.log('4. Testing Backend with CORS Headers...');
  try {
    const corsResponse = await fetch(`${backendUrl}/api/v1/health`, {
      method: 'GET',
      headers: {
        'Origin': 'https://extrahand.in',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(`   Status: ${corsResponse.status}`);
    console.log(`   OK: ${corsResponse.ok}`);
    
    if (corsResponse.ok) {
      const corsData = await corsResponse.text();
      console.log(`   Data: ${corsData}`);
    } else {
      console.log(`   Error: ${corsResponse.statusText}`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

// Run the test
testProductionBackend().catch(console.error);
