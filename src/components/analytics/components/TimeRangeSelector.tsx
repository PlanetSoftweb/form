import React from 'react';

interface TimeRangeSelectorProps {
  selectedRange: 'week' | 'month' | 'year';
  onChange: (range: 'week' | 'month' | 'year') => void;
}

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  selectedRange,
  onChange
}) => {
  return (
    <div className="flex justify-end space-x-2">
      {(['week', 'month', 'year'] as const).map(range => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedRange === range
              ? 'bg-blue-100 text-blue-700'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Last {range}
        </button>
      ))}
    </div>
  );
};