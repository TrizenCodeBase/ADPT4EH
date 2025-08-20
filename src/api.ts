import { auth } from './firebase';

// API configuration for different environments
const isDevelopment = process.env.REACT_APP_ENV === 'development' || window.location.hostname === 'localhost';
const API_BASE = process.env.REACT_APP_API_BASE_URL || (isDevelopment 
  ? 'http://localhost:4000'  // Use HTTP for local development
  : 'https://extrahandbackend.llp.trizenventures.com'); // Production backend URL

async function fetchWithAuth(path: string, init: RequestInit = {}) {
  try {
    const user = auth.currentUser;
    if (!user) {
      // For development, allow API calls without authentication
      if (isDevelopment) {
        const res = await fetch(`${API_BASE}${path}`, {
          ...init,
          headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {}),
          },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      }
      throw new Error('Not signed in');
    }
    
    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(init.headers || {}),
      },
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Fallback function for development when backend is not available
async function fetchWithFallback(path: string, init: RequestInit = {}) {
  try {
    return await fetchWithAuth(path, init);
  } catch (error) {
    if (isDevelopment) {
      // Try development endpoint without authentication
      if (path.includes('/api/v1/tasks') && !path.includes('/dev/')) {
        console.log('🔄 Trying development endpoint without authentication...');
        try {
          const devPath = path.replace('/api/v1/tasks', '/api/v1/dev/tasks');
          const res = await fetch(`${API_BASE}${devPath}`, {
            ...init,
            headers: {
              'Content-Type': 'application/json',
              ...(init.headers || {}),
            },
          });
          if (res.ok) {
            console.log('✅ Successfully fetched data from development endpoint');
            return res.json();
          }
        } catch (devError) {
          console.warn('Development endpoint failed:', devError);
        }
      }
      console.warn('Backend not available, using fallback data');
      // Return mock data for development
      return getMockData(path);
    }
    throw error;
  }
}

// Mock data for development
function getMockData(path: string) {
  if (path.includes('/api/v1/tasks')) {
    return {
      tasks: [
        {
          id: '1',
          title: 'Replace a kitchen tap',
          description: 'Replace a kitchen tap. Tap provided.',
          location: { address: 'Hyderabad, India' },
          budget: { amount: 249, currency: 'INR' },
          status: 'open',
          creator: { name: 'Myint K.', photoURL: null },
          createdAt: Date.now() - 7 * 60 * 1000, // 7 minutes ago
          type: 'Home Services',
          skillsRequired: ['plumbing', 'repair'],
          isUrgent: false,
          views: 5,
          applications: 2
        },
        {
          id: '2',
          title: 'Home Deep Cleaning',
          description: 'Deep cleaning required for 3BHK apartment. All rooms, kitchen, and bathrooms.',
          location: { address: 'Basheerbagh, India' },
          budget: { amount: 560, currency: 'INR' },
          status: 'open',
          creator: { name: 'Priya M.', photoURL: null },
          createdAt: Date.now() - 60 * 60 * 1000, // 1 hour ago
          type: 'Cleaning',
          skillsRequired: ['cleaning', 'housekeeping'],
          isUrgent: true,
          views: 12,
          applications: 5
        },
        {
          id: '3',
          title: 'Sofa & Carpet Cleaning',
          description: 'Professional cleaning needed for 3-seater sofa and large carpet in living room.',
          location: { address: 'Hyderabad, India' },
          budget: { amount: 400, currency: 'INR' },
          status: 'open',
          creator: { name: 'Kumar R.', photoURL: null },
          createdAt: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          type: 'Cleaning',
          skillsRequired: ['cleaning', 'upholstery'],
          isUrgent: false,
          views: 8,
          applications: 3
        }
      ]
    };
  }
  
  if (path.includes('/api/v1/profiles/me')) {
    return {
      id: 'dev-user',
      name: 'Development User',
      email: 'dev@example.com',
      roles: ['both'],
      userType: 'individual',
      skills: ['cleaning', 'plumbing', 'repair'],
      rating: 4.5,
      totalReviews: 10,
      isVerified: true
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


