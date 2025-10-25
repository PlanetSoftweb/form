import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SubmissionsView } from '../SubmissionsView';
import type { FormElement } from '../../store/types/form';

interface SubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formId: string;
  elements: FormElement[];
}

export const SubmissionsModal: React.FC<SubmissionsModalProps> = ({
  isOpen,
  onClose,
  formId,
  elements
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 bg-gray-100 overflow-auto"
          >
            <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h2 className="text-xl font-semibold">Form Submissions</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6 py-8">
              <SubmissionsView formId={formId} elements={elements} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};