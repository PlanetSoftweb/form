import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Dashboard } from './components/Dashboard';
import { FormBuilder } from './components/FormBuilder';
import { FormEmbed } from './components/FormEmbed';
import { FormView } from './components/FormView';
import { Profile } from './components/Profile';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Navbar } from './components/Navbar';
import { NotFound } from './components/NotFound';
import { Toaster } from 'react-hot-toast';

function App() {
  const initialize = useAuthStore(state => state.initialize);
  const location = useLocation();
  const { theme } = useThemeStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Public routes for viewing forms */}
        <Route path="/form/:formId" element={<FormView />} />
        <Route path="/embed/:formId" element={<FormEmbed />} />
        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/builder" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
        <Route path="/builder/:formId" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: theme === 'dark' ? '#1f2937' : '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: theme === 'dark' ? '#1f2937' : '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;