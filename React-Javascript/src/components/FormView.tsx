import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Form } from '../store/formStore';
import { FormPreview } from './FormPreview';
import { CheckCircle, AlertCircle, ExternalLink, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { SEO, updateFavicon } from './SEO';

export const FormView = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) return;
      
      try {
        const formDoc = await getDoc(doc(db, 'forms', formId));
        
        if (!formDoc.exists()) {
          setError('This form is not available');
          return;
        }

        const formData = formDoc.data() as Form;
        
        if (!formData.published) {
          setError('This form is currently not accepting responses');
          return;
        }

        setForm({
          ...formData,
          id: formDoc.id,
        });

        if (formData.title) {
          updateFavicon(formData.title, formData.style?.buttonColor || '#3B82F6');
        }
      } catch (err) {
        console.error('Error loading form:', err);
        setError('Unable to load the form. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]);

  const handleSubmit = async (responses: Record<string, any>) => {
    if (!formId || !form) return;
    
    try {
      await addDoc(collection(db, `forms/${formId}/submissions`), {
        responses,
        submittedAt: serverTimestamp(),
      });
      
      setSubmitted(true);
      toast.success(form.settings?.submitMessage || 'Thank you for your submission!');

      if (form.settings?.redirectUrl) {
        setTimeout(() => {
          window.location.href = form.settings!.redirectUrl!;
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Unable to submit form. Please try again.');
    }
  };

  if (loading) {
    return (
      <>
        <SEO title="Loading Form..." />
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {/* Modern Spinner */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-gray-200"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600"
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <motion.div
                className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-600"
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="h-8 w-8 text-blue-600" />
              </motion.div>
            </div>
            
            {/* Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Loading Form</h3>
              <motion.p 
                className="text-sm sm:text-base text-gray-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Please wait...
              </motion.p>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (error || !form) {
    return (
      <>
        <SEO title="Form Not Found | AI FormBuilder" />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg w-full"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border border-red-100">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 mb-6"
              >
                <AlertCircle className="h-12 w-12 text-red-600" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-4"
              >
                {error || 'Form Not Found'}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg mb-8"
              >
                Please check the form URL or contact the form owner for assistance.
              </motion.p>
              
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Go to Homepage
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center border border-green-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-8"
            >
              <CheckCircle className="h-16 w-16 text-green-600" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Thank You!
              </h2>
              <p className="text-gray-600 text-xl leading-relaxed max-w-lg mx-auto">
                {form.settings?.submitMessage || 'Your response has been recorded successfully. We appreciate your time!'}
              </p>
            </motion.div>

            {form.settings?.redirectUrl && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Redirecting you shortly...</span>
              </motion.div>
            )}

            {!form.settings?.redirectUrl && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => {
                  setSubmitted(false);
                  window.location.reload();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-6"
              >
                Submit Another Response
                <ExternalLink className="h-5 w-5" />
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-8 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Your response is securely encrypted and stored</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 mb-3">Powered by</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <Sparkles className="h-5 w-5" />
              <span>AI FormBuilder</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        formName={form.title}
        description={form.description || `Fill out this form: ${form.title}`}
      />
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <FormPreview
            title={form.title}
            description={form.description}
            elements={form.elements}
            style={form.style as any}
            onSubmit={handleSubmit}
            showHeader={false}
            showFooter={false}
          />
        </div>
      </div>
    </>
  );
};
