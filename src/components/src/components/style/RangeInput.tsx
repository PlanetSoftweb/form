import React from 'react';

interface RangeInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
  step?: number;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  unit = 'px',
  step = 1,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs text-gray-600">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 px-2 py-0.5 border rounded text-xs"
          />
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};