import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, Calendar as CalendarIcon, LogOut, Dumbbell, MenuIcon, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Layout() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Add overflow-x-hidden to body when mobile menu is open
    document.body.classList.toggle('overflow-x-hidden', mobileMenuOpen);

    // Cleanup: remove the class when the component unmounts or mobileMenuOpen changes
    return () => {
      document.body.classList.remove('overflow-x-hidden');
    };
  }, [mobileMenuOpen]);

  if (!user) {
    return null; // Or a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile Menu Button (now on the left) */}
              <div className="md:hidden">
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label="Open menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <MenuIcon className="h-6 w-6" />
                </button>
              </div>

              {/* App Title and Desktop Navigation */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center px-2 py-2 text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <Activity className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <span className="ml-2 text-xl font-bold">Zaid Health</span>
                </Link>
                {/* Desktop Navigation (hidden on mobile) */}
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/calendar"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Calendar
                  </Link>
                  <Link
                    to="/workouts"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <Dumbbell className="h-4 w-4 mr-1" />
                    Workouts
                  </Link>
                  <Link
                    to="/nutrition"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <Utensils className="h-4 w-4 mr-1" /> {/* Add Utensils icon */}
                    Nutrition
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={signOut}
                className="hidden md:inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>

              {/* Mobile Menu (Slide-out - Animation Improved) */}
              <nav
                className={`${
                  mobileMenuOpen ? 'block' : 'hidden'
                } md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-y-auto z-50 transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
                }`}
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link
                    to="/"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/calendar"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Calendar
                  </Link>
                  <Link
                    to="/workouts"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Workouts
                  </Link>
                  <Link
                    to="/nutrition"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nutrition
                  </Link>
                  <button
                      onClick={() => {signOut(); setMobileMenuOpen(false);}}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                  >
                      Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
