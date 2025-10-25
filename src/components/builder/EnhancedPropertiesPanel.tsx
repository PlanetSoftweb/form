import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Type, 
  Layout, 
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface EnhancedPropertiesPanelProps {
  selectedElement: any;
  onUpdate: (id: string, updates: any) => void;
  onClose: () => void;
}

export const EnhancedPropertiesPanel: React.FC<EnhancedPropertiesPanelProps> = ({
  selectedElement,
  onUpdate,
  onClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>('content');

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
          <Settings className="h-10 w-10 text-white" />
        </div>
        <p className="text-gray-900 font-semibold text-lg">No Element Selected</p>
        <p className="text-sm text-gray-500 mt-2">
          Click on any form element to edit its properties
        </p>
      </div>
    );
  }

  const sections = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'layout', label: 'Layout', icon: Layout },
  ];

  const handleChange = (field: string, value: any) => {
    onUpdate(selectedElement.id, { [field]: value });
  };

  const handleStyleChange = (field: string, value: any) => {
    onUpdate(selectedElement.id, {
      style: { ...selectedElement.style, [field]: value }
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Element Properties</h2>
              <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                {selectedElement.type} element
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            title="Close Properties"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="bg-white rounded-lg px-3 py-2 border border-blue-200">
          <p className="text-xs text-gray-500 mb-1">Selected:</p>
          <p className="text-sm font-bold text-gray-900 truncate">"{selectedElement.label || 'Untitled'}"</p>
        </div>
      </div>

      <div className="flex gap-1 p-2 border-b bg-white/50">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSection === 'content' && (
          <>
            {selectedElement.type !== 'divider' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Label
                </label>
                <input
                  type="text"
                  value={selectedElement.label || ''}
                  onChange={(e) => handleChange('label', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {['text', 'textarea', 'email', 'phone', 'number'].includes(selectedElement.type) && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={selectedElement.placeholder || ''}
                  onChange={(e) => handleChange('placeholder', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            )}

            {selectedElement.type === 'paragraph' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Content
                </label>
                <textarea
                  value={selectedElement.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                />
              </div>
            )}

            {selectedElement.type === 'heading' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Heading Level
                </label>
                <select
                  value={selectedElement.level || 'h1'}
                  onChange={(e) => handleChange('level', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="h1">Heading 1 (Largest)</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>
              </div>
            )}

            {!['heading', 'paragraph', 'divider'].includes(selectedElement.type) && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="required"
                  checked={selectedElement.required || false}
                  onChange={(e) => handleChange('required', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="required" className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                  Required field
                </label>
              </div>
            )}

            {['select', 'radio', 'checkbox'].includes(selectedElement.type) && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Options
                </label>
                <div className="space-y-2">
                  {(selectedElement.options || []).map((option: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...selectedElement.options];
                          newOptions[index] = e.target.value;
                          handleChange('options', newOptions);
                        }}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = selectedElement.options.filter((_: any, i: number) => i !== index);
                          handleChange('options', newOptions);
                        }}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newOptions = [...(selectedElement.options || []), `Option ${(selectedElement.options?.length || 0) + 1}`];
                      handleChange('options', newOptions);
                    }}
                    className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {activeSection === 'layout' && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Use the <strong>Style</strong> panel on the left to customize colors, borders, shadows, and overall form appearance.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Text Alignment
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => handleStyleChange('textAlign', value)}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      selectedElement.style?.textAlign === value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Width
              </label>
              <select
                value={selectedElement.style?.width || 'full'}
                onChange={(e) => handleStyleChange('width', e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="full">Full Width (100%)</option>
                <option value="3/4">3/4 Width (75%)</option>
                <option value="1/2">Half Width (50%)</option>
                <option value="1/3">1/3 Width (33%)</option>
                <option value="1/4">1/4 Width (25%)</option>
              </select>
            </div>

            {['radio', 'checkbox'].includes(selectedElement.type) && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Columns
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => handleStyleChange('columns', num)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedElement.style?.columns === num
                          ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Spacing
              </label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Padding</span>
                  <span className="text-xs font-medium text-gray-900">
                    {selectedElement.style?.padding || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={selectedElement.style?.padding || 0}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Margin Bottom</span>
                  <span className="text-xs font-medium text-gray-900">
                    {selectedElement.style?.marginBottom || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="48"
                  value={selectedElement.style?.marginBottom || 0}
                  onChange={(e) => handleStyleChange('marginBottom', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
