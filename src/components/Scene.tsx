
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { ParticleBridge } from './ParticleBridge';
import WindowManager from '../utils/windowManager';

export function Scene() {
  const [windowManager] = useState(() => WindowManager.getInstance());
  const [, setRenderTrigger] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setRenderTrigger(prev => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleResize);

    // Sync initially
    windowManager.syncWindows();

    const interval = setInterval(() => {
      windowManager.syncWindows();
    }, 1000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleResize);
      clearInterval(interval);
    };
  }, [windowManager]);

  const currentWindow = windowManager.getCurrentWindowInfo();
  const allWindows = windowManager.getWindowInfo();

  // Calculate the virtual canvas size and offset
  const totalWidth = Math.max(
    ...allWindows.map(w => w.position.x + w.size.width),
    currentWindow.position.x + currentWindow.size.width
  );
  const totalHeight = Math.max(
    ...allWindows.map(w => w.position.y + w.size.height),
    currentWindow.position.y + currentWindow.size.height
  );

  // Calculate camera offset based on window position
  const offsetX = (currentWindow.position.x / totalWidth) * 2 - 1;
  const offsetY = (currentWindow.position.y / totalHeight) * -2 + 1;

  return (
    <div className="canvas-container">
      <Canvas>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 16]} 
          fov={45}
          near={0.1}
          far={1000}
        />
        <Suspense fallback={null}>
          <ParticleBridge 
            offsetX={offsetX} 
            offsetY={offsetY}
            windowWidth={currentWindow.size.width}
            windowHeight={currentWindow.size.height}
            totalWidth={totalWidth}
            totalHeight={totalHeight}
          />
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
