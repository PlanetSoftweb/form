import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface SubmissionTagProps {
  type: 'spam' | 'valid';
  confidence: number;
  reasons?: string[];
}

export const SubmissionTag: React.FC<SubmissionTagProps> = ({ type, confidence, reasons }) => {
  const variants = {
    spam: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      hover: 'hover:bg-red-200',
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />
    },
    valid: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      hover: 'hover:bg-green-200',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    }
  };

  const style = variants[type];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${style.hover} group relative cursor-help`}
    >
      {style.icon}
      <span className="ml-1.5">
        {type === 'spam' ? 'Potential Spam' : 'Valid'}
        {confidence && ` (${Math.round(confidence * 100)}%)`}
      </span>

      {type === 'spam' && reasons && reasons.length > 0 && (
        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-red-600 mb-2">Spam Indicators:</p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};