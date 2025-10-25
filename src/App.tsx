import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Dashboard } from './components/Dashboard';
import { ModernFormBuilder } from './components/ModernFormBuilder';
import { FormEmbed } from './components/FormEmbed';
import { FormView } from './components/FormView';
import { Profile } from './components/Profile';
import { Login } from './components/auth/Login';
import { SimpleRegister } from './components/auth/SimpleRegister';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LandingPage } from './components/LandingPage';
import { NotFound } from './components/NotFound';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsOfService } from './components/TermsOfService';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Help } from './components/Help';
import { Settings } from './components/Settings';
import { Subscription } from './components/Subscription';
import { Templates } from './components/Templates';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Toaster } from 'react-hot-toast';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { SuperAdmin } from './components/SuperAdmin';

function App() {
  const initialize = useAuthStore((state: any) => state.initialize);
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

  // Don't show bottom nav on auth pages, public form pages, builder, and landing page
  const hideNav = ['/login', '/register', '/forgot-password', '/'].includes(location.pathname) ||
    location.pathname.startsWith('/form/') ||
    location.pathname.startsWith('/embed/') ||
    location.pathname.startsWith('/builder');

  // Show footer on public pages (exclude form pages for clean display)
  const showFooter = ['/', '/privacy', '/terms', '/about', '/contact', '/help', '/templates', '/features', '/pricing'].includes(location.pathname) || 
    location.pathname === '/404';

  return (
    <div className={`min-h-screen ${theme}`}>
      <div className={`${!hideNav ? 'lg:pl-[72px]' : ''} transition-[padding] duration-200`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SimpleRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/form/:formId" element={<FormView />} />
          <Route path="/embed/:formId" element={<FormEmbed />} />
          <Route path="/forms" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />
          <Route path="/builder" element={<PrivateRoute><ModernFormBuilder /></PrivateRoute>} />
          <Route path="/builder/:formId" element={<PrivateRoute><ModernFormBuilder /></PrivateRoute>} />
          <Route path="/analytics/:formId" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/submissions/:formId" element={<PrivateRoute><SubmissionsPage /></PrivateRoute>} />
          <Route path="/super-admin" element={<PrivateRoute><SuperAdmin /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideNav && <BottomNav />}
      {showFooter && <Footer />}

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