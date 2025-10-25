import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from './styles/AuthLayout';
import { AuthInput } from './styles/AuthInput';
import { PasswordInput } from './PasswordInput';
import { GoogleSignInButton } from './GoogleSignInButton';
import toast from 'react-hot-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error, unverifiedEmail, resendVerificationEmail } = useAuthStore();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth store
    }
  };

  const handleResendEmail = async () => {
    if (!unverifiedEmail || !password) {
      toast.error('Please enter your password first');
      return;
    }
    
    setResending(true);
    try {
      await resendVerificationEmail(unverifiedEmail, password);
    } catch (error) {
      // Error is handled by the auth store
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building amazing forms"
    >
      <div className="w-full space-y-6">
        <GoogleSignInButton text="Sign in with Google" />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-lg">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
          >
            <p className="text-yellow-800 font-medium mb-2">
              {error === 'email-not-verified' 
                ? '⚠️ Email Not Verified' 
                : error}
            </p>
            {error === 'email-not-verified' && (
              <div className="space-y-3">
                <p className="text-sm text-yellow-700">
                  Please check your email for the verification link. Can't find it?
                </p>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm font-medium transition-colors"
                >
                  {resending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Resending email...
                    </>
                  ) : (
                    <>
                      📧 Resend Verification Email
                    </>
                  )}
                </button>
                {!password && (
                  <p className="text-xs text-yellow-600">
                    💡 Tip: Make sure you've entered your password above before clicking resend
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}

        <AuthInput
          icon={Mail}
          label="Email address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <PasswordInput
          icon={Lock}
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between mb-8">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:text-blue-700 text-lg"
          >
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center px-8 py-4 text-xl font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-6 w-6" />
            </>
          )}
        </motion.button>

        <p className="mt-8 text-center text-lg">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};