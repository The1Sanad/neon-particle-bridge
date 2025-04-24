
import { useIsMobile } from '@/hooks/use-mobile';
import { EnergySphere } from './three/EnergySphere';
import { Particles } from './three/Particles';

interface ParticleBridgeProps {
  offsetX: number;
  offsetY: number;
  windowWidth: number;
  windowHeight: number;
  totalWidth: number;
  totalHeight: number;
}

export function ParticleBridge({ 
  offsetX, 
  offsetY, 
  windowWidth, 
  windowHeight, 
  totalWidth, 
  totalHeight 
}: ParticleBridgeProps) {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 3000 : 8000;

  return (
    <group>
      <EnergySphere 
        position={[-6 + (offsetX * totalWidth / windowWidth), 
                  0 + (offsetY * totalHeight / windowHeight), 
                  0]} 
        color="#50E991" 
        radius={1.8} 
      />
      <EnergySphere 
        position={[6 + (offsetX * totalWidth / windowWidth), 
                  0 + (offsetY * totalHeight / windowHeight), 
                  0]} 
        color="#FF3D5A" 
        radius={1.8} 
      />
      <Particles 
        count={particleCount} 
        offsetX={offsetX}
        offsetY={offsetY}
        windowWidth={windowWidth}
        windowHeight={windowHeight}
        totalWidth={totalWidth}
        totalHeight={totalHeight}
      />
    </group>
  );
}
