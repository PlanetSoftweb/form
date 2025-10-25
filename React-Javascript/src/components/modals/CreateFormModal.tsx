import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '../../store/formStore';
import { useAuthStore } from '../../store/authStore';
import { FORM_TEMPLATES } from '../../utils/constants';
import { AIFormDeveloper } from './AIFormDeveloper';
import { 
  X, 
  PenLine, 
  LayoutTemplate, 
  Sparkles,
  ArrowRight
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
  const [showAIBuilder, setShowAIBuilder] = useState(false);

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
          borderWidth: '1px',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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
          borderWidth: '1px',
          borderColor: '#e5e7eb',
          borderStyle: 'solid',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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

  if (showAIBuilder) {
    return <AIFormDeveloper isOpen={showAIBuilder} onClose={() => setShowAIBuilder(false)} />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-white z-[100] overflow-y-auto">
          <div className="min-h-screen">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
              <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">Create New Form</h1>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="grid gap-4 max-w-3xl mx-auto">
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={handleStartFromScratch}
                  disabled={loading}
                  className="w-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-gray-200 hover:border-blue-400"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <PenLine className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4 text-left flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Start from Scratch</h3>
                      <p className="text-sm text-gray-600">Create a blank form and build it your way</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => setShowAIBuilder(true)}
                  disabled={loading}
                  className="w-full p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 text-left flex-1">
                      <h3 className="text-lg font-semibold text-white">AI Form Generator</h3>
                      <p className="text-sm text-blue-100">Describe your form and let AI build it</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-3 mt-2"
                >
                  <h3 className="text-sm font-medium text-gray-500 px-1">Templates</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {FORM_TEMPLATES.map((template, index) => (
                      <motion.button
                        key={template.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        onClick={() => handleUseTemplate(template)}
                        disabled={loading}
                        className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all text-left group border border-gray-200 hover:border-purple-400"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors flex-shrink-0">
                            <LayoutTemplate className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-0.5">{template.name}</h4>
                            <p className="text-xs text-gray-600 line-clamp-2">{template.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
