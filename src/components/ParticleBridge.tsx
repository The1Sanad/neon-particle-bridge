import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticleProps {
  count: number;
}

interface ParticleBridgeProps {
  offsetX: number;
  offsetY: number;
  windowWidth: number;
  windowHeight: number;
  totalWidth: number;
  totalHeight: number;
}

const EnergySphere = ({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const wispy1Ref = useRef<THREE.Mesh>(null);
  const wispy2Ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current && glowRef.current && wispy1Ref.current && wispy2Ref.current) {
      const t = clock.getElapsedTime();
      
      const pulse = Math.sin(t * 1.5) * 0.15;
      sphereRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      
      wispy1Ref.current.rotation.x = t * 0.2;
      wispy1Ref.current.rotation.y = t * 0.3;
      wispy2Ref.current.rotation.x = -t * 0.25;
      wispy2Ref.current.rotation.z = t * 0.35;
      
      const glowPulse = Math.sin(t * 0.8) * 0.2 + 1.8;
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    }
  });

  return (
    <group>
      <mesh position={position} ref={sphereRef}>
        <sphereGeometry args={[radius * 0.6, 64, 64]} />
        <meshPhongMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <mesh position={position} ref={wispy1Ref}>
        <sphereGeometry args={[radius * 1.2, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.15}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={position} ref={wispy2Ref}>
        <sphereGeometry args={[radius * 0.9, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.2}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
      
      <mesh position={position} ref={glowRef}>
        <sphereGeometry args={[radius * 1.4, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const Particles = ({ count, offsetX, offsetY, windowWidth, windowHeight, totalWidth, totalHeight }: 
  ParticleBridgeProps & { count: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const t = Math.random();
      const angle = t * Math.PI * 2;
      
      const bridgeWidth = Math.sin(t * Math.PI) * 2.5;
      const curveHeight = Math.sin(t * Math.PI) * 0.8;
      
      const concentration = Math.pow(Math.sin(t * Math.PI), 2);
      const radius = (Math.random() * 0.8 + 0.2) * concentration;
      
      positions[i3] = (-6 + t * 12) + (offsetX * totalWidth / windowWidth);
      positions[i3 + 1] = (curveHeight + Math.cos(angle) * radius * bridgeWidth) + 
        (offsetY * totalHeight / windowHeight);
      positions[i3 + 2] = Math.sin(angle) * radius * bridgeWidth;
      
      if (t < 0.5) {
        color.set('#50E991').lerp(new THREE.Color('#FFFFFF'), Math.pow(t * 2, 1.5));
      } else {
        color.set('#FFFFFF').lerp(new THREE.Color('#FF3D5A'), Math.pow((t - 0.5) * 2, 1.5));
      }
      
      color.toArray(colors, i3);
      sizes[i] = (Math.random() * 0.3 + 0.1) * concentration;
    }
    
    return { positions, colors, sizes };
  }, [count, offsetX, offsetY, windowWidth, windowHeight, totalWidth, totalHeight]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positionArray[i3];
      
      const frequency = 0.8;
      const amplitude = 0.2;
      
      positionArray[i3 + 1] += Math.sin(time * frequency + x) * amplitude * 0.02;
      positionArray[i3 + 2] += Math.cos(time * frequency + x * 1.2) * amplitude * 0.02;
      
      if (Math.abs(positionArray[i3 + 1]) > 3) positionArray[i3 + 1] *= 0.95;
      if (Math.abs(positionArray[i3 + 2]) > 3) positionArray[i3 + 2] *= 0.95;
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

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
