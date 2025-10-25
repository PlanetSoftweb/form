import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FormElement } from '../../store/formStore';

interface EditSubmissionModalProps {
  elements: FormElement[];
  editedResponses: Record<string, any>;
  setEditedResponses: (responses: Record<string, any>) => void;
  onClose: () => void;
  onSave: () => void;
}

export const EditSubmissionModal: React.FC<EditSubmissionModalProps> = ({
  elements,
  editedResponses,
  setEditedResponses,
  onClose,
  onSave
}) => {
  const renderFormElement = (element: FormElement) => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={element.type}
              value={editedResponses[element.id] || ''}
              onChange={(e) => setEditedResponses({
                ...editedResponses,
                [element.id]: e.target.value
              })}
              placeholder={element.placeholder}
              required={element.required}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={editedResponses[element.id] || ''}
              onChange={(e) => setEditedResponses({
                ...editedResponses,
                [element.id]: e.target.value
              })}
              placeholder={element.placeholder}
              required={element.required}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'select':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={editedResponses[element.id] || ''}
              onChange={(e) => setEditedResponses({
                ...editedResponses,
                [element.id]: e.target.value
              })}
              required={element.required}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {element.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case 'radio':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`grid grid-cols-${element.style?.columns || 1} gap-2`}>
              {element.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={element.id}
                    value={option}
                    checked={editedResponses[element.id] === option}
                    onChange={(e) => setEditedResponses({
                      ...editedResponses,
                      [element.id]: e.target.value
                    })}
                    required={element.required}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`grid grid-cols-${element.style?.columns || 1} gap-2`}>
              {element.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={(editedResponses[element.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = editedResponses[element.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      setEditedResponses({
                        ...editedResponses,
                        [element.id]: newValues
                      });
                    }}
                    required={element.required && (editedResponses[element.id] || []).length === 0}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={editedResponses[element.id] || ''}
              onChange={(e) => setEditedResponses({
                ...editedResponses,
                [element.id]: e.target.value
              })}
              required={element.required}
              min={element.validation?.min}
              max={element.validation?.max}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'time':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="time"
              value={editedResponses[element.id] || ''}
              onChange={(e) => setEditedResponses({
                ...editedResponses,
                [element.id]: e.target.value
              })}
              required={element.required}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        );

      case 'rating':
        return (
          <div key={element.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex gap-2">
              {element.options?.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setEditedResponses({
                    ...editedResponses,
                    [element.id]: index + 1
                  })}
                  className={`w-10 h-10 rounded-lg border ${
                    editedResponses[element.id] === index + 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Edit Submission</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {elements.map(element => renderFormElement(element))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};