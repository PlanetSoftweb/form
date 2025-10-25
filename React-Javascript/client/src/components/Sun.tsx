import { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sun() {
  const sunRef = useRef<Mesh>(null);
  
  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 32, 32]} />
      <meshBasicMaterial 
        color="#FDB813"
        emissive="#FDB813"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
