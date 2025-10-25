import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  X, 
  Settings2,
  Copy,
  Pencil,
  Check,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';

interface InPlaceEditorProps {
  element: any;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onDuplicate?: (element: any) => void;
  onSelect?: (element: any) => void;
  isSelected?: boolean;
  style: any;
}

export const InPlaceEditor: React.FC<InPlaceEditorProps> = ({
  element,
  onRemove,
  onUpdate,
  onDuplicate,
  onSelect,
  isSelected,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(element.label);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

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
    fontFamily: style.fontFamily,
  };

  const handleLabelSave = () => {
    onUpdate(element.id, { label: labelValue });
    setIsEditingLabel(false);
  };

  const handleStyleChange = (field: string, value: any) => {
    onUpdate(element.id, {
      style: { ...element.style, [field]: value }
    });
  };

  const renderInput = () => {
    const baseInputClasses = 'w-full px-4 py-3 border-2 transition-all';
    const hoverClasses = isHovered || isSelected ? 'border-blue-400 bg-blue-50/20' : 'border-gray-200 bg-white';
    const inputClasses = `${baseInputClasses} ${hoverClasses}`;

    // Apply element-specific styles
    const elementStyles = {
      borderRadius: element.style?.borderRadius ? `${element.style.borderRadius}px` : style.borderRadius,
      padding: element.style?.padding ? `${element.style.padding}px` : undefined,
      textAlign: element.style?.textAlign || 'left',
      backgroundColor: element.style?.backgroundColor || undefined,
      color: element.style?.textColor || undefined,
      borderColor: element.style?.borderColor || undefined,
      borderWidth: element.style?.borderWidth ? `${element.style.borderWidth}px` : undefined,
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'phone':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className={inputClasses}
            style={elementStyles}
            disabled
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            className={inputClasses}
            rows={4}
            style={elementStyles}
            disabled
          />
        );

      case 'select':
        return (
          <select 
            className={inputClasses}
            style={elementStyles}
            disabled
          >
            <option value="">Select an option</option>
            {element.options?.map((option: string, index: number) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                  isHovered || isSelected ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  <div className="w-3 h-3 rounded-full bg-blue-500 m-0.5 opacity-0 group-hover:opacity-100"></div>
                </div>
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className={`grid grid-cols-${element.style?.columns || 1} gap-3`}>
            {element.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded-lg border-2 transition-all ${
                  isHovered || isSelected ? 'border-blue-500' : 'border-gray-300'
                }`}>
                  <Check className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            className={inputClasses}
            style={elementStyles}
            disabled
          />
        );

      case 'time':
        return (
          <input
            type="time"
            className={inputClasses}
            style={elementStyles}
            disabled
          />
        );

      case 'file':
        return (
          <div className={`${inputClasses} flex items-center justify-center py-8`} style={elementStyles}>
            <div className="text-center">
              <div className="text-gray-400 mb-2">📎</div>
              <p className="text-sm text-gray-500">Click to upload or drag file here</p>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-3xl transition-all ${
                  isHovered || isSelected ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-500`}
              >
                ★
              </button>
            ))}
          </div>
        );

      case 'heading':
        return (
          <h2 
            className="text-3xl font-bold text-gray-900" 
            style={{ 
              fontFamily: style.fontFamily,
              textAlign: element.style?.textAlign || 'left',
              color: element.style?.textColor || undefined,
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
              fontFamily: style.fontFamily,
              textAlign: element.style?.textAlign || 'left',
              color: element.style?.textColor || undefined,
            }}
          >
            {element.content}
          </p>
        );

      case 'divider':
        return (
          <div className="relative py-4">
            <div 
              className={`h-px ${isHovered || isSelected ? 'bg-blue-400' : 'bg-gray-300'}`}
              style={{
                height: element.style?.borderWidth ? `${element.style.borderWidth}px` : '1px',
                backgroundColor: element.style?.borderColor || undefined,
              }}
            ></div>
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
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isSelected) setShowStyleMenu(false);
      }}
      onClick={() => onSelect?.(element)}
      className={`group relative mb-6 transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isSelected ? 'ring-2 ring-blue-400/50 rounded-xl' : ''}`}
    >
      {/* Clean Hover Toolbar */}
      <AnimatePresence>
        {(isHovered || isSelected) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute -top-11 left-0 right-0 flex items-center justify-between z-30"
          >
            <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/80 px-1.5 py-1.5">
              {/* Drag Handle */}
              <button
                {...attributes}
                {...listeners}
                className="p-1.5 hover:bg-gray-100 rounded-md cursor-grab active:cursor-grabbing transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </button>
              
              <div className="w-px h-5 bg-gray-200"></div>
              
              {/* Edit Label */}
              {element.type !== 'divider' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingLabel(true);
                  }}
                  className="p-1.5 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit Label"
                >
                  <Pencil className="h-4 w-4 text-gray-600" />
                </button>
              )}

              {/* Quick Style Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStyleMenu(!showStyleMenu);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    showStyleMenu ? 'bg-purple-50 text-purple-600' : 'hover:bg-purple-50 text-gray-600'
                  }`}
                  title="Quick Style"
                >
                  <Palette className="h-4 w-4" />
                </button>

                {/* Style Popover */}
                <AnimatePresence>
                  {showStyleMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Quick Style
                      </h3>
                      
                      <div className="space-y-3">
                        {/* Text Alignment */}
                        {!['divider'].includes(element.type) && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              Alignment
                            </label>
                            <div className="flex gap-1">
                              {[
                                { value: 'left', icon: AlignLeft },
                                { value: 'center', icon: AlignCenter },
                                { value: 'right', icon: AlignRight },
                              ].map(({ value, icon: Icon }) => (
                                <button
                                  key={value}
                                  onClick={() => handleStyleChange('textAlign', value)}
                                  className={`flex-1 p-2 rounded-lg border transition-all ${
                                    element.style?.textAlign === value
                                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <Icon className="h-4 w-4 mx-auto" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Background Color */}
                        {['text', 'textarea', 'email', 'phone', 'number', 'select', 'date', 'time'].includes(element.type) && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              Background
                            </label>
                            <div className="relative">
                              <button
                                onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')}
                                className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <div 
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{ backgroundColor: element.style?.backgroundColor || '#ffffff' }}
                                ></div>
                                <span className="text-sm text-gray-700">
                                  {element.style?.backgroundColor || '#ffffff'}
                                </span>
                              </button>
                              {showColorPicker === 'bg' && (
                                <div className="absolute left-0 top-full mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border">
                                  <HexColorPicker
                                    color={element.style?.backgroundColor || '#ffffff'}
                                    onChange={(color) => handleStyleChange('backgroundColor', color)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Text Color */}
                        {!['divider', 'file'].includes(element.type) && (
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                              Text Color
                            </label>
                            <div className="relative">
                              <button
                                onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
                                className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                              >
                                <div 
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{ backgroundColor: element.style?.textColor || '#000000' }}
                                ></div>
                                <span className="text-sm text-gray-700">
                                  {element.style?.textColor || '#000000'}
                                </span>
                              </button>
                              {showColorPicker === 'text' && (
                                <div className="absolute left-0 top-full mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border">
                                  <HexColorPicker
                                    color={element.style?.textColor || '#000000'}
                                    onChange={(color) => handleStyleChange('textColor', color)}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Border Radius */}
                        {!['divider', 'heading', 'paragraph'].includes(element.type) && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-gray-600">
                                Corner Radius
                              </label>
                              <span className="text-xs font-medium text-gray-900">
                                {element.style?.borderRadius || 0}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="24"
                              value={element.style?.borderRadius || 0}
                              onChange={(e) => handleStyleChange('borderRadius', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        )}

                        {/* Padding */}
                        {!['divider', 'heading', 'paragraph'].includes(element.type) && (
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-xs font-semibold text-gray-600">
                                Padding
                              </label>
                              <span className="text-xs font-medium text-gray-900">
                                {element.style?.padding || 12}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="4"
                              max="32"
                              value={element.style?.padding || 12}
                              onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        )}

                        {/* Border for divider */}
                        {element.type === 'divider' && (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-semibold text-gray-600">
                                  Thickness
                                </label>
                                <span className="text-xs font-medium text-gray-900">
                                  {element.style?.borderWidth || 1}px
                                </span>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="8"
                                value={element.style?.borderWidth || 1}
                                onChange={(e) => handleStyleChange('borderWidth', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                Color
                              </label>
                              <div className="relative">
                                <button
                                  onClick={() => setShowColorPicker(showColorPicker === 'border' ? null : 'border')}
                                  className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                >
                                  <div 
                                    className="w-6 h-6 rounded border border-gray-300"
                                    style={{ backgroundColor: element.style?.borderColor || '#d1d5db' }}
                                  ></div>
                                  <span className="text-sm text-gray-700">
                                    {element.style?.borderColor || '#d1d5db'}
                                  </span>
                                </button>
                                {showColorPicker === 'border' && (
                                  <div className="absolute left-0 top-full mt-2 z-50 bg-white p-3 rounded-lg shadow-xl border">
                                    <HexColorPicker
                                      color={element.style?.borderColor || '#d1d5db'}
                                      onChange={(color) => handleStyleChange('borderColor', color)}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-px h-5 bg-gray-200"></div>

              {/* Duplicate */}
              {onDuplicate && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(element);
                  }}
                  className="p-1.5 hover:bg-green-50 rounded-md transition-colors"
                  title="Duplicate"
                >
                  <Copy className="h-4 w-4 text-gray-600" />
                </button>
              )}

              {/* More Settings */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(element);
                }}
                className="p-1.5 hover:bg-indigo-50 rounded-md transition-colors"
                title="More Settings"
              >
                <Settings2 className="h-4 w-4 text-gray-600" />
              </button>

              <div className="w-px h-5 bg-gray-200"></div>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(element.id);
                }}
                className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Label with Inline Editing */}
      {element.type !== 'heading' && element.type !== 'paragraph' && element.type !== 'divider' && (
        <div className="mb-3">
          {isEditingLabel ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={labelValue}
                onChange={(e) => setLabelValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLabelSave();
                  if (e.key === 'Escape') {
                    setIsEditingLabel(false);
                    setLabelValue(element.label);
                  }
                }}
                className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg focus:outline-none shadow-sm"
                autoFocus
              />
              <button
                onClick={handleLabelSave}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label 
              className={`block font-semibold transition-colors ${
                isHovered || isSelected ? 'text-blue-600' : 'text-gray-900'
              }`}
              style={{ fontFamily: style.fontFamily }}
            >
              {element.label}
              {element.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
      )}

      {/* Input Element */}
      <div className={`transition-all ${isHovered || isSelected ? 'scale-[1.005]' : ''}`}>
        {renderInput()}
      </div>
    </div>
  );
};
