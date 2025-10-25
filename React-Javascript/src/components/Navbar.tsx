import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, FormInput, User, Layout, Menu, X, FileText, Star, DollarSign } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/features"
              className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              Features
            </Link>
            <Link
              to="/templates"
              className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Pricing
            </Link>

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
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-2">
              <Link
                to="/features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <Star className="h-5 w-5 mr-3" />
                Features
              </Link>
              <Link
                to="/templates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <FileText className="h-5 w-5 mr-3" />
                Templates
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              >
                <DollarSign className="h-5 w-5 mr-3" />
                Pricing
              </Link>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {!user && (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center px-3 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                      Get Started
                    </Link>
                  </>
                )}

                {user && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Layout className="h-5 w-5 mr-3" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <User className="h-5 w-5 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center px-3 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign out
                      </button>
                    </>
                  )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
