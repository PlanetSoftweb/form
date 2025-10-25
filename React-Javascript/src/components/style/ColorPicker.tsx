import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Copy } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
  isActive,
  onToggle,
}) => {
  const copyColor = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
  };

  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      {isActive && (
        <div className="relative">
          <HexColorPicker color={color} onChange={onChange} className="w-full mb-2" />
          <div className="absolute inset-x-0 -bottom-6 flex justify-center">
            <div className="bg-white shadow-lg rounded-full px-2 py-1 text-xs text-gray-600">
              Click outside to close
            </div>
          </div>
        </div>
      )}
      <div
        onClick={onToggle}
        className="w-full h-9 rounded-md border flex items-center px-2 gap-2 hover:bg-gray-50 group relative cursor-pointer"
        style={{ backgroundColor: color }}
      >
        <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: color }} />
        <span className="text-xs font-mono">{color}</span>
        <div
          onClick={copyColor}
          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded cursor-pointer"
          title="Copy color code"
        >
          <Copy className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};