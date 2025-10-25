import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3x3, 
  Ruler,
  Eye,
  Monitor,
  Tablet,
  Smartphone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface CanvasControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showGrid,
  onToggleGrid,
  showRulers,
  onToggleRulers,
  viewMode,
  onViewModeChange,
}) => {
  const viewModes = [
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 flex items-center gap-2"
      >
        {/* View Mode Selector */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          {viewModes.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onViewModeChange(id)}
              className={`p-2 rounded-lg transition-all ${
                viewMode === id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-200">
          <button
            onClick={onZoomOut}
            disabled={zoom <= 50}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={onZoomReset}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors min-w-[60px]"
            title="Reset Zoom"
          >
            {zoom}%
          </button>
          <button
            onClick={onZoomIn}
            disabled={zoom >= 200}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* View Options */}
        <div className="flex items-center gap-1 px-2">
          <button
            onClick={onToggleGrid}
            className={`p-2 rounded-lg transition-all ${
              showGrid
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggleRulers}
            className={`p-2 rounded-lg transition-all ${
              showRulers
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Toggle Rulers"
          >
            <Ruler className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
