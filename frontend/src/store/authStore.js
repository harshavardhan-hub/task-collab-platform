import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.TOKEN),

  setAuth: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (userData) => {
    const updatedUser = { ...userData };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
