import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Activity, Calendar as CalendarIcon, LogOut, Dumbbell, MenuIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* --- KEY CHANGE: Added hover effect to title --- */}
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

              {/* Mobile Menu Button (hidden on desktop) */}
              <div className="md:hidden relative">
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-label="Open menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <MenuIcon className="h-6 w-6" />
                </button>

                {/* --- Mobile Menu (Slide-out from left) --- */}
                <nav
                  className={`${
                    mobileMenuOpen ? 'block' : 'hidden'
                  } md:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-y-auto z-50 transition-transform transform ${
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                  } ease-in-out duration-300`}
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
        </div>
      </nav>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40"
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
