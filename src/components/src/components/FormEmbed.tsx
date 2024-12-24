import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useFormStore, Form } from '../store/formStore';

export const FormEmbed = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const { submitFormResponse, error } = useFormStore();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;
      const docRef = doc(db, 'forms', formId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm({ id: docSnap.id, ...docSnap.data() } as Form);
      }
    };
    fetchForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) return;
    await submitFormResponse(formId, responses);
    if (!error) {
      setSubmitted(true);
      setResponses({});
    }
  };

  if (!form) return <div>Loading...</div>;

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Thank you!</h2>
          <p className="text-green-700">Your response has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{form.title}</h1>
        
        {form.elements.map((element) => (
          <div key={element.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            
            {element.type === 'textarea' ? (
              <textarea
                required={element.required}
                value={responses[element.id] || ''}
                onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            ) : element.type === 'select' ? (
              <select
                required={element.required}
                value={responses[element.id] || ''}
                onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select an option</option>
                {element.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={element.type}
                required={element.required}
                value={responses[element.id] || ''}
                onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}
          </div>
        ))}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};