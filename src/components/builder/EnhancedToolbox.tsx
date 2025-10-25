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
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolboxProps {
  onAddElement: (element: any) => void;
}

export const EnhancedToolbox: React.FC<ToolboxProps> = ({ onAddElement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Fields', icon: Grid },
    { id: 'basic', label: 'Basic', icon: Type },
    { id: 'choice', label: 'Choice', icon: Circle },
    { id: 'layout', label: 'Layout', icon: Layers },
  ];

  const elements = [
    { type: 'text', label: 'Short Text', icon: Type, category: 'basic', placeholder: 'Enter text...' },
    { type: 'textarea', label: 'Long Text', icon: AlignLeft, category: 'basic', placeholder: 'Enter detailed text...' },
    { type: 'email', label: 'Email', icon: Mail, category: 'basic', placeholder: 'email@example.com' },
    { type: 'phone', label: 'Phone', icon: Phone, category: 'basic', placeholder: '+1 (555) 000-0000' },
    { type: 'number', label: 'Number', icon: Hash, category: 'basic', placeholder: '0' },
    { type: 'date', label: 'Date', icon: Calendar, category: 'basic' },
    { type: 'time', label: 'Time', icon: Clock, category: 'basic' },
    { type: 'radio', label: 'Multiple Choice', icon: Circle, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'select', label: 'Dropdown', icon: List, category: 'choice', options: ['Option 1', 'Option 2', 'Option 3'] },
    { type: 'rating', label: 'Rating', icon: Star, category: 'choice' },
    { type: 'file', label: 'File Upload', icon: Upload, category: 'basic' },
    { type: 'heading', label: 'Heading', icon: Heading, category: 'layout', content: 'Section Heading' },
    { type: 'paragraph', label: 'Paragraph', icon: FileText, category: 'layout', content: 'Add descriptive text here...' },
    { type: 'divider', label: 'Divider', icon: Minus, category: 'layout' },
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

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Form Elements</h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredElements.map((element, index) => {
          const Icon = element.icon;
          return (
            <motion.button
              key={element.type + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleAdd(element)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{element.label}</p>
                <p className="text-xs text-gray-500 capitalize">{element.type}</p>
              </div>
              <div className="text-2xl text-gray-300 group-hover:text-blue-600 transition-colors">
                +
              </div>
            </motion.button>
          );
        })}

        {filteredElements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No elements found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};
