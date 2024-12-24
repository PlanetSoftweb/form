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
import { ForgotPassword } from './components/auth/ForgotPassword';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LandingPage } from './components/LandingPage';
import { NotFound } from './components/NotFound';
import { Toaster } from 'react-hot-toast';
import { BottomNav } from './components/BottomNav';

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

  // Don't show bottom nav on auth pages, public form pages, and landing page
  const hideBottomNav = ['/login', '/register', '/forgot-password', '/'].includes(location.pathname) ||
    location.pathname.startsWith('/form/') ||
    location.pathname.startsWith('/embed/');

  return (
    <div className={`min-h-screen ${theme}`}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/form/:formId" element={<FormView />} />
        <Route path="/embed/:formId" element={<FormEmbed />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/builder" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
        <Route path="/builder/:formId" element={<PrivateRoute><FormBuilder /></PrivateRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideBottomNav && <BottomNav />}

      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1f2937' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          }
        }}
      />
    </div>
  );
}

export default App;