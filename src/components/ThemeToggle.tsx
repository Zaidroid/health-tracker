import { useThemeStore } from '../stores/themeStore';
import { Sun, Moon } from 'lucide-react';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  // --- KEY CHANGE: useEffect now ONLY sets the <html> class ---
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    // No setTheme call here!
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []); // Run only once on mount

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
      title="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700" />
      )}
    </button>
  );
}
