import { auth } from './firebase';
import { API_BASE_URL, isDevelopment } from './config';

// Use the API_BASE_URL from config
const API_BASE = API_BASE_URL;

async function fetchWithAuth(path: string, init: RequestInit = {}) {
  try {
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
    return await fetchWithAuth(path, init);
  } catch (error) {
    if (isDevelopment) {
      console.warn('🔄 Backend not available, using fallback data');
      // Return mock data for development
      return getMockData(path);
    }
    throw error;
  }
}

// Mock data for development - matches MongoDB schema
function getMockData(path: string) {
  if (path.includes('/api/v1/tasks')) {
    return {
      tasks: [
        {
          _id: 'mock-task-1',
          creatorUid: 'mock-user-1',
          type: 'Delivery',
          title: 'Delivering passport to my friend',
          description: 'Need to deliver passport to my friend in Gachibowli area. Urgent delivery required.',
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
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            timeSlots: ['Anytime']
          },
          budget: {
            type: 'fixed',
            amount: 300,
            currency: 'INR'
          },
          status: 'open',
          skillsRequired: ['Delivery', 'Transportation'],
          isUrgent: true,
          views: 15,
          applications: 3,
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
  
  if (path.includes('/api/v1/profiles/me')) {
    return {
      _id: 'mock-profile-1',
      uid: 'mock-user-1',
      name: 'Development User',
      email: 'dev@example.com',
      phone: '+919876543210',
      roles: ['both'],
      userType: 'individual',
      skills: ['cleaning', 'plumbing', 'repair', 'delivery'],
      rating: 4.5,
      totalReviews: 10,
      isVerified: true,
      location: {
        type: 'Point',
        coordinates: [78.4867, 17.3850],
        address: 'Hyderabad, India'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  return { tasks: [] };
}

export const api = {
  // Profile management
  upsertProfile(body: any) {
    return fetchWithFallback('/api/v1/profiles', { method: 'POST', body: JSON.stringify(body) });
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


