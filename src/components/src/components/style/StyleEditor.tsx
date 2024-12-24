import React, { useState } from 'react';
import { Palette, Box, Type, Layout, Brush } from 'lucide-react';
import { Section } from './Section';
import { ColorPicker } from './ColorPicker';
import { RangeInput } from './RangeInput';
import { PresetButton } from './PresetButton';
import type { FormStyle } from './types';

interface StyleEditorProps {
  style: FormStyle;
  onChange: (style: FormStyle) => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const fonts = [
    'Poppins, sans-serif',
    'Inter, sans-serif',
    'Arial, sans-serif',
    'Georgia, serif',
    'Verdana, sans-serif',
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
    { value: 'solid', preview: { borderStyle: 'solid', borderWidth: 2, borderColor: '#000' } },
    { value: 'dashed', preview: { borderStyle: 'dashed', borderWidth: 2, borderColor: '#000' } },
    { value: 'dotted', preview: { borderStyle: 'dotted', borderWidth: 2, borderColor: '#000' } },
    { value: 'double', preview: { borderStyle: 'double', borderWidth: 3, borderColor: '#000' } },
  ];

  const shadowPresets = [
    { label: 'None', value: 'none' },
    { label: 'Subtle', value: '0 2px 4px rgba(0,0,0,0.1)' },
    { label: 'Medium', value: '0 4px 8px rgba(0,0,0,0.12)' },
    { label: 'Large', value: '0 8px 16px rgba(0,0,0,0.15)' },
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

  return (
    <div className="p-6 space-y-6 max-h-screen overflow-y-auto">
      <Section icon={<Palette className="h-4 w-4" />} title="Colors">
        <div className="space-y-3">
          <ColorPicker
            color={style.backgroundColor}
            onChange={(color) => handleChange('backgroundColor', color)}
            label="Background"
            isActive={activeColorPicker === 'background'}
            onToggle={() => setActiveColorPicker(activeColorPicker === 'background' ? null : 'background')}
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
          <div className="grid grid-cols-2 gap-3">
            <RangeInput
              value={parseInt(style.borderWidth || '0')}
              onChange={(value) => handleChange('borderWidth', `${value}px`)}
              min={0}
              max={10}
              label="Width"
            />
            <div>
              <label className="block text-xs text-gray-600 mb-1">Style</label>
              <div className="grid grid-cols-2 gap-2">
                {borderStyles.map((borderStyle) => (
                  <PresetButton
                    key={borderStyle.value}
                    label={borderStyle.value}
                    value={borderStyle.value}
                    isSelected={style.borderStyle === borderStyle.value}
                    onClick={() => handleChange('borderStyle', borderStyle.value)}
                    preview={borderStyle.preview}
                  />
                ))}
              </div>
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
            max={24}
            label="Corner Radius"
          />

          <div>
            <label className="block text-xs text-gray-600 mb-1">Shadow</label>
            <div className="grid grid-cols-2 gap-2">
              {shadowPresets.map((preset) => (
                <PresetButton
                  key={preset.value}
                  label={preset.label}
                  value={preset.value}
                  isSelected={style.boxShadow === preset.value}
                  onClick={() => handleChange('boxShadow', preset.value)}
                  preview={{ boxShadow: preset.value }}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section icon={<Type className="h-4 w-4" />} title="Typography">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Font Family</label>
          <select
            value={style.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-1.5 border rounded-md text-sm"
          >
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font.split(',')[0] }}>
                {font.split(',')[0]}
              </option>
            ))}
          </select>
        </div>
      </Section>

      <Section icon={<Brush className="h-4 w-4" />} title="Background Effects">
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={style.backgroundGradient?.enabled}
              onChange={(e) => handleGradientChange('enabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-xs">Use Gradient Background</span>
          </label>

          {style.backgroundGradient?.enabled && (
            <div className="space-y-3">
              <ColorPicker
                color={style.backgroundGradient.startColor}
                onChange={(color) => handleGradientChange('startColor', color)}
                label="Gradient Start"
                isActive={activeColorPicker === 'gradientStart'}
                onToggle={() => setActiveColorPicker(activeColorPicker === 'gradientStart' ? null : 'gradientStart')}
              />
              <ColorPicker
                color={style.backgroundGradient.endColor}
                onChange={(color) => handleGradientChange('endColor', color)}
                label="Gradient End"
                isActive={activeColorPicker === 'gradientEnd'}
                onToggle={() => setActiveColorPicker(activeColorPicker === 'gradientEnd' ? null : 'gradientEnd')}
              />
              <div>
                <label className="block text-xs text-gray-600 mb-1">Direction</label>
                <div className="grid grid-cols-3 gap-2">
                  {gradientDirections.map((direction) => (
                    <button
                      key={direction.value}
                      onClick={() => handleGradientChange('direction', direction.value)}
                      className={`p-2 text-center rounded-md border text-sm ${
                        style.backgroundGradient?.direction === direction.value
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
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
  );
};