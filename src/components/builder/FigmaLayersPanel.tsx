import React, { useState } from 'react';
import { 
  Layers, 
  Eye, 
  Unlock,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Type,
  FileText,
  Mail,
  Phone,
  Hash,
  Calendar,
  Clock,
  Circle,
  CheckSquare,
  ChevronDown as SelectIcon,
  Star,
  Paperclip,
  Heading1,
  AlignLeft,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';

interface FigmaLayersPanelProps {
  elements: any[];
  selectedElement: any;
  onSelectElement: (element: any) => void;
  onReorderElements?: (elements: any[]) => void;
  isDarkMode?: boolean;
}

export const FigmaLayersPanel: React.FC<FigmaLayersPanelProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onReorderElements,
  isDarkMode = false,
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(elements.map(e => e.id)));
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getElementIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      text: <Type className="h-3.5 w-3.5" />,
      textarea: <FileText className="h-3.5 w-3.5" />,
      email: <Mail className="h-3.5 w-3.5" />,
      phone: <Phone className="h-3.5 w-3.5" />,
      number: <Hash className="h-3.5 w-3.5" />,
      date: <Calendar className="h-3.5 w-3.5" />,
      time: <Clock className="h-3.5 w-3.5" />,
      radio: <Circle className="h-3.5 w-3.5" />,
      checkbox: <CheckSquare className="h-3.5 w-3.5" />,
      select: <SelectIcon className="h-3.5 w-3.5" />,
      rating: <Star className="h-3.5 w-3.5" />,
      file: <Paperclip className="h-3.5 w-3.5" />,
      heading: <Heading1 className="h-3.5 w-3.5" />,
      paragraph: <AlignLeft className="h-3.5 w-3.5" />,
      divider: <Minus className="h-3.5 w-3.5" />,
    };
    return iconMap[type] || <Layers className="h-3.5 w-3.5" />;
  };

  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    setDraggedItem(elementId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId || !onReorderElements) return;

    const draggedIndex = elements.findIndex(el => el.id === draggedItem);
    const targetIndex = elements.findIndex(el => el.id === targetId);

    const newElements = [...elements];
    const [draggedElement] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, draggedElement);

    onReorderElements(newElements);
    setDraggedItem(null);
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedLayers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLayers(newExpanded);
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-l ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className={`px-3 py-2.5 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Layers className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Layers</h3>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            {elements.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {elements.length === 0 ? (
          <div className={`p-8 text-center ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            <Layers className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs">No layers</p>
            <p className="text-[10px] mt-1">Add elements to see them here</p>
          </div>
        ) : (
          <div className="p-1">
            {elements.map((element) => (
              <motion.div
                key={element.id}
                draggable
                onDragStart={(e) => handleDragStart(e as any, element.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e as any, element.id)}
                onClick={() => onSelectElement(element)}
                className={`group flex items-center gap-1 px-1.5 py-1 rounded mb-0.5 cursor-pointer transition-all ${
                  selectedElement?.id === element.id
                    ? isDarkMode
                      ? 'bg-blue-900/30 border border-blue-700'
                      : 'bg-blue-50 border border-blue-300'
                    : isDarkMode
                    ? 'hover:bg-gray-800 border border-transparent'
                    : 'hover:bg-gray-50 border border-transparent'
                } ${draggedItem === element.id ? 'opacity-50' : ''}`}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(element.id);
                  }}
                  className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {expandedLayers.has(element.id) ? (
                    <ChevronDown className={`h-2.5 w-2.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  ) : (
                    <ChevronRight className={`h-2.5 w-2.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  )}
                </button>

                <GripVertical className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                
                <div className={`flex items-center justify-center w-6 h-6 rounded ${
                  selectedElement?.id === element.id
                    ? isDarkMode 
                      ? 'bg-blue-800/50 text-blue-300' 
                      : 'bg-blue-100 text-blue-600'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-400'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {getElementIcon(element.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {element.label}
                  </p>
                  <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {element.type}
                  </p>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle visibility
                    }}
                    className={`p-0.5 rounded hover:bg-gray-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                    title="Toggle visibility"
                  >
                    <Eye className={`h-3 w-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle lock
                    }}
                    className={`p-0.5 rounded hover:bg-gray-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                    title="Toggle lock"
                  >
                    <Unlock className={`h-3 w-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
