import React, { useState } from 'react';
import { FormElement } from '../store/formStore';
import { Check, Star, Upload } from 'lucide-react';

interface FormStyle {
  backgroundColor: string;
  backgroundGradient?: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    direction: string;
  };
  textColor: string;
  buttonColor: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  borderStyle: string;
  boxShadow: string;
  fontFamily: string;
}

interface FormPreviewProps {
  title: string;
  description?: string;
  elements: FormElement[];
  style: FormStyle;
  onSubmit: (responses: Record<string, any>) => void;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const FormPreview = ({ 
  title, 
  description, 
  elements, 
  style, 
  onSubmit,
  showHeader = false,
  showFooter = false 
}: FormPreviewProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    elements.forEach(element => {
      if (element.required && !responses[element.id]) {
        newErrors[element.id] = 'This field is required';
      }
      if (element.type === 'email' && responses[element.id] && 
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(responses[element.id])) {
        newErrors[element.id] = 'Please enter a valid email address';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(responses);
    }
  };

  const getBackgroundStyle = () => {
    if (style.backgroundGradient?.enabled) {
      return {
        background: `linear-gradient(${style.backgroundGradient.direction}, ${style.backgroundGradient.startColor}, ${style.backgroundGradient.endColor})`
      };
    }
    return { backgroundColor: style.backgroundColor };
  };

  const formStyle = {
    ...getBackgroundStyle(),
    color: style.textColor,
    fontFamily: style.fontFamily,
    borderWidth: style.borderWidth,
    borderColor: style.borderColor,
    borderStyle: style.borderStyle,
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow,
  };

  const inputStyle = {
    borderWidth: style.borderWidth,
    borderColor: style.borderColor,
    borderStyle: style.borderStyle,
    borderRadius: style.borderRadius,
  };

  const handleFileChange = (elementId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSelectedFiles(prev => ({
      ...prev,
      [elementId]: fileArray
    }));
    
    setResponses(prev => ({
      ...prev,
      [elementId]: fileArray.map(file => file.name).join(', ')
    }));
  };

  const renderElement = (element: FormElement) => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
        return (
          <input
            type={element.type}
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            placeholder={element.placeholder}
            className="w-full px-4 py-2 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            style={inputStyle}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            placeholder={element.placeholder}
            rows={4}
            className="w-full px-4 py-2 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            style={inputStyle}
          />
        );

      case 'select':
        return (
          <select
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            className="w-full px-4 py-2 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            style={inputStyle}
          >
            <option value="">Select an option</option>
            {element.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-4`}>
            {element.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={element.id}
                  value={option}
                  checked={responses[element.id] === option}
                  onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-4`}>
            {element.options?.map((option) => (
              <label key={option} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={(responses[element.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = responses[element.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    setResponses({ ...responses, [element.id]: newValues });
                  }}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4 rounded"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            className="w-full px-4 py-2 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            style={inputStyle}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            className="w-full px-4 py-2 bg-white/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            style={inputStyle}
          />
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              onChange={(e) => handleFileChange(element.id, e.target.files)}
              accept={element.validation?.acceptedFiles?.join(',')}
              className="hidden"
              id={`file-${element.id}`}
              multiple
            />
            <label
              htmlFor={`file-${element.id}`}
              className="flex items-center justify-center w-full px-4 py-2 bg-white/50 cursor-pointer hover:bg-white/70 transition-colors"
              style={inputStyle}
            >
              <Upload className="h-5 w-5 mr-2 text-gray-400" />
              <span>
                {selectedFiles[element.id]?.length
                  ? `${selectedFiles[element.id].length} file(s) selected`
                  : 'Choose files'}
              </span>
            </label>
            {selectedFiles[element.id]?.length > 0 && (
              <div className="mt-2 text-sm">
                Selected files: {selectedFiles[element.id].map(file => file.name).join(', ')}
              </div>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {Array.from({ length: element.options?.length || 5 }, (_, i) => i + 1).map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setResponses({ ...responses, [element.id]: rating })}
                className={`p-2 rounded-lg transition-colors ${
                  responses[element.id] === rating
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                style={inputStyle}
              >
                <Star
                  className={`h-6 w-6 ${
                    responses[element.id] === rating ? 'fill-current' : 'fill-none'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'heading':
        return (
          <h2
            style={{
              fontSize: element.style?.fontSize || '1.5rem',
              textAlign: (element.style?.textAlign as any) || 'left',
            }}
            className="font-bold"
          >
            {element.label}
          </h2>
        );

      case 'paragraph':
        return (
          <p
            style={{
              fontSize: element.style?.fontSize || '1rem',
              textAlign: (element.style?.textAlign as any) || 'left',
            }}
          >
            {element.label}
          </p>
        );

      case 'image':
        return (
          element.style?.imageUrl && (
            <img
              src={element.style.imageUrl}
              alt={element.label}
              className="rounded-lg"
              style={{
                width: element.style.width || '100%',
                height: element.style.height || 'auto',
                ...inputStyle
              }}
            />
          )
        );

      case 'divider':
        return <hr className="my-6" style={{ borderColor: style.borderColor }} />;

      default:
        return null;
    }
  };

  return (
    <>
      {showHeader && (
        <div className="bg-white border-b px-6 py-4 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {description && <p className="mt-1 text-gray-600">{description}</p>}
          </div>
        </div>
      )}

      <div className="rounded-xl overflow-hidden" style={formStyle}>
        <form onSubmit={handleSubmit} className="p-8">
          {!showHeader && (
            <>
              <h1 className="text-2xl font-bold mb-2">{title}</h1>
              {description && <p className="mb-6" style={{ opacity: 0.7 }}>{description}</p>}
            </>
          )}

          <div className="space-y-6">
            {elements.map((element) => (
              <div key={element.id}>
                {element.type !== 'divider' && element.type !== 'heading' && element.type !== 'paragraph' && (
                  <label className="block text-sm font-medium mb-1">
                    {element.label}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderElement(element)}
                {errors[element.id] && (
                  <p className="mt-1 text-sm text-red-500">{errors[element.id]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: style.buttonColor,
                borderRadius: style.borderRadius,
              }}
            >
              <Check className="h-5 w-5 mr-2" />
              Submit Form
            </button>
          </div>
        </form>
      </div>

      {showFooter && (
        <div className="bg-white border-t px-6 py-4 sticky bottom-0">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-sm text-gray-500">Powered by FormBuilder</p>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">Terms & Privacy</a>
          </div>
        </div>
      )}
    </>
  );
};