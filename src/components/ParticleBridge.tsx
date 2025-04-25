
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
  
  // Increase particle count for more detailed visuals
  const particleCount = isMobile ? 4000 : 12000;

  return (
    <group>
      {/* Left energy sphere (green) */}
      <EnergySphere 
        position={[-6 + (offsetX * totalWidth / windowWidth), 
                  0 + (offsetY * totalHeight / windowHeight), 
                  0]} 
        color="#50E991" 
        radius={2.2} 
      />
      
      {/* Right energy sphere (red) */}
      <EnergySphere 
        position={[6 + (offsetX * totalWidth / windowWidth), 
                  0 + (offsetY * totalHeight / windowHeight), 
                  0]} 
        color="#FF3D5A" 
        radius={2.2} 
      />
      
      {/* Connecting particle bridge */}
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
