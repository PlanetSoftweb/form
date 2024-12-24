import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepProps } from './types';

export const Step3: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-xl font-medium text-gray-700 mb-3">
        Industry
      </label>
      <div className="grid grid-cols-2 gap-4">
        {[
          'Technology',
          'Healthcare',
          'Education',
          'Finance',
          'Manufacturing',
          'Retail',
          'Other'
        ].map((industry) => (
          <motion.button
            key={industry}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFormData({ ...formData, industry })}
            className={`p-4 text-left border rounded-xl transition-colors ${
              formData.industry === industry
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Briefcase className={`h-6 w-6 mb-2 ${
              formData.industry === industry ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <span className="block font-medium">{industry}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);