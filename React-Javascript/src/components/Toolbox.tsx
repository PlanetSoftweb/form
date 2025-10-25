import React from 'react';
import { FormElement } from '../store/formStore';
import { 
  Type, 
  Hash, 
  Mail, 
  AlignLeft, 
  List, 
  Image, 
  Heading2, 
  Text, 
  Minus,
  Calendar,
  Clock,
  Phone,
  FileText,
  Star,
  CheckSquare,
  Circle,
  Grid
} from 'lucide-react';

interface ToolboxProps {
  onAddElement: (element: Omit<FormElement, 'id'>) => void;
}

export const Toolbox = ({ onAddElement }: ToolboxProps) => {
  const elements: Omit<FormElement, 'id'>[] = [
    { 
      type: 'text', 
      label: 'Short Answer', 
      required: false,
      placeholder: 'Enter your answer',
      validation: {
        minLength: 0,
        maxLength: 255
      }
    },
    { 
      type: 'textarea', 
      label: 'Long Answer', 
      required: false,
      placeholder: 'Enter your detailed response',
      validation: {
        minLength: 0,
        maxLength: 1000
      }
    },
    {
      type: 'radio',
      label: 'Multiple Choice',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      style: { columns: 1 }
    },
    {
      type: 'checkbox',
      label: 'Checkboxes',
      required: false,
      options: ['Option 1', 'Option 2', 'Option 3'],
      style: { columns: 1 }
    },
    {
      type: 'select',
      label: 'Dropdown',
      required: false,
      options: ['Select an option', 'Option 1', 'Option 2', 'Option 3']
    },
    {
      type: 'date',
      label: 'Date',
      required: false,
      validation: {
        min: '',
        max: ''
      }
    },
    {
      type: 'time',
      label: 'Time',
      required: false
    },
    {
      type: 'phone',
      label: 'Phone Number',
      required: false,
      validation: {
        pattern: '^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$'
      }
    },
    {
      type: 'email',
      label: 'Email',
      required: false,
      validation: {
        pattern: '^[^\s@]+@[^\s@]+\.[^\s@]+$'
      }
    },
    {
      type: 'number',
      label: 'Number',
      required: false,
      validation: {
        min: 0,
        max: 100
      }
    },
    {
      type: 'file',
      label: 'File Upload',
      required: false,
      validation: {
        acceptedFiles: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      }
    },
    {
      type: 'rating',
      label: 'Rating',
      required: false,
      options: ['1', '2', '3', '4', '5'],
      style: { columns: 5 }
    },
    { 
      type: 'heading', 
      label: 'Section Heading', 
      required: false,
      style: { fontSize: '24px', textAlign: 'left' }
    },
    { 
      type: 'paragraph', 
      label: 'Description Text', 
      required: false,
      style: { fontSize: '16px', textAlign: 'left' }
    },
    {
      type: 'image',
      label: 'Image',
      required: false,
      style: { width: '100%', imageUrl: '' }
    },
    {
      type: 'divider',
      label: 'Section Divider',
      required: false
    }
  ];

  const elements_by_category = {
    'Basic Fields': ['text', 'textarea', 'number', 'email', 'phone'],
    'Choice Fields': ['radio', 'checkbox', 'select', 'rating'],
    'Date & Time': ['date', 'time'],
    'Advanced Fields': ['file'],
    'Layout Elements': ['heading', 'paragraph', 'image', 'divider']
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type size={20} />;
      case 'textarea':
        return <AlignLeft size={20} />;
      case 'number':
        return <Hash size={20} />;
      case 'email':
        return <Mail size={20} />;
      case 'phone':
        return <Phone size={20} />;
      case 'radio':
        return <Circle size={20} />;
      case 'checkbox':
        return <CheckSquare size={20} />;
      case 'select':
        return <List size={20} />;
      case 'date':
        return <Calendar size={20} />;
      case 'time':
        return <Clock size={20} />;
      case 'file':
        return <FileText size={20} />;
      case 'rating':
        return <Star size={20} />;
      case 'heading':
        return <Heading2 size={20} />;
      case 'paragraph':
        return <Text size={20} />;
      case 'image':
        return <Image size={20} />;
      case 'divider':
        return <Minus size={20} />;
      default:
        return <Grid size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Form Elements</h2>
      <div className="space-y-4">
        {Object.entries(elements_by_category).map(([category, types]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="space-y-1">
              {elements
                .filter(element => types.includes(element.type))
                .map((element) => (
                  <button
                    key={element.type}
                    onClick={() => onAddElement(element)}
                    className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-500">{getIcon(element.type)}</span>
                    <span>{element.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};