import axios from 'axios';
import { API_URL, STORAGE_KEYS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Board APIs
export const boardAPI = {
  getAll: () => api.get('/boards'),
  getById: (id) => api.get(`/boards/${id}`),
  create: (data) => api.post('/boards', data),
  update: (id, data) => api.put(`/boards/${id}`, data),
  delete: (id) => api.delete(`/boards/${id}`),
  addMember: (id, email) => api.post(`/boards/${id}/members`, { email }),
};

// List APIs - FIXED!
export const listAPI = {
  create: (boardId, data) => api.post(`/boards/${boardId}/lists`, data), // ← FIXED
  update: (id, data) => api.put(`/lists/${id}`, data),
  delete: (id) => api.delete(`/lists/${id}`),
};

// Task APIs
export const taskAPI = {
  create: (listId, data) => api.post(`/lists/${listId}/tasks`, data),
  getById: (id) => api.get(`/tasks/${id}`),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  move: (id, data) => api.put(`/tasks/${id}/move`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  assign: (id, userId) => api.post(`/tasks/${id}/assign`, { userId }),
  unassign: (id, userId) => api.post(`/tasks/${id}/unassign`, { userId }),
  search: (boardId, query, page) => api.get(`/tasks/boards/${boardId}/search`, { params: { search: query, page } }),
};

// Activity APIs
export const activityAPI = {
  getBoardActivity: (boardId, page = 1) => api.get(`/boards/${boardId}/activity`, { params: { page } }),
  getRecentActivity: (limit = 20) => api.get(`/activity/recent`, { params: { limit } }),
};

export default api;
