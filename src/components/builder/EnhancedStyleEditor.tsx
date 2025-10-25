import React, { useState } from 'react';
import { 
  Palette, 
  Box, 
  Type, 
  Layout, 
  Brush, 
  Sparkles,
  Copy,
  Download,
  Upload,
  X,
  Check
} from 'lucide-react';
import { Section } from '../style/Section';
import { ColorPicker } from '../style/ColorPicker';
import { RangeInput } from '../style/RangeInput';
import { PresetButton } from '../style/PresetButton';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FormStyle {
  backgroundColor: string;
  backgroundGradient?: {
    enabled: boolean;
    startColor: string;
    endColor: string;
    direction: string;
  };
  textColor: string;
  buttonColor: string;
  borderRadius: string;
  borderWidth: string;
  borderColor: string;
  borderStyle: string;
  boxShadow: string;
  fontFamily: string;
}

interface StyleEditorProps {
  style: FormStyle;
  onChange: (style: FormStyle) => void;
}

const themePresets = [
  {
    name: 'Professional',
    colors: { primary: '#2563eb', bg: '#ffffff', text: '#1f2937' },
    style: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      buttonColor: '#2563eb',
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: 'Inter, sans-serif',
    },
  },
  {
    name: 'Modern',
    colors: { primary: '#8b5cf6', bg: '#f9fafb', text: '#111827' },
    style: {
      backgroundColor: '#f9fafb',
      textColor: '#111827',
      buttonColor: '#8b5cf6',
      borderRadius: '12px',
      borderWidth: '0px',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
      fontFamily: 'Inter, sans-serif',
    },
  },
  {
    name: 'Minimal',
    colors: { primary: '#000000', bg: '#ffffff', text: '#374151' },
    style: {
      backgroundColor: '#ffffff',
      textColor: '#374151',
      buttonColor: '#000000',
      borderRadius: '4px',
      borderWidth: '1px',
      borderColor: '#d1d5db',
      borderStyle: 'solid',
      boxShadow: 'none',
      fontFamily: 'system-ui, sans-serif',
    },
  },
  {
    name: 'Vibrant',
    colors: { primary: '#f59e0b', bg: '#fef3c7', text: '#92400e' },
    style: {
      backgroundColor: '#fef3c7',
      textColor: '#92400e',
      buttonColor: '#f59e0b',
      borderRadius: '16px',
      borderWidth: '2px',
      borderColor: '#fbbf24',
      borderStyle: 'solid',
      boxShadow: '0 8px 16px rgba(245,158,11,0.2)',
      fontFamily: 'Poppins, sans-serif',
    },
  },
  {
    name: 'Dark',
    colors: { primary: '#3b82f6', bg: '#1f2937', text: '#f9fafb' },
    style: {
      backgroundColor: '#1f2937',
      textColor: '#f9fafb',
      buttonColor: '#3b82f6',
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#374151',
      borderStyle: 'solid',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      fontFamily: 'Inter, sans-serif',
    },
  },
  {
    name: 'Elegant',
    colors: { primary: '#9333ea', bg: '#faf5ff', text: '#581c87' },
    style: {
      backgroundColor: '#faf5ff',
      textColor: '#581c87',
      buttonColor: '#9333ea',
      borderRadius: '8px',
      borderWidth: '1px',
      borderColor: '#e9d5ff',
      borderStyle: 'solid',
      boxShadow: '0 2px 4px rgba(147,51,234,0.1)',
      fontFamily: 'Georgia, serif',
    },
  },
];

export const EnhancedStyleEditor = ({ style, onChange }: StyleEditorProps) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('presets');

  const fonts = [
    'Inter, sans-serif',
    'Poppins, sans-serif',
    'Roboto, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Times New Roman, serif',
    'Verdana, sans-serif',
    'Courier New, monospace',
  ];

  const gradientDirections = [
    { value: 'to right', label: '→', title: 'Left to Right' },
    { value: 'to left', label: '←', title: 'Right to Left' },
    { value: 'to bottom', label: '↓', title: 'Top to Bottom' },
    { value: 'to top', label: '↑', title: 'Bottom to Top' },
    { value: '45deg', label: '↘', title: 'Diagonal Down' },
    { value: '-45deg', label: '↙', title: 'Diagonal Up' },
  ];

  const borderStyles = [
    { value: 'solid', label: 'Solid' },
    { value: 'dashed', label: 'Dashed' },
    { value: 'dotted', label: 'Dotted' },
    { value: 'double', label: 'Double' },
  ];

  const shadowPresets = [
    { label: 'None', value: 'none' },
    { label: 'Subtle', value: '0 2px 4px rgba(0,0,0,0.1)' },
    { label: 'Medium', value: '0 4px 8px rgba(0,0,0,0.12)' },
    { label: 'Large', value: '0 8px 16px rgba(0,0,0,0.15)' },
    { label: 'XL', value: '0 16px 32px rgba(0,0,0,0.2)' },
  ];

  const handleChange = (key: keyof FormStyle, value: any) => {
    onChange({ ...style, [key]: value });
  };

  const handleGradientChange = (key: string, value: any) => {
    const updatedGradient = {
      ...(style.backgroundGradient || {
        enabled: false,
        startColor: '#ffffff',
        endColor: '#f0f0f0',
        direction: 'to right',
      }),
      [key]: value,
    };
    handleChange('backgroundGradient', updatedGradient);
  };

  const applyTheme = (theme: typeof themePresets[0]) => {
    onChange({ ...theme.style });
    toast.success(`Applied ${theme.name} theme`);
  };

  const copyStyle = () => {
    navigator.clipboard.writeText(JSON.stringify(style, null, 2));
    toast.success('Style copied to clipboard');
  };

  const exportStyle = () => {
    const blob = new Blob([JSON.stringify(style, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-style.json';
    a.click();
    toast.success('Style exported');
  };

  const importStyle = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          onChange(imported);
          toast.success('Style imported successfully');
        } catch (error) {
          toast.error('Invalid style file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Style Settings</h2>
          <div className="flex gap-1">
            <button
              onClick={copyStyle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy Style"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={exportStyle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Style"
            >
              <Download className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={importStyle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Import Style"
            >
              <Upload className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Themes
            </div>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Custom
            </div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'presets' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Choose a pre-designed theme to quickly style your form
            </p>
            {themePresets.map((theme, index) => (
              <motion.button
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => applyTheme(theme)}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex gap-1">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.bg }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: theme.colors.text }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{theme.name}</p>
                    <p className="text-xs text-gray-500">Click to apply</p>
                  </div>
                  <Check className="h-5 w-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Section icon={<Palette className="h-4 w-4" />} title="Colors">
              <div className="space-y-3">
                <ColorPicker
                  color={style.backgroundColor}
                  onChange={(color) => handleChange('backgroundColor', color)}
                  label="Background"
                  isActive={activeColorPicker === 'background'}
                  onToggle={() =>
                    setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')
                  }
                />
                <ColorPicker
                  color={style.textColor}
                  onChange={(color) => handleChange('textColor', color)}
                  label="Text"
                  isActive={activeColorPicker === 'text'}
                  onToggle={() => setActiveColorPicker(activeColorPicker === 'text' ? null : 'text')}
                />
                <ColorPicker
                  color={style.buttonColor}
                  onChange={(color) => handleChange('buttonColor', color)}
                  label="Button"
                  isActive={activeColorPicker === 'button'}
                  onToggle={() => setActiveColorPicker(activeColorPicker === 'button' ? null : 'button')}
                />
              </div>
            </Section>

            <Section icon={<Box className="h-4 w-4" />} title="Border">
              <div className="space-y-4">
                <RangeInput
                  value={parseInt(style.borderWidth || '0')}
                  onChange={(value) => handleChange('borderWidth', `${value}px`)}
                  min={0}
                  max={10}
                  label="Width"
                />
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {borderStyles.map((borderStyle) => (
                      <button
                        key={borderStyle.value}
                        onClick={() => handleChange('borderStyle', borderStyle.value)}
                        className={`px-3 py-2 text-sm rounded-lg border-2 transition-colors ${
                          style.borderStyle === borderStyle.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {borderStyle.label}
                      </button>
                    ))}
                  </div>
                </div>
                <ColorPicker
                  color={style.borderColor}
                  onChange={(color) => handleChange('borderColor', color)}
                  label="Color"
                  isActive={activeColorPicker === 'border'}
                  onToggle={() => setActiveColorPicker(activeColorPicker === 'border' ? null : 'border')}
                />
              </div>
            </Section>

            <Section icon={<Layout className="h-4 w-4" />} title="Layout">
              <div className="space-y-4">
                <RangeInput
                  value={parseInt(style.borderRadius)}
                  onChange={(value) => handleChange('borderRadius', `${value}px`)}
                  min={0}
                  max={32}
                  label="Corner Radius"
                />
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Shadow</label>
                  <div className="grid grid-cols-2 gap-2">
                    {shadowPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => handleChange('boxShadow', preset.value)}
                        className={`px-3 py-2 text-xs rounded-lg border-2 transition-all ${
                          style.boxShadow === preset.value
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ boxShadow: preset.value }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section icon={<Type className="h-4 w-4" />} title="Typography">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Font Family</label>
                <select
                  value={style.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {fonts.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font.split(',')[0] }}>
                      {font.split(',')[0]}
                    </option>
                  ))}
                </select>
              </div>
            </Section>

            <Section icon={<Brush className="h-4 w-4" />} title="Gradient Background">
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={style.backgroundGradient?.enabled}
                    onChange={(e) => handleGradientChange('enabled', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Enable Gradient</span>
                </label>

                {style.backgroundGradient?.enabled && (
                  <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                    <ColorPicker
                      color={style.backgroundGradient.startColor}
                      onChange={(color) => handleGradientChange('startColor', color)}
                      label="Start Color"
                      isActive={activeColorPicker === 'gradientStart'}
                      onToggle={() =>
                        setActiveColorPicker(
                          activeColorPicker === 'gradientStart' ? null : 'gradientStart'
                        )
                      }
                    />
                    <ColorPicker
                      color={style.backgroundGradient.endColor}
                      onChange={(color) => handleGradientChange('endColor', color)}
                      label="End Color"
                      isActive={activeColorPicker === 'gradientEnd'}
                      onToggle={() =>
                        setActiveColorPicker(activeColorPicker === 'gradientEnd' ? null : 'gradientEnd')
                      }
                    />
                    <div>
                      <label className="block text-xs text-gray-600 mb-2">Direction</label>
                      <div className="grid grid-cols-3 gap-2">
                        {gradientDirections.map((direction) => (
                          <button
                            key={direction.value}
                            onClick={() => handleGradientChange('direction', direction.value)}
                            className={`p-3 text-center rounded-lg border-2 text-lg transition-colors ${
                              style.backgroundGradient?.direction === direction.value
                                ? 'bg-blue-50 text-blue-700 border-blue-500'
                                : 'hover:bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                            title={direction.title}
                          >
                            {direction.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  );
};
