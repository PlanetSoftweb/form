import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = 'Select an option',
  disabled = false,
  value,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');

  const handleSelect = (option: string) => {
    setSelectedValue(option);
    setIsOpen(false);
    onChange?.(option);
  };

  return (
    <div className="relative w-full">
      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-left bg-white border-2 rounded-xl transition-all duration-200 flex items-center justify-between ${
          disabled
            ? 'bg-gray-50 cursor-not-allowed opacity-60'
            : isOpen
            ? 'border-blue-500 ring-2 ring-blue-100 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
      >
        <span className={selectedValue ? 'text-gray-900' : 'text-gray-400'}>
          {selectedValue || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Options List */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto py-1">
                {options.map((option, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(option)}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className={`w-full px-4 py-2.5 text-left transition-colors flex items-center justify-between ${
                      selectedValue === option
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <span>{option}</span>
                    {selectedValue === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="h-4 w-4 text-blue-600" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
                
                {options.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400 text-sm">
                    No options available
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
