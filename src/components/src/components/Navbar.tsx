import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, FormInput, User, Layout } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  
  // Don't show navbar on auth pages and public form pages
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isPublicFormPage = location.pathname.startsWith('/form/') || location.pathname.startsWith('/embed/');
  const isLandingPage = location.pathname === '/';
  
  if (isAuthPage || isPublicFormPage) return null;

  return (
    <nav className={`${isLandingPage ? 'bg-transparent' : 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 dark:text-blue-400">
              <FormInput className="h-6 w-6 mr-2" />
              <span className="font-semibold text-lg">FormBuilder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};