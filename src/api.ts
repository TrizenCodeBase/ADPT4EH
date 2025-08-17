import { auth } from './firebase';

const API_BASE = (typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname))
  ? 'http://localhost:4000'
  : 'https://api.extrahand.in'; // Update this to your actual backend URL

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
};


