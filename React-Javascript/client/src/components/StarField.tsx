import { useRef, useMemo } from 'react';
import { Points } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function StarField() {
  const starsRef = useRef<Points>(null);
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    
    return positions;
  }, []);
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={starPositions}
          itemSize={3}
          count={5000}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2}
        sizeAttenuation={true}
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </points>
  );
}
