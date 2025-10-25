import { useRef, useMemo } from 'react';
import { Mesh, Group, BufferGeometry, Material } from 'three';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { PlanetData } from '../data/planetData';
import * as THREE from 'three';

interface PlanetProps {
  data: PlanetData;
  onClick: () => void;
  animationSpeed: number;
  showOrbit: boolean;
}

export default function Planet({ data, onClick, animationSpeed, showOrbit }: PlanetProps) {
  const planetRef = useRef<Mesh>(null);
  const orbitGroupRef = useRef<Group>(null);
  const orbitAngleRef = useRef(0);

  // Generate orbit path points
  const orbitPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * data.distance,
        0,
        Math.sin(angle) * data.distance
      ));
    }
    return points;
  }, [data.distance]);

  useFrame(() => {
    if (orbitGroupRef.current && planetRef.current) {
      // Update orbital position
      orbitAngleRef.current += data.orbitSpeed * 0.001 * animationSpeed;
      const x = Math.cos(orbitAngleRef.current) * data.distance;
      const z = Math.sin(orbitAngleRef.current) * data.distance;
      
      orbitGroupRef.current.position.set(x, 0, z);
      
      // Planet rotation
      planetRef.current.rotation.y += data.rotationSpeed * animationSpeed;
    }
  });

  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <>
      {/* Orbital path */}
      {showOrbit && (
        <Line
          points={orbitPoints}
          color="#444444"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      )}
      
      {/* Planet group for orbital positioning */}
      <group ref={orbitGroupRef}>
        <mesh 
          ref={planetRef}
          onClick={handleClick}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'auto';
          }}
        >
          <sphereGeometry args={[data.radius, 32, 32]} />
          <meshPhongMaterial 
            color={data.color}
            shininess={30}
            specular="#222222"
          />
        </mesh>
        
        {/* Planet label */}
        <mesh position={[0, data.radius + 1.5, 0]}>
          <planeGeometry args={[data.name.length * 0.8, 1]} />
          <meshBasicMaterial 
            color="#ffffff"
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>
    </>
  );
}
