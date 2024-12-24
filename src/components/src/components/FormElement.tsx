import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  X, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Plus,
  Trash2,
  Settings,
  Copy
} from 'lucide-react';
import { FormElement as FormElementType } from '../store/formStore';

interface Props {
  element: FormElementType;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<FormElementType>) => void;
  onDuplicate?: (element: FormElementType) => void;
  style: any;
}

export const FormElement = ({ element, onRemove, onUpdate, onDuplicate, style }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: element.id });

  const elementStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    fontFamily: style.fontFamily,
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(element.options || [])];
    newOptions[index] = value;
    onUpdate(element.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(element.options || []), `Option ${(element.options?.length || 0) + 1}`];
    onUpdate(element.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = element.options?.filter((_, i) => i !== index);
    onUpdate(element.id, { options: newOptions });
  };

  const renderInput = () => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className="w-full px-3 py-2 border rounded-lg"
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
            disabled
          />
        );

      case 'select':
        return (
          <select className="w-full px-3 py-2 border rounded-lg" disabled>
            <option value="">Select an option</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-2`}>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  name={element.id}
                  disabled
                  className="mr-2"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-2`}>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  disabled
                  className="mr-2"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg"
            disabled
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className="w-full px-3 py-2 border rounded-lg"
            disabled
          />
        );

      case 'file':
        return (
          <input
            type="file"
            className="w-full px-3 py-2 border rounded-lg"
            disabled
          />
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {element.options?.map((_, index) => (
              <button
                key={index}
                className="p-2 border rounded-lg hover:bg-gray-50"
                disabled
              >
                {index + 1}
              </button>
            ))}
          </div>
        );

      // ... rest of your existing cases ...

      default:
        return null;
    }
  };

  const renderSettings = () => {
    if (!isEditing) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Label
          </label>
          <input
            type="text"
            value={element.label}
            onChange={(e) => onUpdate(element.id, { label: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {['text', 'textarea', 'email', 'number', 'phone'].includes(element.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={element.placeholder || ''}
              onChange={(e) => onUpdate(element.id, { placeholder: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        )}

        {['radio', 'checkbox', 'select'].includes(element.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options
            </label>
            <div className="space-y-2">
              {element.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus size={16} className="mr-1" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {['radio', 'checkbox'].includes(element.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Layout Columns
            </label>
            <select
              value={element.style?.columns || 1}
              onChange={(e) => onUpdate(element.id, {
                style: { ...element.style, columns: Number(e.target.value) }
              })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} Column{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={element.required}
              onChange={(e) => onUpdate(element.id, { required: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Required field</span>
          </label>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={elementStyle}
      className="group relative bg-white border rounded-lg p-4 mb-4 hover:border-blue-500 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical size={20} className="text-gray-400" />
          </button>
          <span className="font-medium">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Settings size={16} />
          </button>
          {onDuplicate && (
            <button
              onClick={() => onDuplicate(element)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <Copy size={16} />
            </button>
          )}
          <button
            onClick={() => onRemove(element.id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {element.description && (
        <p className="text-sm text-gray-500 mb-2">{element.description}</p>
      )}

      {renderInput()}
      {renderSettings()}
    </div>
  );
};