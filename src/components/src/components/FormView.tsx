import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Form } from '../store/formStore';
import { FormPreview } from './FormPreview';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

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
        window.location.href = form.settings.redirectUrl;
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error('Unable to submit form. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Form Not Found'}
          </h2>
          <p className="text-gray-600">
            Please check the form URL or contact the form owner.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            {form.settings?.submitMessage || 'Your response has been recorded successfully.'}
          </p>
          {!form.settings?.redirectUrl && (
            <button
              onClick={() => {
                setSubmitted(false);
                window.location.reload();
              }}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Submit Another Response
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <FormPreview
          title={form.title}
          description={form.description}
          elements={form.elements}
          style={form.style}
          onSubmit={handleSubmit}
          showHeader={true}
          showFooter={true}
        />
      </div>
    </div>
  );
};