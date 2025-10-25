import React from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepProps } from './types';

export const Step4: React.FC<StepProps> = ({ formData, setFormData }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-xl font-medium text-gray-700 mb-3">
        Areas of Interest
      </label>
      <div className="grid grid-cols-2 gap-4">
        {[
          'Customer Feedback',
          'Employee Surveys',
          'Market Research',
          'Event Registration',
          'Lead Generation',
          'Education/Training'
        ].map((interest) => (
          <motion.button
            key={interest}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const interests = formData.interests.includes(interest)
                ? formData.interests.filter((i: string) => i !== interest)
                : [...formData.interests, interest];
              setFormData({ ...formData, interests });
            }}
            className={`p-4 text-left border rounded-xl transition-colors ${
              formData.interests.includes(interest)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <Target className={`h-6 w-6 mb-2 ${
              formData.interests.includes(interest) ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <span className="block font-medium">{interest}</span>
          </motion.button>
        ))}
      </div>
    </div>
  </div>
);