import { auth } from './firebase';
import { API_BASE_URL, isDevelopment } from './config';

// Use the API_BASE_URL from config
const API_BASE = API_BASE_URL;

async function fetchWithAuth(path: string, init: RequestInit = {}) {
  try {
    console.log('🔧 fetchWithAuth called with path:', path);
    console.log('🔧 API_BASE:', API_BASE);
    console.log('🔧 Full URL:', `${API_BASE}${path}`);
    
    const user = auth.currentUser;
    
    // Always try to get authentication token if user is logged in
    let authHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> || {}),
    };
    
    if (user) {
      try {
        const token = await user.getIdToken();
        authHeaders.Authorization = `Bearer ${token}`;
        console.log('🔐 Using authenticated request with token');
      } catch (tokenError) {
        console.warn('⚠️ Failed to get auth token:', tokenError);
        // Continue without token for development
      }
    } else {
      console.log('👤 No user logged in, proceeding without authentication');
    }
    
    console.log('🔧 Making fetch request to:', `${API_BASE}${path}`);
    console.log('🔧 Request init:', init);
    console.log('🔧 Headers:', authHeaders);
    
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: authHeaders,
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`❌ API Error ${res.status}:`, text);
      throw new Error(text || `HTTP ${res.status}`);
    }
    
    const data = await res.json();
    console.log(`✅ API Success: ${path}`, data);
    return data;
  } catch (error) {
    console.error('🚨 API Error:', error);
    throw error;
  }
}

// Fallback function for development when backend is not available
async function fetchWithFallback(path: string, init: RequestInit = {}) {
  try {
    console.log('🔧 fetchWithFallback called with path:', path);
    const result = await fetchWithAuth(path, init);
    console.log('🔧 fetchWithFallback success:', result);
    return result;
  } catch (error) {
    console.log('🔧 fetchWithFallback error:', error);
    if (isDevelopment) {
      console.warn('🔄 Backend not available, using fallback data');
      console.log('🔧 Path:', path);
      console.log('🔧 Init:', init);
      // Return mock data for development
      const mockData = getMockData(path, init);
      console.log('🔧 Returning mock data:', mockData);
      return mockData;
    }
    throw error;
  }
}

// Mock data for development - matches MongoDB schema
function getMockData(path: string, init?: RequestInit) {
  console.log('🔧 getMockData called with path:', path, 'init:', init);
  // For development, use localStorage to persist mock data
  const STORAGE_KEY = 'extrahand_mock_profile_data';
  
  // Helper function to get stored profile data
  const getStoredProfileData = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.warn('Failed to parse stored profile data:', error);
        return null;
      }
    }
    return null;
  };
  
  // Helper function to store profile data
  const storeProfileData = (data: any) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('💾 Profile data saved to localStorage');
      } catch (error) {
        console.warn('Failed to save profile data to localStorage:', error);
      }
    }
  };
  if (path.includes('/api/v1/tasks')) {
    return {
      tasks: [
        {
          _id: 'mock-task-1',
          creatorUid: 'mock-user-1',
          type: 'Home Services',
          title: 'Replace a kitchen tap',
          description: 'Need to replace a leaking kitchen tap. The new tap is already purchased and available. Basic plumbing skills required.',
          location: {
            type: 'Point',
            coordinates: [78.4867, 17.3850],
            address: 'Hyderabad, India',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
          },
          preferredTime: {
            flexible: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            timeSlots: ['Morning', 'Afternoon']
          },
          budget: {
            type: 'fixed',
            amount: 1500,
            currency: 'INR'
          },
          status: 'open',
          skillsRequired: ['Plumbing', 'Home Repair'],
          isUrgent: false,
          views: 8,
          applications: 2,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          _id: 'mock-task-2',
          creatorUid: 'mock-user-2',
          type: 'Home Services',
          title: 'plumbing',
          description: 'Need plumbing work done in kitchen. Leaking pipe needs to be fixed.',
          location: {
            type: 'Point',
            coordinates: [78.4867, 17.3850],
            address: 'Kondapur',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
          },
          preferredTime: {
            flexible: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            timeSlots: ['Anytime']
          },
          budget: {
            type: 'fixed',
            amount: 200,
            currency: 'INR'
          },
          status: 'open',
          skillsRequired: ['Plumbing', 'Repair'],
          isUrgent: false,
          views: 8,
          applications: 1,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          updatedAt: new Date()
        },
        {
          _id: 'mock-task-3',
          creatorUid: 'mock-user-3',
          type: 'Cleaning',
          title: 'Cleaning an old house',
          description: 'Deep cleaning required for an old house. All rooms need thorough cleaning.',
          location: {
            type: 'Point',
            coordinates: [78.4867, 17.3850],
            address: 'Gachibowli outer ring road',
            city: 'Hyderabad',
            state: 'Telangana',
            country: 'India'
          },
          preferredTime: {
            flexible: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            timeSlots: ['Anytime']
          },
          budget: {
            type: 'fixed',
            amount: 150,
            currency: 'INR'
          },
          status: 'open',
          skillsRequired: ['Cleaning', 'Housekeeping'],
          isUrgent: false,
          views: 12,
          applications: 4,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      ]
    };
  }
  
  if (path.includes('/api/v1/profiles') && init?.method === 'POST') {
    // Mock response for profile save
    console.log('🔧 Mock profile save response - handler found!');
    
    // Parse the request body to get the actual data being saved
    let profileData;
    try {
      profileData = JSON.parse(init.body as string);
      console.log('🔧 Parsed profile data:', profileData);
    } catch (error) {
      console.error('🔧 Failed to parse profile data:', error);
      profileData = {};
    }
    
    // Create a mock response with the actual data that was sent
    const mockResponse = {
      _id: 'mock-profile-saved',
      uid: 'mock-user-saved',
      name: profileData.name || 'User Saved',
      email: profileData.email || 'user@example.com',
      phone: profileData.phone || '+919876543210',
      roles: profileData.roles || ['tasker'],
      userType: profileData.userType || 'individual',
      skills: profileData.skills || ['cleaning', 'plumbing'],
      rating: 4.5,
      totalReviews: 10,
      isVerified: true,
      location: profileData.location || {
        type: 'Point',
        coordinates: [78.4867, 17.3850],
        address: 'Hyderabad, Telangana, India'
      },
      business: profileData.business || null,
      agreeUpdates: profileData.agreeUpdates || false,
      agreeTerms: profileData.agreeTerms || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('🔧 Returning mock response with saved data:', mockResponse);
    
    // Store the profile data in localStorage for persistence
    storeProfileData(mockResponse);
    
    return mockResponse;
  }
  
  if (path.includes('/api/v1/profiles/me')) {
    // First, check if we have stored profile data from previous saves
    const storedProfileData = getStoredProfileData();
    if (storedProfileData) {
      console.log('🔧 Returning stored profile data from localStorage:', storedProfileData);
      return storedProfileData;
    }
    
    // Check if user has completed onboarding by checking session manager
    // This is a fallback for when backend is not available
    try {
      const { sessionManager } = require('./SessionManager');
      const onboardingState = sessionManager.getOnboardingState();
      
      // If user has completed onboarding (has both location and roles)
      if (onboardingState?.step === 'complete' && onboardingState?.locationData?.location) {
        const locationData = onboardingState.locationData.location;
        return {
          _id: 'mock-profile-completed',
          uid: 'mock-user-completed',
          name: 'User',
          email: 'user@example.com',
          phone: '+919876543210',
          roles: onboardingState.roleData?.selectedRoles || ['tasker'],
          userType: 'individual',
          skills: ['cleaning', 'plumbing', 'repair', 'delivery'],
          rating: 4.5,
          totalReviews: 10,
          isVerified: true,
          location: {
            type: 'Point',
            coordinates: [locationData.longitude, locationData.latitude],
            lat: locationData.latitude,
            lng: locationData.longitude,
            address: locationData.address || 'Hyderabad, Telangana, India'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      // If user has roles but no location (incomplete onboarding)
      if (onboardingState?.roleData?.selectedRoles && onboardingState.roleData.selectedRoles.length > 0) {
        return {
          _id: 'mock-profile-incomplete',
          uid: 'mock-user-incomplete',
          name: 'User',
          email: 'user@example.com',
          phone: '+919876543210',
          roles: onboardingState.roleData.selectedRoles,
          userType: 'individual',
          skills: ['cleaning', 'plumbing', 'repair', 'delivery'],
          rating: 4.5,
          totalReviews: 10,
          isVerified: true,
          location: null, // No location - user needs to complete location step
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
      
      // If user has location data but onboarding step is not 'complete'
      if (onboardingState?.locationData?.location && onboardingState?.roleData?.selectedRoles) {
        const locationData = onboardingState.locationData.location;
        return {
          _id: 'mock-profile-with-location',
          uid: 'mock-user-with-location',
          name: 'User',
          email: 'user@example.com',
          phone: '+919876543210',
          roles: onboardingState.roleData.selectedRoles,
          userType: 'individual',
          skills: ['cleaning', 'plumbing', 'repair', 'delivery'],
          rating: 4.5,
          totalReviews: 10,
          isVerified: true,
          location: {
            type: 'Point',
            coordinates: [locationData.longitude, locationData.latitude],
            lat: locationData.latitude,
            lng: locationData.longitude,
            address: locationData.address || 'Hyderabad, Telangana, India'
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
      }
    } catch (error) {
      console.warn('Could not check session manager for mock data:', error);
    }
    
    // Default: return a new user profile (no roles, no location)
    return {
      _id: 'mock-profile-new',
      uid: 'mock-user-new',
      name: '',
      email: 'newuser@example.com',
      phone: '',
      roles: [], // No roles for new users
      userType: 'individual',
      skills: [],
      rating: 0,
      totalReviews: 0,
      isVerified: false,
      location: null, // No location for new users
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  return { tasks: [] };
}

// Development utility function to clear stored profile data
export const clearMockProfileData = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('extrahand_mock_profile_data');
    console.log('🧹 Cleared mock profile data from localStorage');
  }
};

export const api = {
  // Profile management
  upsertProfile(body: any) {
    console.log('🔧 upsertProfile called with body:', body);
    console.log('🔧 API_BASE_URL:', API_BASE_URL);
    console.log('🔧 auth.currentUser:', auth.currentUser);
    console.log('🔧 auth.currentUser?.uid:', auth.currentUser?.uid);
    console.log('🔧 About to call fetchWithFallback...');
    const result = fetchWithFallback('/api/v1/profiles', { method: 'POST', body: JSON.stringify(body) });
    console.log('🔧 upsertProfile result:', result);
    return result;
  },
  me() {
    return fetchWithFallback('/api/v1/profiles/me');
  },

  // Task management
  createTask(body: any) {
    return fetchWithFallback('/api/v1/tasks', { method: 'POST', body: JSON.stringify(body) });
  },
  getTasks(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetchWithFallback(`/api/v1/tasks${queryString}`);
  },
  getTask(id: string) {
    return fetchWithFallback(`/api/v1/tasks/${id}`);
  },
  updateTask(id: string, body: any) {
    return fetchWithFallback(`/api/v1/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  deleteTask(id: string) {
    return fetchWithFallback(`/api/v1/tasks/${id}`, { method: 'DELETE' });
  },
  acceptTask(id: string) {
    return fetchWithFallback(`/api/v1/tasks/${id}/accept`, { method: 'POST' });
  },
  completeTask(id: string, body: any) {
    return fetchWithFallback(`/api/v1/tasks/${id}/complete`, { method: 'POST', body: JSON.stringify(body) });
  },

  // Application management
  submitApplication(body: any) {
    return fetchWithFallback('/api/v1/applications', { method: 'POST', body: JSON.stringify(body) });
  },
  getApplications(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetchWithFallback(`/api/v1/applications${queryString}`);
  },
  getApplication(id: string) {
    return fetchWithFallback(`/api/v1/applications/${id}`);
  },
  updateApplication(id: string, body: any) {
    return fetchWithFallback(`/api/v1/applications/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  withdrawApplication(id: string) {
    return fetchWithFallback(`/api/v1/applications/${id}`, { method: 'DELETE' });
  },
  sendApplicationMessage(id: string, message: string) {
    return fetchWithFallback(`/api/v1/applications/${id}/message`, { 
      method: 'POST', 
      body: JSON.stringify({ message }) 
    });
  },

  // Matching and recommendations
  getTaskCandidates(taskId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetchWithFallback(`/api/v1/matches/tasks/${taskId}/candidates${queryString}`);
  },

  // Utility functions
  async uploadImage(_file: File): Promise<string> {
    // TODO: Implement image upload to cloud storage
    // For now, return a placeholder URL
    return `https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=Uploaded+Image`;
  },

  // Search and filtering
  searchTasks(filters: {
    type?: string;
    city?: string;
    minBudget?: number;
    maxBudget?: number;
    skills?: string[];
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });
    return fetchWithFallback(`/api/v1/tasks?${params.toString()}`);
  },

  // User statistics
  async getUserStats() {
    const [myTasks, myApplications] = await Promise.all([
      this.getTasks({ mine: 'all' }),
      this.getApplications({ mine: 'true' })
    ]);

    const stats = {
      totalTasks: myTasks.tasks?.length || 0,
      openTasks: myTasks.tasks?.filter((t: any) => t.status === 'open').length || 0,
      completedTasks: myTasks.tasks?.filter((t: any) => t.status === 'completed').length || 0,
      totalApplications: myApplications.applications?.length || 0,
      pendingApplications: myApplications.applications?.filter((a: any) => a.status === 'pending').length || 0,
      acceptedApplications: myApplications.applications?.filter((a: any) => a.status === 'accepted').length || 0
    };

    return stats;
  }
};


