import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { AuthLayout } from './styles/AuthLayout';
import { AuthInput } from './styles/AuthInput';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth store
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building amazing forms"
    >
      <form onSubmit={handleSubmit} className="w-full">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 rounded-xl text-red-600"
          >
            {error}
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

        <AuthInput
          icon={Lock}
          label="Password"
          type="password"
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