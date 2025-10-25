import React, { useState } from 'react';
import { 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  GripVertical 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayersPanelProps {
  elements: any[];
  selectedElement: any;
  onSelectElement: (element: any) => void;
  onToggleVisibility?: (id: string) => void;
  onToggleLock?: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getElementIcon = (type: string) => {
    const icons: Record<string, string> = {
      text: '📝',
      textarea: '📄',
      email: '📧',
      phone: '📞',
      number: '#️⃣',
      date: '📅',
      time: '⏰',
      radio: '⭕',
      checkbox: '☑️',
      select: '📋',
      rating: '⭐',
      file: '📎',
      heading: '🔤',
      paragraph: '¶',
      divider: '➖',
    };
    return icons[type] || '📦';
  };

  return (
    <div className="bg-white border-l h-full flex flex-col w-72">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Layers</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {elements.length}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-y-auto"
          >
            {elements.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Layers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No layers yet</p>
                <p className="text-xs mt-1">Add elements to see them here</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {elements.map((element, index) => (
                  <motion.div
                    key={element.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => onSelectElement(element)}
                    className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      selectedElement?.id === element.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg">{getElementIcon(element.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {element.label}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{element.type}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onToggleVisibility && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility(element.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title={element.visible === false ? 'Show' : 'Hide'}
                        >
                          {element.visible === false ? (
                            <EyeOff className="h-3 w-3 text-gray-500" />
                          ) : (
                            <Eye className="h-3 w-3 text-gray-500" />
                          )}
                        </button>
                      )}
                      {onToggleLock && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLock(element.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title={element.locked ? 'Unlock' : 'Lock'}
                        >
                          {element.locked ? (
                            <Lock className="h-3 w-3 text-gray-500" />
                          ) : (
                            <Unlock className="h-3 w-3 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
