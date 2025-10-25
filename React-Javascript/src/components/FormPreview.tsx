import React, { useState } from 'react';
import { FormElement } from '../store/formStore';
import { Check, Star, Upload, X, ChevronRight, ChevronLeft, PartyPopper } from 'lucide-react';
import { CustomSelect } from './ui/CustomSelect';
import toast from 'react-hot-toast';

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
  isPreview?: boolean;
}

export const FormPreview = ({ 
  title, 
  description, 
  elements, 
  style, 
  onSubmit,
  showHeader = false,
  showFooter = false,
  isPreview = false
}: FormPreviewProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File[]>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const splitElementsIntoPages = () => {
    const pages: FormElement[][] = [];
    let currentPageElements: FormElement[] = [];
    
    elements.forEach((element) => {
      if (element.type === 'pagebreak') {
        if (currentPageElements.length > 0) {
          pages.push(currentPageElements);
          currentPageElements = [];
        }
      } else if (element.type !== 'thankyou') {
        currentPageElements.push(element);
      }
    });
    
    if (currentPageElements.length > 0) {
      pages.push(currentPageElements);
    }
    
    return pages.length > 0 ? pages : [elements.filter(el => el.type !== 'thankyou')];
  };

  const getThankYouPage = () => {
    return elements.find(el => el.type === 'thankyou');
  };

  const pages = splitElementsIntoPages();
  const thankYouPage = getThankYouPage();
  const totalPages = pages.length;

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
    if (isPreview) {
      toast.error('You are in preview mode. Please publish your form to accept real submissions.', {
        duration: 4000,
        icon: '👁️',
      });
      return;
    }
    if (validateForm()) {
      onSubmit(responses);
      setSubmitted(true);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      case 'url':
        return (
          <input
            type={element.type}
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            placeholder={element.placeholder}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
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
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            style={inputStyle}
          />
        );

      case 'select':
        return (
          <CustomSelect
            options={element.options || []}
            placeholder={element.placeholder || 'Select an option'}
            value={responses[element.id] || ''}
            onChange={(value) => setResponses({ ...responses, [element.id]: value })}
          />
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option) => (
              <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                <input
                  type="radio"
                  name={element.id}
                  value={option}
                  checked={responses[element.id] === option}
                  onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                  className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option) => (
              <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
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
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700">{option}</span>
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
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-900"
            style={inputStyle}
          />
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-900"
            style={inputStyle}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            value={responses[element.id] || ''}
            onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-gray-900"
            style={inputStyle}
          />
        );

      case 'color':
        return (
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value={responses[element.id] || '#000000'}
                onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                className="h-12 w-24 border-2 border-gray-200 rounded-xl cursor-pointer overflow-hidden"
                style={inputStyle}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={responses[element.id] || '#000000'}
                onChange={(e) => setResponses({ ...responses, [element.id]: e.target.value })}
                placeholder="#000000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                style={inputStyle}
              />
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-3">
            <input
              type="range"
              min={element.validation?.min || 0}
              max={element.validation?.max || 100}
              step={element.validation?.step || 1}
              value={responses[element.id] || element.validation?.min || 0}
              onChange={(e) => setResponses({ ...responses, [element.id]: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{element.validation?.min || 0}</span>
              <span className="font-semibold text-blue-600">{responses[element.id] || element.validation?.min || 0}</span>
              <span>{element.validation?.max || 100}</span>
            </div>
          </div>
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
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setResponses({ ...responses, [element.id]: rating })}
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    rating <= (responses[element.id] || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 fill-gray-300 hover:text-yellow-200 hover:fill-yellow-200'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={responses[element.id] || false}
              onChange={(e) => setResponses({ ...responses, [element.id]: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {responses[element.id] ? 'Yes' : 'No'}
            </span>
          </label>
        );

      case 'tags':
        const tags = responses[element.id] || [];
        const [tagInput, setTagInput] = useState('');
        
        const addTag = () => {
          if (tagInput.trim()) {
            const newTags = [...tags, tagInput.trim()];
            setResponses({ ...responses, [element.id]: newTags });
            setTagInput('');
          }
        };

        const removeTag = (tagToRemove: string) => {
          const newTags = tags.filter((tag: string) => tag !== tagToRemove);
          setResponses({ ...responses, [element.id]: newTags });
        };

        return (
          <div>
            <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl min-h-[52px] bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-900 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                onBlur={addTag}
                placeholder={element.placeholder || 'Add tags...'}
                className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Press Enter to add a tag</p>
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

      case 'pagebreak':
        return null;

      case 'thankyou':
        return null;

      default:
        return null;
    }
  };

  if (submitted && thankYouPage) {
    return (
      <div className="rounded-xl overflow-hidden" style={formStyle}>
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <PartyPopper className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{thankYouPage.label}</h2>
            {thankYouPage.style?.message && (
              <p className="text-lg text-gray-600 mb-8">{thankYouPage.style.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentPageElements = pages[currentPage] || [];

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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 lg:p-10">
          {!showHeader && (
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">{title}</h1>
              {description && (
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl">
                  {description}
                </p>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all ${
                      index === currentPage ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-5 sm:space-y-6 md:space-y-7">
            {currentPageElements.map((element) => (
              <div key={element.id}>
                {element.type !== 'divider' && element.type !== 'heading' && element.type !== 'paragraph' && (
                  <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-700">
                    {element.label}
                    {element.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderElement(element)}
                {errors[element.id] && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors[element.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 flex gap-3">
            {currentPage > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex-1 flex justify-center items-center px-6 py-3 border-2 text-base font-semibold transition-all duration-200"
                style={{
                  borderColor: style.buttonColor,
                  color: style.buttonColor,
                  borderRadius: style.borderRadius,
                }}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
            )}
            
            {currentPage < totalPages - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  backgroundColor: style.buttonColor,
                  borderRadius: style.borderRadius,
                }}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 flex justify-center items-center px-6 py-3 border border-transparent text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  backgroundColor: style.buttonColor,
                  borderRadius: style.borderRadius,
                }}
              >
                <Check className="h-5 w-5 mr-2" />
                Submit Form
              </button>
            )}
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