interface ControlsProps {
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
}

export default function Controls({ 
  animationSpeed, 
  setAnimationSpeed, 
  showOrbits, 
  setShowOrbits 
}: ControlsProps) {
  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg border border-gray-700">
      <h3 className="text-lg font-bold mb-3 text-yellow-400">Solar System Controls</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-blue-300">
            Animation Speed: {animationSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-full accent-yellow-400"
          />
        </div>
        
        <div>
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              className="accent-yellow-400"
            />
            <span className="text-blue-300">Show Orbital Paths</span>
          </label>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>• Click planets for information</p>
        <p>• Use mouse to rotate and zoom</p>
        <p>• Scroll to zoom in/out</p>
      </div>
    </div>
  );
}
