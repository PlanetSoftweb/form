import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  X, 
  Copy, 
  Settings2,
  Pencil,
  Check,
  Star,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewEditorProps {
  elements: any[];
  style: any;
  onUpdateElement: (id: string, updates: any) => void;
  onRemoveElement: (id: string) => void;
  onDuplicateElement: (element: any) => void;
  onReorderElements: (elements: any[]) => void;
  onSelectElement: (element: any) => void;
  selectedElement: any;
  onAddElementAtIndex?: (element: any, index: number) => void;
}

const EditableElement = ({ 
  element, 
  style,
  onUpdate,
  onRemove,
  onDuplicate,
  onSelect,
  isSelected
}: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(element.label);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const elementStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderInput = () => {
    const baseClasses = 'w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl transition-all placeholder-gray-400';
    const hoverClasses = isHovered || isSelected ? 'border-blue-400 ring-2 ring-blue-100' : '';
    
    const inputStyles = {
      borderRadius: element.style?.borderRadius ? `${element.style.borderRadius}px` : style.borderRadius,
      padding: element.style?.padding ? `${element.style.padding}px` : undefined,
      backgroundColor: element.style?.backgroundColor || '#ffffff',
      color: element.style?.textColor || '#1f2937',
      textAlign: element.style?.textAlign || 'left',
      borderColor: element.style?.borderColor,
      borderWidth: element.style?.borderWidth ? `${element.style.borderWidth}px` : undefined,
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
      case 'url':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder || `Enter ${element.type}...`}
            className={`${baseClasses} ${hoverClasses}`}
            style={inputStyles}
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className={`${baseClasses} ${hoverClasses} resize-none`}
            rows={4}
            style={inputStyles}
            disabled
          />
        );

      case 'select':
        return (
          <select 
            className={`${baseClasses} ${hoverClasses} appearance-none bg-white`} 
            style={{
              ...inputStyles,
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
            disabled
          >
            <option value="">{element.placeholder || 'Select an option'}</option>
            {element.options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all group">
                <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center">
                  <Check className="h-3 w-3 text-blue-600 opacity-0 group-hover:opacity-100" />
                </div>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-blue-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input 
            type="date" 
            className={`${baseClasses} ${hoverClasses}`} 
            style={{
              ...inputStyles,
              colorScheme: 'light'
            }}
            value="2024-01-01"
            disabled 
          />
        );

      case 'time':
        return (
          <input 
            type="time" 
            className={`${baseClasses} ${hoverClasses}`} 
            style={{
              ...inputStyles,
              colorScheme: 'light'
            }}
            value="12:00"
            disabled 
          />
        );

      case 'file':
        return (
          <div>
            <label
              className="flex items-center justify-center w-full px-4 py-8 bg-white border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
              style={inputStyles}
            >
              <Upload className="h-5 w-5 mr-2 text-gray-400 group-hover:text-blue-500" />
              <span className="text-gray-600 group-hover:text-blue-700">Choose files</span>
            </label>
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className="transition-all hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    isHovered || isSelected
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 fill-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        );

      case 'heading':
        return (
          <h2 
            className="text-3xl font-bold" 
            style={{ 
              color: element.style?.textColor || style.textColor,
              textAlign: element.style?.textAlign || 'left'
            }}
          >
            {element.label}
          </h2>
        );

      case 'paragraph':
        return (
          <p 
            className="text-gray-600 leading-relaxed" 
            style={{ 
              color: element.style?.textColor || style.textColor,
              textAlign: element.style?.textAlign || 'left'
            }}
          >
            {element.content}
          </p>
        );

      case 'datetime':
        return (
          <input 
            type="datetime-local" 
            className={`${baseClasses} ${hoverClasses}`} 
            style={{
              ...inputStyles,
              colorScheme: 'light'
            }}
            value="2024-01-01T12:00"
            disabled 
          />
        );

      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={false}
              className="sr-only peer"
              disabled
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              {isHovered || isSelected ? 'On' : 'Off'}
            </span>
          </label>
        );

      case 'color':
        return (
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="color"
                value="#3b82f6"
                className="h-12 w-24 border-2 border-gray-200 rounded-xl cursor-pointer overflow-hidden"
                style={inputStyles}
                disabled
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value="#3b82f6"
                placeholder="#000000"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 font-mono"
                style={inputStyles}
                disabled
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
              value={50}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              disabled
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{element.validation?.min || 0}</span>
              <span className="font-semibold text-blue-600">50</span>
              <span>{element.validation?.max || 100}</span>
            </div>
          </div>
        );

      case 'tags':
        return (
          <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-200 rounded-xl min-h-[52px] bg-white">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
              Sample Tag
              <X className="h-3 w-3" />
            </span>
            <input
              type="text"
              placeholder={element.placeholder || 'Add tags...'}
              className="flex-1 min-w-[120px] outline-none text-gray-900 placeholder-gray-400"
              disabled
            />
          </div>
        );

      case 'image':
        return (
          element.style?.imageUrl ? (
            <img
              src={element.style.imageUrl}
              alt={element.label}
              className="rounded-lg"
              style={{
                width: element.style.width || '100%',
                height: element.style.height || 'auto',
                ...inputStyles
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Image placeholder</span>
            </div>
          )
        );

      case 'divider':
        return (
          <div 
            className={`h-px ${isHovered || isSelected ? 'bg-blue-400' : 'bg-gray-300'}`}
            style={{
              height: element.style?.borderWidth ? `${element.style.borderWidth}px` : '1px',
              backgroundColor: element.style?.borderColor,
            }}
          />
        );

      case 'pagebreak':
        return (
          <div className="flex flex-col items-center gap-4 my-8">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="flex items-center gap-4">
              <button
                disabled
                className="px-6 py-3 bg-gray-200 text-gray-400 rounded-xl font-medium cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled
                className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        );

      case 'thankyou':
        return (
          <div className="text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{element.label || 'Thank You!'}</h3>
            <p className="text-gray-600">{element.content || 'Your response has been submitted successfully.'}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={elementStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(element);
      }}
      className={`relative mb-6 group cursor-pointer transition-all ${isDragging ? 'opacity-50' : ''} ${
        isSelected 
          ? 'ring-2 ring-blue-500 rounded-lg p-2 -m-2 bg-blue-50/30 shadow-lg' 
          : 'hover:ring-2 hover:ring-blue-300/50 hover:rounded-lg hover:p-1 hover:-m-1'
      }`}
    >
      {/* Figma-Style Compact Toolbar */}
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute -top-9 left-0 z-30"
          >
            <div className="flex items-center gap-0.5 bg-blue-600 rounded-md shadow-lg px-1 py-1">
              <button
                {...attributes}
                {...listeners}
                className="p-1 hover:bg-blue-700 rounded cursor-grab active:cursor-grabbing"
                title="Drag"
              >
                <GripVertical className="h-3.5 w-3.5 text-white" />
              </button>
              
              {element.type !== 'divider' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingLabel(true);
                  }}
                  className="p-1 hover:bg-blue-700 rounded"
                  title="Edit"
                >
                  <Pencil className="h-3.5 w-3.5 text-white" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(element);
                }}
                className="p-1 hover:bg-blue-700 rounded"
                title="Duplicate"
              >
                <Copy className="h-3.5 w-3.5 text-white" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(element);
                }}
                className="p-1 hover:bg-blue-700 rounded"
                title="Settings"
              >
                <Settings2 className="h-3.5 w-3.5 text-white" />
              </button>

              <div className="w-px h-4 bg-blue-500"></div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(element.id);
                }}
                className="p-1 hover:bg-red-600 rounded"
                title="Delete"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label */}
      {element.type !== 'heading' && element.type !== 'paragraph' && element.type !== 'divider' && (
        <div className="mb-3">
          {isEditingLabel ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onUpdate(element.id, { label: labelValue });
                    setIsEditingLabel(false);
                  }
                  if (e.key === 'Escape') {
                    setIsEditingLabel(false);
                    setLabelValue(element.label);
                  }
                }}
                className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => {
                  onUpdate(element.id, { label: labelValue });
                  setIsEditingLabel(false);
                }}
                className="p-2 bg-blue-600 text-white rounded-lg"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label 
              className={`block font-semibold ${isHovered || isSelected ? 'text-blue-600' : ''}`}
              style={{ 
                fontFamily: style.fontFamily,
                color: isHovered || isSelected ? undefined : style.textColor
              }}
            >
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      )}

      {/* Input */}
      {renderInput()}
    </div>
  );
};

export const LivePreviewEditor: React.FC<LivePreviewEditorProps> = ({
  elements,
  style,
  onUpdateElement,
  onRemoveElement,
  onDuplicateElement,
  onReorderElements,
  onSelectElement,
  selectedElement,
  onAddElementAtIndex,
}) => {
  const [draggedElement, setDraggedElement] = useState<any>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedElement(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((e) => e.id === active.id);
      const newIndex = elements.findIndex((e) => e.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newElements = arrayMove(elements, oldIndex, newIndex);
        onReorderElements(newElements);
      }
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

  const handleExternalDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDropIndex(null);
    
    try {
      const data = e.dataTransfer.getData('application/json');
      if (data && onAddElementAtIndex) {
        const element = JSON.parse(data);
        const newElement: any = {
          type: element.type,
          label: element.type === 'heading' ? element.content : element.label,
          required: false,
        };
        if (element.placeholder) newElement.placeholder = element.placeholder;
        if (element.options) newElement.options = element.options;
        if (element.content && element.type !== 'heading') newElement.content = element.content;
        
        onAddElementAtIndex(newElement, index);
      }
    } catch (error) {
      console.error('Drop error:', error);
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto p-8 rounded-2xl cursor-default"
      onClick={(e) => {
        e.stopPropagation();
        // Deselect when clicking on the form background (not on elements)
        if (e.target === e.currentTarget) {
          onSelectElement(null);
        }
      }}
      style={{
        ...getBackgroundStyle(),
        fontFamily: style.fontFamily,
        borderWidth: style.borderWidth,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        color: style.textColor,
      }}
    >
      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={(event) => {
          const element = elements.find(e => e.id === event.active.id);
          setDraggedElement(element);
        }}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={elements} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {/* Drop zone at the start */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDropIndex(0);
              }}
              onDragLeave={() => setDropIndex(null)}
              onDrop={(e) => handleExternalDrop(e, 0)}
              className={`h-2 -mb-4 transition-all ${
                dropIndex === 0 ? 'h-12 bg-blue-100 border-2 border-dashed border-blue-500 rounded-lg mb-2' : ''
              }`}
            />
            
            {elements.map((element, index) => (
              <div key={element.id}>
                <EditableElement
                  element={element}
                  style={style}
                  onUpdate={onUpdateElement}
                  onRemove={onRemoveElement}
                  onDuplicate={onDuplicateElement}
                  onSelect={onSelectElement}
                  isSelected={selectedElement?.id === element.id}
                />
                {/* Drop zone after each element */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDropIndex(index + 1);
                  }}
                  onDragLeave={() => setDropIndex(null)}
                  onDrop={(e) => handleExternalDrop(e, index + 1)}
                  className={`h-2 -my-2 transition-all ${
                    dropIndex === index + 1 ? 'h-12 bg-blue-100 border-2 border-dashed border-blue-500 rounded-lg my-2' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {draggedElement ? (
            <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-2xl opacity-90">
              <p className="font-medium">{draggedElement.label}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Submit Button Preview */}
      {elements.length > 0 && (
        <button
          className="w-full mt-8 px-6 py-3 rounded-lg font-medium text-white transition-all"
          style={{
            backgroundColor: style.buttonColor,
            borderRadius: style.borderRadius,
          }}
          disabled
        >
          Submit
        </button>
      )}
    </div>
  );
};
