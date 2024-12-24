import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '../../store/formStore';
import { useAuthStore } from '../../store/authStore';
import { generateFormWithAI } from '../../lib/aiService';
import { FORM_TEMPLATES } from '../../utils/constants';
import { 
  X, 
  PenLine, 
  LayoutTemplate, 
  Sparkles,
  Loader2,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateFormModal: React.FC<CreateFormModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { saveForm } = useFormStore();
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleStartFromScratch = async () => {
    try {
      setLoading(true);
      const formId = await saveForm({
        title: 'Untitled Form',
        description: '',
        elements: [],
        userId: user!.uid,
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          buttonColor: '#3b82f6',
          borderRadius: '0.5rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      });
      navigate(`/builder/${formId}`);
      toast.success('New form created');
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleUseTemplate = async (template: any) => {
    try {
      setLoading(true);
      const formId = await saveForm({
        title: template.name,
        description: template.description,
        elements: template.elements,
        userId: user!.uid,
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          buttonColor: '#3b82f6',
          borderRadius: '0.5rem',
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      });
      navigate(`/builder/${formId}`);
      toast.success('Template applied successfully');
    } catch (error) {
      console.error('Error applying template:', error);
      toast.error('Failed to apply template');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a description for your form');
      return;
    }

    try {
      setLoading(true);
      const formStructure = await generateFormWithAI(aiPrompt);
      const formId = await saveForm({
        ...formStructure,
        userId: user!.uid,
      });
      navigate(`/builder/${formId}`);
      toast.success('AI-generated form created');
    } catch (error) {
      console.error('Error generating form with AI:', error);
      toast.error('Failed to generate form');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Create New Form</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {!showAiInput ? (
                <>
                  <button
                    onClick={handleStartFromScratch}
                    disabled={loading}
                    className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group relative flex items-center"
                  >
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <PenLine className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-semibold text-gray-900">Start from Scratch</h3>
                      <p className="text-sm text-gray-500">Create a blank form and customize it</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">or choose a template</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FORM_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleUseTemplate(template)}
                        disabled={loading}
                        className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group relative"
                      >
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <LayoutTemplate className="h-4 w-4 text-purple-600" />
                          </div>
                          <h3 className="ml-3 font-semibold text-gray-900">{template.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500">{template.description}</p>
                        <ChevronRight className="h-5 w-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}

                    <button
                      onClick={() => setShowAiInput(true)}
                      disabled={loading}
                      className="p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group relative flex items-center"
                    >
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4 text-left">
                        <h3 className="font-semibold text-gray-900">AI Form Generator</h3>
                        <p className="text-sm text-gray-500">Let AI create a form based on your description</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your form
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="E.g., Create a customer feedback form with questions about product quality, service satisfaction, and improvement suggestions"
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowAiInput(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerateWithAI}
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};