
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { ParticleBridge } from './ParticleBridge';

export function Scene() {
  return (
    <div className="canvas-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={45} />
        <Suspense fallback={null}>
          <ParticleBridge />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          rotateSpeed={0.4}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.8}
        />
        <pointLight position={[10, 10, 10]} intensity={800} color="#50E991" />
        <pointLight position={[-10, -10, -10]} intensity={800} color="#FF3D5A" />
        <ambientLight intensity={0.1} />
      </Canvas>
    </div>
  );
}
