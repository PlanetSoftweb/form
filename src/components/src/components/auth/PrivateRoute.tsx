import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: Props) => {
  const { user, loading, initialized } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Allow public access to form and embed routes
  const isPublicRoute = location.pathname.startsWith('/form/') || location.pathname.startsWith('/embed/');
  if (isPublicRoute) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, initialized, navigate]);

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};