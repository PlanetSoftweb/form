import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, X, Wand2, FileText, ShoppingBag, Calendar, Building2, Heart, Users, Palette } from 'lucide-react';
import { enhanceFormWithAI, suggestStyleWithAI } from '../../lib/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  currentElements: any[];
  formTitle: string;
  formDescription: string;
  onAddElement: (element: any) => void;
  currentStyle?: any;
  onStyleChange?: (style: any) => void;
}

const quickPrompts = [
  { icon: FileText, label: 'Contact Form', prompt: 'Add name, email, phone, and message fields' },
  { icon: ShoppingBag, label: 'Order Form', prompt: 'Add product selection, quantity, shipping address, and payment details' },
  { icon: Calendar, label: 'Event RSVP', prompt: 'Add attendee name, email, number of guests, dietary restrictions' },
  { icon: Building2, label: 'Job Application', prompt: 'Add personal info, work experience, education, skills, and resume upload' },
  { icon: Heart, label: 'Feedback Form', prompt: 'Add rating, comments, suggestions, and contact info' },
  { icon: Users, label: 'Survey', prompt: 'Add multiple choice questions, ratings, and open-ended responses' },
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentElements,
  formTitle,
  formDescription,
  onAddElement,
  currentStyle = {},
  onStyleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [requestType, setRequestType] = useState<'fields' | 'style'>('fields');

  const getSuggestions = async (customPrompt?: string) => {
    const requestPrompt = customPrompt || prompt;
    
    if (!requestPrompt) {
      toast.error('Please describe what you want');
      return;
    }

    setLoading(true);
    setShowQuickPrompts(false);
    try {
      if (requestType === 'style') {
        if (!onStyleChange) {
          toast.error('Style editing not available');
          return;
        }
        const styleChanges = await suggestStyleWithAI(currentStyle, requestPrompt);
        onStyleChange(styleChanges);
        toast.success('🎨 Applied AI style suggestions!');
        setSuggestions([]);
        setPrompt('');
      } else {
        const newSuggestions = await enhanceFormWithAI(currentElements, requestPrompt);
        setSuggestions(newSuggestions);
        toast.success(`🎉 Generated ${newSuggestions.length} smart field suggestions!`);
      }
    } catch (error: any) {
      console.error('Error getting suggestions:', error);
      const errorMessage = error.message || 'Failed to get AI suggestions';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setPrompt(promptText);
    getSuggestions(promptText);
  };

  const handleAddSuggestion = (suggestion: any) => {
    onAddElement(suggestion);
    toast.success(`Added ${suggestion.label} field`);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 bottom-6 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all ${
          isOpen ? 'rotate-180' : ''
        }`}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <Wand2 className="h-5 w-5 animate-pulse" />
            <span className="font-bold">AI Magic</span>
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed right-6 bottom-24 z-40 w-[420px] bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden backdrop-blur-lg"
          >
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Wand2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">AI Form Assistant</h3>
                    <p className="text-sm text-purple-100 mt-0.5">
                      ✨ Powered by Gemini AI
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Quick Start Templates
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {quickPrompts.map((item, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickPrompt(item.prompt)}
                        disabled={loading}
                        className="flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 rounded-xl border border-purple-200 transition-all text-left disabled:opacity-50"
                      >
                        <item.icon className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-700">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => { setRequestType('fields'); setSuggestions([]); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    requestType === 'fields'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  Add Fields
                </button>
                <button
                  onClick={() => { setRequestType('style'); setSuggestions([]); }}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    requestType === 'style'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Palette className="h-4 w-4 inline mr-1" />
                  Edit Style
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  {requestType === 'fields' ? (
                    <>
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Describe fields to add
                    </>
                  ) : (
                    <>
                      <Palette className="h-4 w-4 text-pink-500" />
                      Describe style changes
                    </>
                  )}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    requestType === 'fields'
                      ? "E.g., 'Add name field' or 'Add address fields' or 'I need payment information'"
                      : "E.g., 'Make it blue' or 'Dark theme' or 'Use rounded corners' or 'Add gradient background'"
                  }
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      getSuggestions();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Press Ctrl+Enter to generate</p>
              </div>

              <button
                onClick={() => getSuggestions()}
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl disabled:opacity-50 transition-all font-semibold shadow-lg hover:shadow-xl ${
                  requestType === 'fields'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Magic...
                  </>
                ) : requestType === 'fields' ? (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Fields
                  </>
                ) : (
                  <>
                    <Palette className="h-5 w-5" />
                    Apply Style
                  </>
                )}
              </button>

              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      AI Suggestions ({suggestions.length})
                    </h4>
                    <button
                      onClick={() => {
                        suggestions.forEach(s => onAddElement(s));
                        toast.success('Added all fields!');
                        setSuggestions([]);
                      }}
                      className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors font-medium"
                    >
                      Add All
                    </button>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{suggestion.label}</p>
                            {suggestion.required && (
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">Required</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md font-medium">
                              {suggestion.type}
                            </span>
                            {suggestion.options && (
                              <span className="text-xs text-gray-500">
                                {suggestion.options.length} options
                              </span>
                            )}
                          </div>
                          {suggestion.placeholder && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              💬 "{suggestion.placeholder}"
                            </p>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddSuggestion(suggestion)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-md"
                        >
                          Add
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
