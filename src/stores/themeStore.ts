import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light', // Load from localStorage
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme); // Save to localStorage
      document.documentElement.classList.toggle('dark', newTheme === 'dark'); // Add/remove 'dark' class
      return { theme: newTheme };
    }),
}));
