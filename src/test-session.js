// Comprehensive Session Clearing and Debugging Script
// Run this in browser console to debug session issues

console.log('🧪 Session Debugging Script');

// Function to check current session state
function checkSessionState() {
  console.log('📊 Current Session State:');
  
  // Check localStorage
  const session = localStorage.getItem('extrahand_session');
  const onboarding = localStorage.getItem('extrahand_onboarding');
  const route = localStorage.getItem('extrahand_route');
  
  console.log('localStorage keys:', Object.keys(localStorage));
  console.log('Session data:', session ? JSON.parse(session) : 'null');
  console.log('Onboarding data:', onboarding ? JSON.parse(onboarding) : 'null');
  console.log('Route data:', route ? JSON.parse(route) : 'null');
  
  // Try to check session manager if available
  try {
    if (typeof sessionManager !== 'undefined') {
      console.log('SessionManager session:', sessionManager.getSession());
      console.log('SessionManager onboarding:', sessionManager.getOnboardingState());
      console.log('SessionManager should continue onboarding:', sessionManager.shouldContinueOnboarding());
      console.log('SessionManager next step:', sessionManager.getNextOnboardingStep());
    }
  } catch (error) {
    console.log('SessionManager not available:', error);
  }
}

// Function to clear all session data
function clearAllSessionData() {
  console.log('🗑️ Clearing ALL session data...');
  
  // Clear all localStorage data
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear cookies
  document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
  });
  
  // Sign out from Firebase if available
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut().then(() => {
      console.log('🔥 Firebase auth signed out');
    }).catch((error) => {
      console.log('⚠️ Firebase signout error:', error);
    });
  }
  
  console.log('✅ ALL session data cleared!');
  console.log('🔄 Please refresh the page (F5) to test as a completely new user');
}

// Function to set up a complete user session for testing
function setupCompleteUser() {
  console.log('👤 Setting up complete user session...');
  
  const completeOnboarding = {
    step: 'complete',
    locationData: {
      method: 'input',
      location: {
        latitude: 17.3850,
        longitude: 78.4867,
        address: 'Hyderabad, Telangana, India'
      }
    },
    roleData: {
      selectedRoles: ['tasker']
    },
    lastUpdated: Date.now()
  };
  
  const completeSession = {
    isAuthenticated: true,
    onboardingState: completeOnboarding,
    lastRoute: 'PerformerHome',
    lastRouteParams: {},
    lastActivity: Date.now()
  };
  
  localStorage.setItem('extrahand_session', JSON.stringify(completeSession));
  localStorage.setItem('extrahand_onboarding', JSON.stringify(completeOnboarding));
  
  console.log('✅ Complete user session set up');
  console.log('🔄 Please refresh the page to test');
}

// Function to set up an incomplete user session for testing
function setupIncompleteUser() {
  console.log('👤 Setting up incomplete user session...');
  
  const incompleteOnboarding = {
    step: 'roles',
    locationData: {
      method: 'input',
      location: {
        latitude: 17.3850,
        longitude: 78.4867,
        address: 'Hyderabad, Telangana, India'
      }
    },
    roleData: {
      selectedRoles: ['tasker']
    },
    lastUpdated: Date.now()
  };
  
  const incompleteSession = {
    isAuthenticated: true,
    onboardingState: incompleteOnboarding,
    lastRoute: 'RoleSelection',
    lastRouteParams: {},
    lastActivity: Date.now()
  };
  
  localStorage.setItem('extrahand_session', JSON.stringify(incompleteSession));
  localStorage.setItem('extrahand_onboarding', JSON.stringify(incompleteOnboarding));
  
  console.log('✅ Incomplete user session set up');
  console.log('🔄 Please refresh the page to test');
}

// Check current state
checkSessionState();

console.log('\n📋 Available functions:');
console.log('- checkSessionState() - Check current session state');
console.log('- clearAllSessionData() - Clear all session data');
console.log('- setupCompleteUser() - Set up a complete user session');
console.log('- setupIncompleteUser() - Set up an incomplete user session');
