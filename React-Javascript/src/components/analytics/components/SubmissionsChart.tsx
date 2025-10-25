import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface SubmissionsChartProps {
  data: Record<string, number>;
}

export const SubmissionsChart: React.FC<SubmissionsChartProps> = ({ data }) => {
  const dates = Object.keys(data).sort();
  const maxSubmissions = Math.max(...Object.values(data));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium mb-6">Submission Trends</h3>
      <div className="h-64 flex items-end space-x-2">
        {dates.map(date => {
          const submissions = data[date] || 0;
          const height = `${(submissions / maxSubmissions) * 100}%`;
          
          return (
            <div
              key={date}
              className="flex-1 flex flex-col items-center group"
            >
              <div className="relative w-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height }}
                  className="bg-blue-500 hover:bg-blue-600 rounded-t transition-colors"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    {submissions} submissions on {format(new Date(date), 'MMM d')}
                  </div>
                </motion.div>
              </div>
              <span className="text-xs text-gray-500 mt-2">
                {format(new Date(date), 'MM/dd')}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};