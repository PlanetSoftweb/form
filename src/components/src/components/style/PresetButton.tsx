import React from 'react';

interface PresetButtonProps {
  label: string;
  value: string;
  isSelected: boolean;
  onClick: () => void;
  preview?: React.CSSProperties;
}

export const PresetButton: React.FC<PresetButtonProps> = ({
  label,
  value,
  isSelected,
  onClick,
  preview,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-left text-xs rounded-md transition-all ${
        isSelected
          ? 'bg-blue-50 text-blue-700 border-blue-200'
          : 'hover:bg-gray-50 text-gray-700 border-gray-200'
      } border relative group`}
      style={preview}
    >
      {label}
      {preview && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:block">
          <div className="bg-white shadow-lg rounded-lg p-3" style={preview}>
            Preview
          </div>
        </div>
      )}
    </button>
  );
};