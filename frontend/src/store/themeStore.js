import { create } from 'zustand';
import { STORAGE_KEYS } from '../utils/constants';

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored) return stored;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    
    // Update document class
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme: newTheme };
  }),

  setTheme: (theme) => set(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    
    // Update document class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { theme };
  }),
}));

// Initialize theme on page load
const theme = getInitialTheme();
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}
