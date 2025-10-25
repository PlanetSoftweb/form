import React from 'react';
import { X, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement: any;
  onUpdate: (id: string, updates: any) => void;
  onClose: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onUpdate,
  onClose,
}) => {
  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-6 text-center">
        <Settings className="h-12 w-12 text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">No Element Selected</p>
        <p className="text-sm text-gray-400 mt-1">
          Click on a form element to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    onUpdate(selectedElement.id, { [field]: value });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Properties</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Element Type
          </label>
          <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600 capitalize">
            {selectedElement.type}
          </div>
        </div>

        {selectedElement.type !== 'divider' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              type="text"
              value={selectedElement.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {['text', 'textarea', 'email', 'phone', 'number'].includes(selectedElement.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placeholder
            </label>
            <input
              type="text"
              value={selectedElement.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {selectedElement.type === 'paragraph' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={selectedElement.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        )}

        {!['heading', 'paragraph', 'divider'].includes(selectedElement.type) && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedElement.required || false}
                onChange={(e) => handleChange('required', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Required Field</span>
            </label>
          </div>
        )}

        {['radio', 'checkbox', 'select'].includes(selectedElement.type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {(selectedElement.options || []).map((option: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(selectedElement.options || [])];
                      newOptions[index] = e.target.value;
                      handleChange('options', newOptions);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const newOptions = (selectedElement.options || []).filter(
                        (_: any, i: number) => i !== index
                      );
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
                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {selectedElement.type === 'number' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Value
              </label>
              <input
                type="number"
                value={selectedElement.validation?.min || ''}
                onChange={(e) =>
                  handleChange('validation', {
                    ...selectedElement.validation,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Value
              </label>
              <input
                type="number"
                value={selectedElement.validation?.max || ''}
                onChange={(e) =>
                  handleChange('validation', {
                    ...selectedElement.validation,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
