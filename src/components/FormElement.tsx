import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  X, 
  Plus,
  Trash2,
  Settings,
  Copy,
  Upload,
  Star
} from 'lucide-react';
import { FormElement as FormElementType } from '../store/formStore';
import { CustomSelect } from './ui/CustomSelect';

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
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900 placeholder-gray-400"
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900 placeholder-gray-400 resize-none"
            rows={4}
            disabled
          />
        );

      case 'select':
        return (
          <CustomSelect
            options={element.options || []}
            placeholder={element.placeholder || 'Select an option'}
            disabled={true}
          />
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                <input
                  type="radio"
                  name={element.id}
                  disabled
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option, index) => (
              <label key={index} className="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  disabled
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900"
            disabled
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900"
            disabled
          />
        );

      case 'url':
        return (
          <input
            type="url"
            placeholder={element.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white text-gray-900 placeholder-gray-400"
            disabled
          />
        );

      case 'color':
        return (
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                className="h-12 w-24 border-2 border-gray-200 rounded-xl cursor-pointer overflow-hidden"
                disabled
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value="#000000"
                placeholder="#000000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-mono"
                disabled
              />
            </div>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        );

      case 'datetime':
        return (
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg"
            disabled
          />
        );

      case 'file':
        return (
          <div className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                disabled
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
        );

      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" disabled />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">Toggle</span>
          </label>
        );

      case 'tags':
        return (
          <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl min-h-[48px] bg-white">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              Example Tag
              <X className="h-3 w-3 cursor-pointer hover:text-blue-900" />
            </span>
            <input
              type="text"
              placeholder={element.placeholder || 'Add tags...'}
              className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400"
              disabled
            />
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

        {['text', 'textarea', 'email', 'number', 'phone', 'url'].includes(element.type) && (
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

        {element.type === 'range' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min</label>
                <input
                  type="number"
                  value={element.validation?.min || 0}
                  onChange={(e) => onUpdate(element.id, {
                    validation: { ...element.validation, min: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max</label>
                <input
                  type="number"
                  value={element.validation?.max || 100}
                  onChange={(e) => onUpdate(element.id, {
                    validation: { ...element.validation, max: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Step</label>
                <input
                  type="number"
                  value={element.validation?.step || 1}
                  onChange={(e) => onUpdate(element.id, {
                    validation: { ...element.validation, step: Number(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
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

      {(element as any).description && (
        <p className="text-sm text-gray-500 mb-2">{(element as any).description}</p>
      )}

      {renderInput()}
      {renderSettings()}
    </div>
  );
};