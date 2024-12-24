import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormStore } from '../store/formStore';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PenLine, Sparkles, Layout, ArrowRight, Loader2 } from 'lucide-react';
import { generateFormWithAI } from '../lib/aiService';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const templates = [
  {
    id: 'contact',
    name: 'Contact Form',
    description: 'Basic contact form with name, email, and message fields',
    elements: [
      { type: 'text', label: 'Full Name', required: true, id: 'name' },
      { type: 'email', label: 'Email Address', required: true, id: 'email' },
      { type: 'textarea', label: 'Message', required: true, id: 'message' }
    ]
  },
  {
    id: 'feedback',
    name: 'Customer Feedback',
    description: 'Collect detailed feedback about your product or service',
    elements: [
      { type: 'text', label: 'Name', required: true, id: 'name' },
      { type: 'email', label: 'Email', required: true, id: 'email' },
      { type: 'select', label: 'Rating', required: true, id: 'rating', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
      { type: 'textarea', label: 'What could we improve?', required: false, id: 'improvements' }
    ]
  },
  {
    id: 'event',
    name: 'Event Registration',
    description: 'Collect registrations for your upcoming event',
    elements: [
      { type: 'text', label: 'Attendee Name', required: true, id: 'name' },
      { type: 'email', label: 'Email Address', required: true, id: 'email' },
      { type: 'select', label: 'Ticket Type', required: true, id: 'ticket', options: ['Standard', 'VIP', 'Group'] },
      { type: 'textarea', label: 'Special Requirements', required: false, id: 'requirements' }
    ]
  }
];

export const FormCreationModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { saveForm } = useFormStore();
  const [step, setStep] = useState<'select' | 'custom' | 'ai' | 'template'>('select');
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleCustomForm = async () => {
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
        }
      });
      navigate(`/builder/${formId}`);
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  const handleAIForm = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please enter a prompt for the AI');
      return;
    }

    try {
      setLoading(true);
      const generatedForm = await generateFormWithAI(aiPrompt);
      const formId = await saveForm({
        ...generatedForm,
        userId: user!.uid,
      });
      navigate(`/builder/${formId}`);
    } catch (error) {
      console.error('Error generating AI form:', error);
      toast.error('Failed to generate form with AI');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateForm = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    try {
      setLoading(true);
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) throw new Error('Template not found');

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
        }
      });
      navigate(`/builder/${formId}`);
    } catch (error) {
      console.error('Error creating form from template:', error);
      toast.error('Failed to create form from template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              {step === 'select' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Form</h2>
                    <p className="mt-2 text-gray-600">Choose how you want to create your form</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <button
                      onClick={() => setStep('custom')}
                      className="p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <PenLine className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900">Custom Form</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Create a form from scratch with our drag-and-drop builder
                      </p>
                    </button>

                    <button
                      onClick={() => setStep('ai')}
                      className="p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Sparkles className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900">AI Generator</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Let AI create a form based on your description
                      </p>
                    </button>

                    <button
                      onClick={() => setStep('template')}
                      className="p-6 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Layout className="h-8 w-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900">Templates</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start with a pre-built template
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {step === 'custom' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Custom Form</h2>
                    <p className="mt-2 text-gray-600">Create your form from scratch</p>
                  </div>

                  <p className="text-gray-600">
                    You'll be redirected to our form builder where you can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Add and arrange form elements</li>
                    <li>Customize styles and appearance</li>
                    <li>Set validation rules</li>
                    <li>Preview your form in real-time</li>
                  </ul>

                  <div className="flex justify-end">
                    <button
                      onClick={handleCustomForm}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <ArrowRight className="h-5 w-5 mr-2" />
                      )}
                      Start Building
                    </button>
                  </div>
                </div>
              )}

              {step === 'ai' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">AI Form Generator</h2>
                    <p className="mt-2 text-gray-600">Describe your form and let AI create it</p>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Describe the form you want to create... (e.g., 'Create a job application form with fields for personal information, work experience, and education')"
                      className="w-full h-32 px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-sm text-gray-500">
                      The AI will generate form fields, labels, and validation rules based on your description.
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleAIForm}
                      disabled={loading || !aiPrompt.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <Sparkles className="h-5 w-5 mr-2" />
                      )}
                      Generate Form
                    </button>
                  </div>
                </div>
              )}

              {step === 'template' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
                    <p className="mt-2 text-gray-600">Start with a pre-built template</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`p-4 text-left border rounded-lg transition-colors ${
                          selectedTemplate === template.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-blue-500 hover:bg-blue-50'
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{template.description}</p>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleTemplateForm}
                      disabled={loading || !selectedTemplate}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        <Layout className="h-5 w-5 mr-2" />
                      )}
                      Use Template
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};