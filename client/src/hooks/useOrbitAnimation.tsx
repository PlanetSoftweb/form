import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

interface UseOrbitAnimationProps {
  distance: number;
  speed: number;
  animationSpeed: number;
}

export function useOrbitAnimation({ distance, speed, animationSpeed }: UseOrbitAnimationProps) {
  const angleRef = useRef(0);
  const positionRef = useRef({ x: distance, y: 0, z: 0 });
  
  useFrame(() => {
    angleRef.current += speed * 0.001 * animationSpeed;
    positionRef.current.x = Math.cos(angleRef.current) * distance;
    positionRef.current.z = Math.sin(angleRef.current) * distance;
  });
  
  return positionRef.current;
}
