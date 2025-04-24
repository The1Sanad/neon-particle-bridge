
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { ParticleBridge } from './ParticleBridge';

export function Scene() {
  return (
    <div className="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={60} />
        <Suspense fallback={null}>
          <ParticleBridge />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <pointLight position={[10, 10, 10]} intensity={1500} />
        <pointLight position={[-10, -10, -10]} intensity={1000} />
        <ambientLight intensity={0.2} />
      </Canvas>
    </div>
  );
}
