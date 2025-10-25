import React, { useState } from 'react';
import { PlusCircle, Sparkles, TrendingUp, FileText, Search, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardHeaderProps {
  formCount: number;
  onCreateClick: () => void;
  onAICreateClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuToggle?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  formCount,
  onCreateClick,
  onAICreateClick,
  searchQuery,
  onSearchChange,
  onMenuToggle
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <div className="mb-6 md:mb-10">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {onMenuToggle && (
              <button
                onClick={onMenuToggle}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            )}
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              My Forms
            </h1>
          </div>
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMobileSearch ? (
              <X className="h-5 w-5 text-gray-700" />
            ) : (
              <Search className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Stats */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg flex-1">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-900">{formCount}</span>
            <span className="text-blue-600 text-sm">{formCount === 1 ? 'form' : 'forms'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg flex-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-900">0</span>
            <span className="text-green-600 text-sm">responses</span>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search forms..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAICreateClick}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI Builder</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onCreateClick}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border-2 border-blue-200 rounded-xl shadow-sm text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Form
          </motion.button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              My Forms
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-900">{formCount}</span>
                <span className="text-blue-600">{formCount === 1 ? 'form' : 'forms'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-900">0</span>
                <span className="text-green-600">responses</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-center"
          >
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search forms..."
                className="w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-sm"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onAICreateClick}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Sparkles className="relative h-5 w-5 mr-2 animate-pulse" />
              <span className="relative">AI Builder</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCreateClick}
              className="inline-flex items-center px-6 py-3 border-2 border-blue-200 rounded-xl shadow-sm text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              New Form
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
