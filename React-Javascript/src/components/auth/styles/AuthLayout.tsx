import React from 'react';
import { motion } from 'framer-motion';
import { FormInput } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white">
          <FormInput className="h-20 w-20 mb-8" />
          <h1 className="text-5xl font-bold mb-4">AI FormBuilder</h1>
          <p className="text-xl opacity-80 text-center max-w-md">
            Create beautiful forms instantly with AI-powered form builder
          </p>
        </div>
        {/* Animated shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Right side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="text-lg text-gray-600 mb-8">{subtitle}</p>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};