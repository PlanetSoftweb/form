import React from 'react';
import { FileSpreadsheet, PlusCircle, Sparkles, Zap, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onCreateClick: () => void;
  onAICreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick, onAICreateClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 px-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with animation */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg"
            >
              <FileSpreadsheet className="h-16 w-16 text-white" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 p-2 bg-yellow-400 rounded-full"
            >
              <Sparkles className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-3"
        >
          Create Your First Form
        </motion.h3>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-10 max-w-md mx-auto"
        >
          Start collecting responses with beautiful, customizable forms. Use AI or build from scratch!
        </motion.p>

        {/* Feature highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mb-10 text-sm text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
            <span>Quick Setup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <span>AI Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lightbulb className="h-4 w-4 text-green-600" />
            </div>
            <span>Smart Analytics</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onAICreateClick}
            className="inline-flex items-center px-8 py-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500"
          >
            <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
            Try AI Builder
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateClick}
            className="inline-flex items-center px-8 py-4 border-2 border-blue-200 rounded-xl shadow-sm text-base font-semibold text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Start from Scratch
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};