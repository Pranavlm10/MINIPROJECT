import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // 15 seconds — Reduce from 120s for faster UI fallback
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add Supabase auth token to all requests
api.interceptors.request.use(async (config) => {
  try {
    const { supabase } = await import('./supabase');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    // Continue without auth in demo mode
  }
  return config;
});

// Chat API
export const chatAPI = {
  sendMessage: (message) => api.post('/chat', { message }), // Use default timeout
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history')
};

// Mood API
export const moodAPI = {
  logMood: (mood, notes) => api.post('/mood', { mood, notes }),
  getHistory: (days = 30) => api.get(`/mood?days=${days}`),
  getTodayStatus: () => api.get('/mood/today')
};

// Community API
export const communityAPI = {
  createPost: (content, category) => api.post('/community', { content, category }),
  getPosts: (page = 1, category = 'all') => api.get(`/community?page=${page}&category=${category}`),
  replyToPost: (postId, content) => api.post(`/community/${postId}/reply`, { content }),
  supportPost: (postId) => api.post(`/community/${postId}/support`)
};

// Resources API
export const resourcesAPI = {
  getAll: () => api.get('/resources'),
  getByCategory: (category) => api.get(`/resources?category=${category}`),
  getCrisis: () => api.get('/resources/crisis')
};

export default api;
