import React from 'react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
  Move
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AlignmentToolsProps {
  selectedElements: any[];
  onAlign: (type: string) => void;
}

export const AlignmentTools: React.FC<AlignmentToolsProps> = ({
  selectedElements,
  onAlign,
}) => {
  const tools = [
    { id: 'left', icon: AlignLeft, label: 'Align Left' },
    { id: 'center', icon: AlignCenter, label: 'Align Center' },
    { id: 'right', icon: AlignRight, label: 'Align Right' },
    { id: 'distribute-h', icon: AlignHorizontalSpaceBetween, label: 'Distribute Horizontally' },
    { id: 'distribute-v', icon: AlignVerticalSpaceBetween, label: 'Distribute Vertically' },
  ];

  if (selectedElements.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className="absolute top-20 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 flex items-center gap-1">
        <div className="flex items-center gap-1 px-2 text-xs text-gray-500 border-r border-gray-200 pr-3">
          <Move className="h-3 w-3" />
          {selectedElements.length} selected
        </div>
        
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => onAlign(tool.id)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              title={tool.label}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
