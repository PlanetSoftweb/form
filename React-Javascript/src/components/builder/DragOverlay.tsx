import React from 'react';
import { motion } from 'framer-motion';

interface DragOverlayProps {
  element: any;
}

export const DragOverlay: React.FC<DragOverlayProps> = ({ element }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 0.9 }}
      className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-2xl cursor-grabbing"
      style={{
        backdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg">
          <div className="text-blue-600 font-bold">{element.type[0].toUpperCase()}</div>
        </div>
        <div>
          <p className="font-medium text-gray-900">{element.label}</p>
          <p className="text-xs text-gray-500 capitalize">{element.type}</p>
        </div>
      </div>
    </motion.div>
  );
};
