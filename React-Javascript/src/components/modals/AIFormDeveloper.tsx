import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { generateFormWithGemini } from '../../lib/geminiService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../../store/formStore';
import { useAuthStore } from '../../store/authStore';

interface AIFormDeveloperProps {
  isOpen: boolean;
  onClose: () => void;
}

type Stage = 'input' | 'generating' | 'success' | 'error';

const themes = [
  { name: 'Blue', color: '#2563eb' },
  { name: 'Purple', color: '#7c3aed' },
  { name: 'Green', color: '#059669' },
  { name: 'Pink', color: '#db2777' },
  { name: 'Orange', color: '#ea580c' },
  { name: 'Teal', color: '#0d9488' },
];

const fontFamilies = [
  { name: 'Inter', value: 'Inter, system-ui, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
];

export const AIFormDeveloper: React.FC<AIFormDeveloperProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedFont, setSelectedFont] = useState(fontFamilies[0]);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [stage, setStage] = useState<Stage>('input');
  const [progress, setProgress] = useState(0);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const { saveForm } = useFormStore();
  const { user } = useAuthStore();

  const handleGenerate = async () => {
    if (!user) {
      toast.error('Please sign in to generate forms');
      navigate('/login');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please describe your form');
      return;
    }

    try {
      setStage('generating');
      setProgress(0);

      const interval = setInterval(() => {
        setProgress(prev => prev >= 90 ? prev : prev + Math.random() * 15);
      }, 300);

      const formStructure = await generateFormWithGemini(prompt);
      
      clearInterval(interval);
      setProgress(100);

      const buttonColor = isCustomColor ? customColor : selectedTheme.color;
      
      formStructure.style = {
        backgroundColor: '#ffffff',
        textColor: '#1e293b',
        buttonColor: buttonColor,
        borderRadius: '0.5rem',
        fontFamily: selectedFont.value,
      };

      setGeneratedForm(formStructure);
      
      setTimeout(() => {
        setStage('success');
      }, 500);
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to generate form';
      setErrorMessage(errorMsg);
      setStage('error');
      setProgress(0);
    }
  };

  const handleOpenBuilder = async () => {
    if (!generatedForm) return;

    try {
      const formId = await saveForm({
        ...generatedForm,
        userId: user?.uid,
      });

      toast.success('Opening builder...');
      onClose();
      navigate(`/builder/${formId}`);
    } catch (error) {
      toast.error('Failed to save form');
    }
  };

  const handleReset = () => {
    setStage('input');
    setGeneratedForm(null);
    setProgress(0);
    setPrompt('');
    setErrorMessage('');
  };

  const handleRetry = () => {
    setStage('input');
    setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] bg-white">
        {/* Generating Animation */}
        {stage === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white z-50 flex items-center justify-center"
          >
            <div className="text-center max-w-2xl px-6">
              {/* Form Icon Animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-600 mb-8 relative"
              >
                <FileText className="w-16 h-16 text-white" />
                
                {/* Simple pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-blue-400"
                  animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                AI is Creating Your Form
              </h2>
              
              <p className="text-gray-600 text-lg mb-10">
                {progress < 40 && 'Understanding your requirements...'}
                {progress >= 40 && progress < 80 && 'Building form fields...'}
                {progress >= 80 && 'Almost done...'}
              </p>

              <div className="space-y-4">
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-blue-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Animation */}
        {stage === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white z-50 flex items-center justify-center"
          >
            <div className="text-center max-w-xl px-6">
              {/* Error Icon Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-red-100 mb-8"
              >
                <AlertCircle className="w-14 h-14 text-red-600" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Generation Failed
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg mb-8"
              >
                {errorMessage.includes('429') || errorMessage.includes('rate limit') 
                  ? 'Too many requests. Please wait 30 seconds and try again.'
                  : errorMessage || 'Something went wrong. Please try again.'}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 justify-center"
              >
                <button
                  onClick={handleRetry}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="h-5 w-5" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="border-b border-gray-100 bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">AI Form Builder</h1>
                <p className="text-xs text-gray-500">
                  {stage === 'input' && 'Advanced form generation'}
                  {stage === 'generating' && 'Creating your form...'}
                  {stage === 'success' && 'Form ready'}
                  {stage === 'error' && 'Generation failed'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          <div className="max-w-5xl mx-auto px-8 py-8">
            {stage === 'input' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Your Form
                  </h2>
                  <p className="text-sm text-gray-600">
                    Describe what you need and let AI build it for you
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-3 block">Quick Examples:</label>
                  <div className="flex flex-wrap gap-2.5 mb-4">
                    <button
                      onClick={() => setPrompt('Customer feedback survey with rating scale')}
                      className="px-4 py-2 text-sm bg-white hover:bg-blue-50 text-gray-700 border border-gray-200 hover:border-blue-300 rounded-lg transition-all shadow-sm"
                    >
                      📋 Feedback Survey
                    </button>
                    <button
                      onClick={() => setPrompt('Job application form with resume upload')}
                      className="px-4 py-2 text-sm bg-white hover:bg-purple-50 text-gray-700 border border-gray-200 hover:border-purple-300 rounded-lg transition-all shadow-sm"
                    >
                      💼 Job Application
                    </button>
                    <button
                      onClick={() => setPrompt('Event registration with date and time picker')}
                      className="px-4 py-2 text-sm bg-white hover:bg-green-50 text-gray-700 border border-gray-200 hover:border-green-300 rounded-lg transition-all shadow-sm"
                    >
                      🎉 Event Registration
                    </button>
                    <button
                      onClick={() => setPrompt('Contact form with message field')}
                      className="px-4 py-2 text-sm bg-white hover:bg-pink-50 text-gray-700 border border-gray-200 hover:border-pink-300 rounded-lg transition-all shadow-sm"
                    >
                      ✉️ Contact Form
                    </button>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your form... e.g., Create a survey with rating questions and email field"
                    className="w-full h-36 px-5 py-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Theme Color:</p>
                    <div className="flex flex-wrap gap-2">
                      {themes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => {
                            setSelectedTheme(theme);
                            setIsCustomColor(false);
                          }}
                          className={`px-3 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 ${
                            selectedTheme.name === theme.name && !isCustomColor
                              ? 'border-gray-900 bg-gray-50 shadow-md scale-105'
                              : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                          }`}
                          title={theme.name}
                        >
                          <div 
                            className="w-5 h-5 rounded-md shadow-sm"
                            style={{ backgroundColor: theme.color }}
                          />
                          <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setIsCustomColor(true);
                          setShowColorPicker(!showColorPicker);
                        }}
                        className={`px-3 py-2.5 rounded-lg border-2 transition-all flex items-center gap-2 ${
                          isCustomColor
                            ? 'border-gray-900 bg-gray-50 shadow-md scale-105'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                        }`}
                      >
                        <div 
                          className="w-5 h-5 rounded-md border shadow-sm"
                          style={{ backgroundColor: customColor }}
                        />
                        <span className="text-sm font-medium text-gray-700">Custom</span>
                      </button>
                    </div>
                    {showColorPicker && isCustomColor && (
                      <div className="mt-3 p-4 border-2 border-gray-200 rounded-xl bg-white shadow-xl">
                        <HexColorPicker color={customColor} onChange={setCustomColor} className="!w-full !h-40" />
                        <div className="mt-3 text-sm text-center font-mono text-gray-700 bg-gray-100 py-2 rounded-lg font-semibold">{customColor}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-3">Font Family:</p>
                    <div className="relative">
                      <button
                        onClick={() => setShowFontDropdown(!showFontDropdown)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-gray-400 transition-all shadow-sm"
                      >
                        <span className="text-sm font-medium text-gray-800" style={{ fontFamily: selectedFont.value }}>
                          {selectedFont.name}
                        </span>
                        <svg 
                          className={`w-5 h-5 text-gray-500 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showFontDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                          {fontFamilies.map((font) => (
                            <button
                              key={font.name}
                              onClick={() => {
                                setSelectedFont(font);
                                setShowFontDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left text-sm hover:bg-blue-50 transition-colors ${
                                selectedFont.name === font.name ? 'bg-blue-50 font-semibold' : ''
                              }`}
                              style={{ fontFamily: font.value }}
                            >
                              {font.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="h-6 w-6" />
                    <span>Generate Form with AI</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </motion.div>
            )}

            {stage === 'success' && generatedForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10"
              >
                <div className="flex justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                </div>

                <div>
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-gray-900 mb-3"
                  >
                    Form Created Successfully!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600"
                  >
                    Your AI-powered form is ready to customize
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-left max-w-2xl mx-auto"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {generatedForm.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">
                    {generatedForm.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      {generatedForm.elements?.length || 0} fields
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isCustomColor ? customColor : selectedTheme.color }} />
                      {isCustomColor ? 'Custom' : selectedTheme.name} color
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{selectedFont.name}</span> font
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 max-w-md mx-auto"
                >
                  <button
                    onClick={handleOpenBuilder}
                    className="flex-1 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      Open Builder
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    New Form
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
