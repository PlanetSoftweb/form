import React from 'react';
import { motion } from 'framer-motion';
import { FormElement } from '../../../store/formStore';

interface ResponseDistributionProps {
  elements: FormElement[];
  distribution: Record<string, Record<string, number>>;
}

export const ResponseDistribution: React.FC<ResponseDistributionProps> = ({
  elements,
  distribution
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Response Distribution</h3>
      <div className="space-y-6">
        {elements.map(element => {
          if (!['select', 'radio', 'checkbox'].includes(element.type)) return null;
          
          const data = distribution[element.id];
          if (!data) return null;

          const total = Object.values(data).reduce((a, b) => a + b, 0);

          return (
            <div key={element.id} className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-4">{element.label}</h3>
              <div className="space-y-2">
                {Object.entries(data).map(([option, count]) => {
                  const percentage = (count / total) * 100;
                  
                  return (
                    <div key={option} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option}</span>
                        <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          className="h-full bg-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};