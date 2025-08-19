import { auth } from './firebase';

const API_BASE = 'https://extrahandbackend.llp.trizenventures.com'; // Production backend URL

async function fetchWithAuth(path: string, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Not signed in');
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
}

export const api = {
  upsertProfile(body: any) {
    return fetchWithAuth('/api/v1/profiles', { method: 'POST', body: JSON.stringify(body) });
  },
  me() {
    return fetchWithAuth('/api/v1/profiles/me');
  },
  createTask(body: any) {
    return fetchWithAuth('/api/v1/tasks', { method: 'POST', body: JSON.stringify(body) });
  },
  getTasks(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return fetchWithAuth(`/api/v1/tasks${queryString}`);
  },
  getTask(id: string) {
    return fetchWithAuth(`/api/v1/tasks/${id}`);
  },
  acceptTask(id: string) {
    return fetchWithAuth(`/api/v1/tasks/${id}/accept`, { method: 'POST' });
  },
  completeTask(id: string, body: any) {
    return fetchWithAuth(`/api/v1/tasks/${id}/complete`, { method: 'POST', body: JSON.stringify(body) });
  },
};


