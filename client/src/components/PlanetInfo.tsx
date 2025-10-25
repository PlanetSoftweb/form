import { PlanetData } from '../data/planetData';

interface PlanetInfoProps {
  planet: PlanetData;
  onClose: () => void;
}

export default function PlanetInfo({ planet, onClose }: PlanetInfoProps) {
  return (
    <div className="fixed top-4 right-4 w-96 bg-black bg-opacity-90 text-white p-6 rounded-lg border border-gray-700 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400">{planet.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xl font-bold"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong className="text-blue-300">Diameter:</strong>
            <div>{planet.facts.diameter}</div>
          </div>
          <div>
            <strong className="text-blue-300">Distance from Sun:</strong>
            <div>{planet.facts.distanceFromSun}</div>
          </div>
          <div>
            <strong className="text-blue-300">Orbital Period:</strong>
            <div>{planet.facts.orbitalPeriod}</div>
          </div>
          <div>
            <strong className="text-blue-300">Day Length:</strong>
            <div>{planet.facts.dayLength}</div>
          </div>
          <div>
            <strong className="text-blue-300">Temperature:</strong>
            <div>{planet.facts.temperature}</div>
          </div>
          <div>
            <strong className="text-blue-300">Moons:</strong>
            <div>{planet.facts.moons}</div>
          </div>
        </div>
        
        <div>
          <strong className="text-blue-300">Composition:</strong>
          <div className="text-sm mt-1">{planet.facts.composition}</div>
        </div>
        
        <div>
          <strong className="text-blue-300">Interesting Facts:</strong>
          <ul className="text-sm mt-2 space-y-1">
            {planet.facts.interestingFacts.map((fact, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
