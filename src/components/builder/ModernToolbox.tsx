import React, { useState } from 'react';
import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Calendar,
  Clock,
  Circle,
  CheckSquare,
  List,
  Star,
  Upload,
  Heading,
  FileText,
  Minus,
  Search,
  Grid,
  Layers,
  Sparkles,
  Palette,
  Sliders,
  Link2,
  Image,
  CalendarDays,
  ToggleLeft,
  Tags,
  FileStack,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ModernToolboxProps {
  onAddElement: (element: any) => void;
  isDarkMode?: boolean;
}

export const ModernToolbox: React.FC<ModernToolboxProps> = ({ onAddElement, isDarkMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: Grid, color: 'blue' },
    { id: 'basic', label: 'Input', icon: Type, color: 'purple' },
    { id: 'choice', label: 'Choice', icon: Circle, color: 'pink' },
    { id: 'layout', label: 'Layout', icon: Layers, color: 'emerald' },
  ];

  const elements = [
    { type: 'text', label: 'Short Text', icon: Type, category: 'basic', placeholder: 'Enter text...', description: 'Single line text input' },
    { type: 'textarea', label: 'Long Text', icon: AlignLeft, category: 'basic', placeholder: 'Enter detailed text...', description: 'Multi-line text area' },
    { type: 'email', label: 'Email', icon: Mail, category: 'basic', placeholder: 'email@example.com', description: 'Email address input' },
    { type: 'phone', label: 'Phone', icon: Phone, category: 'basic', placeholder: '+1 (555) 000-0000', description: 'Phone number input' },
    { type: 'number', label: 'Number', icon: Hash, category: 'basic', placeholder: '0', description: 'Numeric input' },
    { type: 'url', label: 'Website URL', icon: Link2, category: 'basic', placeholder: 'https://example.com', description: 'Website URL input' },
    { type: 'date', label: 'Date', icon: Calendar, category: 'basic', description: 'Date picker' },
    { type: 'datetime', label: 'Date & Time', icon: CalendarDays, category: 'basic', description: 'Date and time picker' },
    { type: 'time', label: 'Time', icon: Clock, category: 'basic', description: 'Time picker' },
    { type: 'color', label: 'Color Picker', icon: Palette, category: 'basic', description: 'Color selection input' },
    { type: 'range', label: 'Slider', icon: Sliders, category: 'basic', description: 'Range slider input' },
    { type: 'tags', label: 'Tags Input', icon: Tags, category: 'basic', description: 'Multiple tags input', placeholder: 'Add tags...' },
    { type: 'radio', label: 'Multiple Choice', icon: Circle, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'], description: 'Single selection radio' },
    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'], description: 'Multiple selection boxes' },
    { type: 'select', label: 'Dropdown', icon: List, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'], description: 'Dropdown select menu' },
    { type: 'toggle', label: 'Toggle Switch', icon: ToggleLeft, category: 'choice', description: 'Yes/No toggle switch' },
    { type: 'rating', label: 'Star Rating', icon: Star, category: 'choice', description: 'Star rating input', options: ['1', '2', '3', '4', '5'] },
    { type: 'file', label: 'File Upload', icon: Upload, category: 'basic', description: 'File attachment' },
    { type: 'heading', label: 'Heading', icon: Heading, category: 'layout', content: 'Section Heading', description: 'Section title' },
    { type: 'paragraph', label: 'Paragraph', icon: FileText, category: 'layout', content: 'Add descriptive text here...', description: 'Text content block' },
    { type: 'image', label: 'Image', icon: Image, category: 'layout', description: 'Add an image' },
    { type: 'divider', label: 'Divider', icon: Minus, category: 'layout', description: 'Horizontal separator' },
    { type: 'pagebreak', label: 'Page Break', icon: FileStack, category: 'layout', description: 'Split into pages' },
    { type: 'thankyou', label: 'Thank You Page', icon: ThumbsUp, category: 'layout', content: 'Thank you for your submission!', description: 'Final thank you message' },
  ];

  const filteredElements = elements.filter((element) => {
    const matchesSearch = element.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || element.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = (element: any) => {
    const newElement: any = {
      type: element.type,
      label: element.type === 'heading' ? element.content : element.label,
      required: false,
    };

    if (element.placeholder) newElement.placeholder = element.placeholder;
    if (element.options) newElement.options = element.options;
    if (element.content && element.type !== 'heading') newElement.content = element.content;

    onAddElement(newElement);
  };

  const handleDragStart = (e: React.DragEvent, element: any) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/json', JSON.stringify(element));
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white border-r'}`}>
      {/* Header */}
      <div className={`p-3 border-b ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Elements</h2>
            <p className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drag or click to add</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                : 'bg-gray-50 border-gray-200 text-gray-900'
            }`}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-1 mt-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-3 w-3" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-1.5">
          {filteredElements.map((element) => (
            <motion.div
              key={element.type}
              draggable
              onDragStart={(e) => handleDragStart(e as any, element)}
              onClick={() => handleAdd(element)}
              onMouseEnter={() => setHoveredElement(element.type)}
              onMouseLeave={() => setHoveredElement(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all border ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-blue-500'
                  : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <element.icon className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className={`text-[10px] font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {element.label}
                </span>
                {hoveredElement === element.type && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`text-[9px] mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    {element.description}
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredElements.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No elements found</p>
          </div>
        )}
      </div>
    </div>
  );
};
