import { useRef } from 'react';
import { Group } from 'three';
import Sun from './Sun';
import Planet from './Planet';
import { planetsData, PlanetData } from '../data/planetData';
import { useFrame } from '@react-three/fiber';

interface SolarSystemProps {
  onPlanetClick: (planet: PlanetData) => void;
  animationSpeed: number;
  showOrbits: boolean;
}

export default function SolarSystem({ onPlanetClick, animationSpeed, showOrbits }: SolarSystemProps) {
  const systemRef = useRef<Group>(null);
  
  // Rotate the entire solar system slowly for a dynamic view
  useFrame((state) => {
    if (systemRef.current) {
      systemRef.current.rotation.y += 0.001 * animationSpeed;
    }
  });

  return (
    <group ref={systemRef}>
      <Sun />
      
      {planetsData.map((planetData, index) => (
        <Planet
          key={planetData.name}
          data={planetData}
          onClick={() => onPlanetClick(planetData)}
          animationSpeed={animationSpeed}
          showOrbit={showOrbits}
        />
      ))}
    </group>
  );
}
