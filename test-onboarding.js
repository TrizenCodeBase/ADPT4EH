// Test script to verify onboarding flow
console.log('🧪 Testing Onboarding Flow...');

// Test 1: Check if localStorage has onboarding data
console.log('\n📋 Test 1: Checking localStorage onboarding data');
const onboardingData = localStorage.getItem('extrahand_onboarding');
console.log('Onboarding data:', onboardingData ? JSON.parse(onboardingData) : 'null');

// Test 2: Check if localStorage has session data
console.log('\n📋 Test 2: Checking localStorage session data');
const sessionData = localStorage.getItem('extrahand_session');
console.log('Session data:', sessionData ? JSON.parse(sessionData) : 'null');

// Test 3: Check if localStorage has mock profile data
console.log('\n📋 Test 3: Checking localStorage mock profile data');
const mockProfileData = localStorage.getItem('extrahand_mock_profile_data');
console.log('Mock profile data:', mockProfileData ? JSON.parse(mockProfileData) : 'null');

// Test 4: Simulate SessionManager functions
console.log('\n📋 Test 4: Testing SessionManager functions');
try {
  // Import SessionManager (this will only work in browser environment)
  if (typeof window !== 'undefined') {
    // Simulate SessionManager.getOnboardingState()
    const onboardingState = onboardingData ? JSON.parse(onboardingData) : null;
    console.log('SessionManager.getOnboardingState():', onboardingState);
    
    // Simulate SessionManager.shouldContinueOnboarding()
    const session = sessionData ? JSON.parse(sessionData) : { isAuthenticated: false };
    const shouldContinue = session.isAuthenticated && onboardingState !== null && onboardingState.step !== 'complete';
    console.log('SessionManager.shouldContinueOnboarding():', shouldContinue);
    
    // Simulate SessionManager.getNextOnboardingStep()
    let nextStep = 'ChooseLocationMethod';
    if (onboardingState) {
      switch (onboardingState.step) {
        case 'location':
          if (onboardingState.locationData?.method) {
            if (onboardingState.locationData.location) {
              nextStep = 'RoleSelection';
            } else if (onboardingState.locationData.method === 'input') {
              nextStep = 'LocationInput';
            } else if (onboardingState.locationData.method === 'search') {
              nextStep = 'SearchLocation';
            }
          }
          break;
        case 'roles':
          if (onboardingState.roleData?.selectedRoles && onboardingState.roleData.selectedRoles.length > 0) {
            nextStep = 'complete';
          }
          break;
        case 'complete':
          nextStep = 'complete';
          break;
      }
    }
    console.log('SessionManager.getNextOnboardingStep():', nextStep);
  }
} catch (error) {
  console.log('❌ Error testing SessionManager functions:', error.message);
}

// Test 5: Check if backend onboarding status API is accessible
console.log('\n📋 Test 5: Testing backend onboarding status API');
async function testBackendAPI() {
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:4000/api/v1/health');
    console.log('Backend health status:', healthResponse.status);
    
    if (healthResponse.ok) {
      console.log('✅ Backend is accessible');
    } else {
      console.log('❌ Backend is not accessible');
    }
  } catch (error) {
    console.log('❌ Error testing backend API:', error.message);
  }
}

// Test 6: Simulate frontend onboarding completion logic
console.log('\n📋 Test 6: Testing frontend onboarding completion logic');
function simulateOnboardingCompletion() {
  // Simulate user data with onboarding status
  const mockUserData = {
    name: 'Test User',
    email: 'test@example.com',
    roles: ['tasker'],
    location: {
      type: 'Point',
      coordinates: [78.4867, 17.3850],
      address: 'Hyderabad, India'
    },
    onboardingStatus: {
      isCompleted: true,
      completedSteps: {
        location: true,
        roles: true,
        profile: true
      },
      completedAt: new Date().toISOString(),
      lastStep: 'profile'
    }
  };
  
  console.log('Mock user data:', mockUserData);
  
  // Test hasCompletedOnboarding logic
  const hasBackendStatus = mockUserData.onboardingStatus?.isCompleted;
  console.log('Backend onboarding status check:', hasBackendStatus);
  
  // Test fallback logic
  const hasLocation = !!mockUserData.location && (
    (typeof mockUserData.location === 'object' && (
      (mockUserData.location.lat && mockUserData.location.lng) ||
      (mockUserData.location.coordinates && Array.isArray(mockUserData.location.coordinates) && mockUserData.location.coordinates.length === 2) ||
      (mockUserData.location.address && mockUserData.location.coordinates && Array.isArray(mockUserData.location.coordinates) && mockUserData.location.coordinates.length === 2) ||
      (mockUserData.location.address && typeof mockUserData.location.address === 'string' && mockUserData.location.address.length > 0)
    )) ||
    (typeof mockUserData.location === 'string' && mockUserData.location !== 'Not specified')
  );
  
  const hasRoles = mockUserData.roles && mockUserData.roles.length > 0 && 
                  mockUserData.roles.some(role => role === 'tasker' || role === 'poster');
  
  const fallbackResult = hasRoles && hasLocation;
  console.log('Fallback onboarding check:', { hasLocation, hasRoles, result: fallbackResult });
}

// Run tests
testBackendAPI();
simulateOnboardingCompletion();

console.log('\n✅ Onboarding flow test completed!');
