import { useState } from 'react';
import { Palette, Type, Sparkles, Check, Layout, Sliders, Link as LinkIcon, X } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface FormStyle {
  backgroundColor: string;
  backgroundImage?: string;
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
  padding?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
}

interface StyleEditorProps {
  style: FormStyle;
  onChange: (style: FormStyle) => void;
}

const themePresets = [
  { name: 'Ocean Blue', primary: '#0ea5e9', bg: '#f0f9ff', text: '#0c4a6e', gradient: { start: '#0ea5e9', end: '#06b6d4', dir: 'to bottom' } },
  { name: 'Purple Dream', primary: '#a855f7', bg: '#faf5ff', text: '#581c87', gradient: { start: '#a855f7', end: '#ec4899', dir: '135deg' } },
  { name: 'Forest Green', primary: '#10b981', bg: '#f0fdf4', text: '#064e3b', gradient: { start: '#10b981', end: '#059669', dir: 'to bottom' } },
  { name: 'Sunset Orange', primary: '#f97316', bg: '#fff7ed', text: '#7c2d12', gradient: { start: '#fb923c', end: '#f97316', dir: '135deg' } },
  { name: 'Rose Pink', primary: '#ec4899', bg: '#fdf2f8', text: '#831843', gradient: { start: '#ec4899', end: '#f43f5e', dir: 'to bottom' } },
  { name: 'Sky Blue', primary: '#3b82f6', bg: '#eff6ff', text: '#1e3a8a', gradient: { start: '#60a5fa', end: '#3b82f6', dir: 'to bottom' } },
  { name: 'Emerald', primary: '#059669', bg: '#ecfdf5', text: '#064e3b', gradient: { start: '#34d399', end: '#10b981', dir: '135deg' } },
  { name: 'Amber Gold', primary: '#f59e0b', bg: '#fffbeb', text: '#78350f', gradient: { start: '#fbbf24', end: '#f59e0b', dir: 'to bottom' } },
  { name: 'Indigo Night', primary: '#6366f1', bg: '#eef2ff', text: '#312e81', gradient: { start: '#818cf8', end: '#6366f1', dir: '135deg' } },
  { name: 'Teal Fresh', primary: '#14b8a6', bg: '#f0fdfa', text: '#134e4a', gradient: { start: '#5eead4', end: '#14b8a6', dir: 'to bottom' } },
  { name: 'Crimson Red', primary: '#dc2626', bg: '#fef2f2', text: '#7f1d1d', gradient: { start: '#ef4444', end: '#dc2626', dir: '135deg' } },
  { name: 'Violet Luxury', primary: '#7c3aed', bg: '#f5f3ff', text: '#4c1d95', gradient: { start: '#a78bfa', end: '#7c3aed', dir: 'to bottom' } },
  { name: 'Lime Fresh', primary: '#84cc16', bg: '#f7fee7', text: '#365314', gradient: { start: '#a3e635', end: '#84cc16', dir: 'to bottom' } },
  { name: 'Fuchsia Pop', primary: '#d946ef', bg: '#fdf4ff', text: '#701a75', gradient: { start: '#e879f9', end: '#d946ef', dir: '135deg' } },
  { name: 'Cyan Cool', primary: '#06b6d4', bg: '#ecfeff', text: '#164e63', gradient: { start: '#22d3ee', end: '#06b6d4', dir: 'to bottom' } },
  { name: 'Slate Dark', primary: '#475569', bg: '#1e293b', text: '#f1f5f9', gradient: { start: '#64748b', end: '#475569', dir: '135deg' } },
  { name: 'Mint Green', primary: '#10b981', bg: '#f0fdf4', text: '#065f46', gradient: { start: '#6ee7b7', end: '#34d399', dir: 'to bottom' } },
  { name: 'Peach Soft', primary: '#fb923c', bg: '#fff7ed', text: '#9a3412', gradient: { start: '#fdba74', end: '#fb923c', dir: '135deg' } },
  { name: 'Navy Professional', primary: '#1e40af', bg: '#eff6ff', text: '#1e3a8a', gradient: { start: '#3b82f6', end: '#1e40af', dir: 'to bottom' } },
  { name: 'Cherry Blossom', primary: '#f472b6', bg: '#fdf2f8', text: '#9f1239', gradient: { start: '#f9a8d4', end: '#ec4899', dir: '135deg' } },
];

const fonts = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

const gradientDirections = [
  { value: 'to right', label: '→', name: 'Right' },
  { value: 'to left', label: '←', name: 'Left' },
  { value: 'to bottom', label: '↓', name: 'Down' },
  { value: 'to top', label: '↑', name: 'Up' },
  { value: '135deg', label: '↘', name: 'Diagonal' },
  { value: '45deg', label: '↗', name: 'Diagonal Up' },
];

export const StyleEditor = ({ style, onChange }: StyleEditorProps) => {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  const [showGradient, setShowGradient] = useState(style.backgroundGradient?.enabled || false);
  const [showImageBg, setShowImageBg] = useState(!!style.backgroundImage);
  const [expandedSection, setExpandedSection] = useState<string>('fill');
  const [imageUrl, setImageUrl] = useState(style.backgroundImage || '');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleChange = (key: keyof FormStyle, value: any) => {
    onChange({ ...style, [key]: value });
  };

  const handleGradientToggle = () => {
    const newEnabled = !showGradient;
    setShowGradient(newEnabled);
    setShowImageBg(false);
    onChange({
      ...style,
      backgroundImage: undefined,
      backgroundGradient: {
        enabled: newEnabled,
        startColor: style.backgroundGradient?.startColor || style.backgroundColor,
        endColor: style.backgroundGradient?.endColor || style.buttonColor,
        direction: style.backgroundGradient?.direction || 'to bottom',
      },
    });
  };

  const handleImageToggle = () => {
    const newEnabled = !showImageBg;
    setShowImageBg(newEnabled);
    setShowGradient(false);
    if (!newEnabled) {
      onChange({ ...style, backgroundImage: undefined });
    }
  };

  const handleImageUrl = (url: string) => {
    setImageUrl(url);
    onChange({ 
      ...style, 
      backgroundImage: url,
      backgroundGradient: { ...style.backgroundGradient!, enabled: false }
    });
    setShowImageInput(false);
  };

  const handleGradientChange = (key: string, value: any) => {
    onChange({
      ...style,
      backgroundGradient: {
        ...style.backgroundGradient!,
        [key]: value,
      },
    });
  };

  const applyTheme = (theme: typeof themePresets[0]) => {
    onChange({
      ...style,
      buttonColor: theme.primary,
      backgroundColor: theme.bg,
      textColor: theme.text,
      borderColor: theme.bg === '#ffffff' ? '#e5e7eb' : '#475569',
      backgroundImage: undefined,
      backgroundGradient: {
        enabled: false,
        startColor: theme.gradient.start,
        endColor: theme.gradient.end,
        direction: theme.gradient.dir,
      },
    });
    setShowGradient(false);
    setShowImageBg(false);
  };

  const ColorInput = ({ 
    label, 
    color, 
    onChange: onColorChange,
    pickerKey
  }: { 
    label: string; 
    color: string; 
    onChange: (color: string) => void;
    pickerKey: string;
  }) => {
    const isActive = activeColorPicker === pickerKey;
    
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</label>
          <span className="text-[10px] font-mono text-gray-400">{color}</span>
        </div>
        <button
          onClick={() => setActiveColorPicker(isActive ? null : pickerKey)}
          className="w-full h-8 rounded border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-2 px-2 bg-white"
        >
          <div 
            className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" 
            style={{ backgroundColor: color }}
          />
          <div className="flex-1 h-3 rounded" style={{ 
            background: `linear-gradient(to right, ${color}, ${color})`,
            opacity: 0.3 
          }} />
        </button>
        {isActive && (
          <div className="absolute left-0 right-0 mt-1 p-2 bg-white rounded-lg border border-gray-200 shadow-2xl z-50">
            <HexColorPicker color={color} onChange={onColorChange} className="w-full" />
            <button
              onClick={() => setActiveColorPicker(null)}
              className="w-full mt-2 px-3 py-1 bg-gray-900 text-white text-[10px] rounded hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        )}
      </div>
    );
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100, 
    unit = 'px' 
  }: { 
    label: string; 
    value: string | number; 
    onChange: (value: string) => void; 
    min?: number; 
    max?: number; 
    unit?: string;
  }) => {
    const numValue = parseInt(String(value)) || 0;
    
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{label}</label>
          <span className="text-[10px] font-mono text-gray-500">{numValue}{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={numValue}
          onChange={(e) => onChange(`${e.target.value}${unit}`)}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    );
  };

  const SectionHeader = ({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) => (
    <button
      onClick={() => setExpandedSection(expandedSection === id ? '' : id)}
      className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{title}</h3>
      </div>
      <span className="text-gray-400 text-xs font-bold">{expandedSection === id ? '−' : '+'}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-3 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Palette className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900">Design</h2>
            <p className="text-[10px] text-gray-500">Style your form</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Theme Presets */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3 w-3 text-gray-400" />
            <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Theme Presets</h3>
          </div>
          <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto">
            {themePresets.map((theme) => (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                className="group relative aspect-square rounded-md border hover:scale-105 transition-all overflow-hidden"
                style={{ 
                  background: `linear-gradient(${theme.gradient.dir}, ${theme.gradient.start}, ${theme.gradient.end})`,
                  borderColor: style.buttonColor === theme.primary && !showGradient && !showImageBg ? theme.primary : '#e5e7eb',
                  borderWidth: style.buttonColor === theme.primary && !showGradient && !showImageBg ? '2px' : '1px'
                }}
                title={theme.name}
              >
                {style.buttonColor === theme.primary && !showGradient && !showImageBg && (
                  <div className="absolute top-0 right-0 bg-white rounded-bl-md p-0.5 shadow">
                    <Check className="h-2 w-2 text-green-600" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fill Section */}
        <div className="border-b border-gray-100">
          <SectionHeader icon={<Palette className="h-3 w-3 text-gray-400" />} title="Fill" id="fill" />
          {expandedSection === 'fill' && (
            <div className="p-3 space-y-2">
              {/* Background Type Toggle */}
              <div className="flex gap-0.5 p-0.5 bg-gray-100 rounded-md">
                <button
                  onClick={() => {
                    setShowGradient(false);
                    setShowImageBg(false);
                    onChange({
                      ...style,
                      backgroundImage: undefined,
                      backgroundGradient: {
                        ...style.backgroundGradient!,
                        enabled: false,
                      },
                    });
                  }}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-all ${
                    !showGradient && !showImageBg
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Solid
                </button>
                <button
                  onClick={handleGradientToggle}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-all ${
                    showGradient
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Gradient
                </button>
                <button
                  onClick={handleImageToggle}
                  className={`flex-1 px-2 py-1 text-[10px] font-medium rounded transition-all ${
                    showImageBg
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Image
                </button>
              </div>

              {/* Color Inputs */}
              {!showGradient && !showImageBg ? (
                <ColorInput
                  label="Background"
                  color={style.backgroundColor}
                  onChange={(color) => handleChange('backgroundColor', color)}
                  pickerKey="bg"
                />
              ) : showImageBg ? (
                <div className="space-y-2">
                  {style.backgroundImage ? (
                    <div className="relative">
                      <div 
                        className="w-full h-24 rounded border border-gray-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${style.backgroundImage})` }}
                      />
                      <button
                        onClick={() => {
                          onChange({ ...style, backgroundImage: undefined });
                          setImageUrl('');
                        }}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow hover:bg-gray-100"
                      >
                        <X className="h-3 w-3 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() => setShowImageInput(!showImageInput)}
                        className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-600">Add Image URL</span>
                      </button>
                      {showImageInput && (
                        <div className="mt-2 flex gap-1">
                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => handleImageUrl(imageUrl)}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <ColorInput
                    label="Start Color"
                    color={style.backgroundGradient?.startColor || style.backgroundColor}
                    onChange={(color) => handleGradientChange('startColor', color)}
                    pickerKey="gradStart"
                  />
                  <ColorInput
                    label="End Color"
                    color={style.backgroundGradient?.endColor || style.buttonColor}
                    onChange={(color) => handleGradientChange('endColor', color)}
                    pickerKey="gradEnd"
                  />
                  
                  {/* Gradient Direction */}
                  <div>
                    <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 block">Direction</label>
                    <div className="grid grid-cols-6 gap-1">
                      {gradientDirections.map((dir) => (
                        <button
                          key={dir.value}
                          onClick={() => handleGradientChange('direction', dir.value)}
                          className={`aspect-square rounded border text-sm font-medium transition-all ${
                            style.backgroundGradient?.direction === dir.value
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                          }`}
                          title={dir.name}
                        >
                          {dir.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colors Section */}
        <div className="border-b border-gray-100">
          <SectionHeader icon={<Palette className="h-3 w-3 text-gray-400" />} title="Colors" id="colors" />
          {expandedSection === 'colors' && (
            <div className="p-3 space-y-2">
              <ColorInput
                label="Button"
                color={style.buttonColor}
                onChange={(color) => handleChange('buttonColor', color)}
                pickerKey="button"
              />
              <ColorInput
                label="Text"
                color={style.textColor}
                onChange={(color) => handleChange('textColor', color)}
                pickerKey="text"
              />
              <ColorInput
                label="Border"
                color={style.borderColor}
                onChange={(color) => handleChange('borderColor', color)}
                pickerKey="border"
              />
            </div>
          )}
        </div>

        {/* Typography */}
        <div className="border-b border-gray-100">
          <SectionHeader icon={<Type className="h-3 w-3 text-gray-400" />} title="Typography" id="typography" />
          {expandedSection === 'typography' && (
            <div className="p-3 space-y-1">
              {fonts.map((font) => (
                <button
                  key={font.value}
                  onClick={() => handleChange('fontFamily', font.value)}
                  className={`w-full px-2 py-1.5 rounded text-left text-xs transition-all ${
                    style.fontFamily === font.value
                      ? 'bg-blue-50 text-blue-900 font-medium border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layout Section */}
        <div className="border-b border-gray-100">
          <SectionHeader icon={<Layout className="h-3 w-3 text-gray-400" />} title="Layout" id="layout" />
          {expandedSection === 'layout' && (
            <div className="p-3 space-y-2">
              <SliderControl
                label="Padding"
                value={style.padding || '32px'}
                onChange={(value) => handleChange('padding', value)}
                min={0}
                max={64}
              />
              <SliderControl
                label="Border Width"
                value={style.borderWidth || '1px'}
                onChange={(value) => handleChange('borderWidth', value)}
                min={0}
                max={8}
              />
              <div>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 block">Border Style</label>
                <div className="grid grid-cols-4 gap-1">
                  {['solid', 'dashed', 'dotted', 'double'].map((borderStyle) => (
                    <button
                      key={borderStyle}
                      onClick={() => handleChange('borderStyle', borderStyle)}
                      className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all capitalize ${
                        style.borderStyle === borderStyle
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {borderStyle}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Effects */}
        <div className="border-b border-gray-100">
          <SectionHeader icon={<Sliders className="h-3 w-3 text-gray-400" />} title="Effects" id="effects" />
          {expandedSection === 'effects' && (
            <div className="p-3 space-y-3">
              {/* Corners */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 block">Corner Radius</label>
                <div className="grid grid-cols-4 gap-1 mb-2">
                  {[
                    { label: '0', value: '0px' },
                    { label: '4', value: '4px' },
                    { label: '8', value: '8px' },
                    { label: '16', value: '16px' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('borderRadius', option.value)}
                      className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
                        style.borderRadius === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <SliderControl
                  label="Custom"
                  value={style.borderRadius || '8px'}
                  onChange={(value) => handleChange('borderRadius', value)}
                  min={0}
                  max={32}
                />
              </div>

              {/* Shadow */}
              <div>
                <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wide mb-1 block">Shadow</label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: 'None', value: 'none' },
                    { label: 'SM', value: '0 1px 2px rgba(0,0,0,0.05)' },
                    { label: 'MD', value: '0 4px 12px rgba(0,0,0,0.08)' },
                    { label: 'LG', value: '0 10px 30px rgba(0,0,0,0.12)' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleChange('boxShadow', option.value)}
                      className={`px-2 py-2 rounded text-[10px] font-medium transition-all ${
                        style.boxShadow === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={{ boxShadow: option.value !== 'none' ? option.value : undefined }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3 w-3 text-gray-400" />
            <h3 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Preview</h3>
          </div>
          <div 
            className="p-4 rounded border bg-cover bg-center"
            style={{
              backgroundImage: showImageBg && style.backgroundImage ? `url(${style.backgroundImage})` : undefined,
              background: !showImageBg ? (showGradient && style.backgroundGradient?.enabled
                ? `linear-gradient(${style.backgroundGradient.direction}, ${style.backgroundGradient.startColor}, ${style.backgroundGradient.endColor})`
                : style.backgroundColor) : undefined,
              borderColor: style.borderColor,
              borderRadius: style.borderRadius,
              borderWidth: style.borderWidth,
              borderStyle: style.borderStyle,
              boxShadow: style.boxShadow,
              fontFamily: style.fontFamily,
              padding: style.padding || '16px',
            }}
          >
            <div className={showImageBg && style.backgroundImage ? 'bg-white/90 backdrop-blur-sm p-3 rounded' : ''}>
              <h4 className="text-xs font-semibold mb-1.5" style={{ color: style.textColor }}>
                Question Title
              </h4>
              <input
                type="text"
                placeholder="Your answer"
                className="w-full px-2 py-1 mb-2 border-b-2 outline-none bg-transparent text-xs"
                style={{ 
                  borderColor: style.textColor + '30',
                  color: style.textColor 
                }}
                disabled
              />
              <button
                className="px-3 py-1 rounded text-xs font-medium text-white"
                style={{ 
                  backgroundColor: style.buttonColor,
                  borderRadius: style.borderRadius 
                }}
                disabled
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
