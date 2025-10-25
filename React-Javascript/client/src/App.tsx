import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import "@fontsource/inter";
import SolarSystem from "./components/SolarSystem";
import PlanetInfo from "./components/PlanetInfo";
import Controls from "./components/Controls";
import { PlanetData } from "./data/planetData";

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000011' }}>
      <Canvas
        shadows
        camera={{
          position: [0, 20, 50],
          fov: 60,
          near: 0.1,
          far: 10000
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#000011"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} color="#FDB813" />
        
        {/* Stars background */}
        <Stars radius={300} depth={100} count={8000} factor={6} saturation={0} fade speed={0.5} />
        
        <Suspense fallback={null}>
          <SolarSystem 
            onPlanetClick={setSelectedPlanet}
            animationSpeed={animationSpeed}
            showOrbits={showOrbits}
          />
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={500}
          autoRotate={false}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <Controls 
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        showOrbits={showOrbits}
        setShowOrbits={setShowOrbits}
      />
      
      {selectedPlanet && (
        <PlanetInfo 
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}
    </div>
  );
}

export default App;
