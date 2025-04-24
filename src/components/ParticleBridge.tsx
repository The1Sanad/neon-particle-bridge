import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticleProps {
  count: number;
}

const EnergySphere = ({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current && glowRef.current) {
      const t = clock.getElapsedTime();
      // Organic pulsing effect
      sphereRef.current.scale.x = 1 + Math.sin(t * 1.5) * 0.1;
      sphereRef.current.scale.y = 1 + Math.sin(t * 1.2) * 0.1;
      sphereRef.current.scale.z = 1 + Math.sin(t * 1.8) * 0.1;
      
      // Rotate the glow effect independently
      glowRef.current.rotation.y = t * 0.3;
      glowRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <group>
      <mesh position={position} ref={sphereRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      {/* Outer glow effect */}
      <mesh position={position} ref={glowRef}>
        <sphereGeometry args={[radius * 1.5, 32, 32]} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const Particles = ({ count }: ParticleProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create a more organic bridge shape
      const t = Math.random();
      const angle = t * Math.PI * 2;
      const radius = Math.random() * 0.5;
      
      const bridgeWidth = Math.sin(t * Math.PI) * 1.5;
      const curveHeight = Math.sin(t * Math.PI) * 0.5;
      
      positions[i3] = -4 + t * 8; // x: interpolate from -4 to 4
      positions[i3 + 1] = curveHeight + Math.cos(angle) * radius * bridgeWidth;
      positions[i3 + 2] = Math.sin(angle) * radius * bridgeWidth;
      
      // Enhanced color interpolation
      if (t < 0.5) {
        color.set('#50E991').lerp(new THREE.Color('#FFFFFF'), t * 2);
      } else {
        color.set('#FFFFFF').lerp(new THREE.Color('#FF3D5A'), (t - 0.5) * 2);
      }
      
      color.toArray(colors, i3);
      sizes[i] = Math.random() * 0.2 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positionArray[i3];
      
      // More organic movement
      const frequency = 1.2;
      const amplitude = 0.15;
      
      positionArray[i3 + 1] += Math.sin(time * frequency + x) * amplitude * 0.02;
      positionArray[i3 + 2] += Math.cos(time * frequency + x) * amplitude * 0.02;
      
      // Keep particles within bounds
      if (Math.abs(positionArray[i3 + 1]) > 2) positionArray[i3 + 1] *= 0.95;
      if (Math.abs(positionArray[i3 + 2]) > 2) positionArray[i3 + 2] *= 0.95;
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
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export function ParticleBridge() {
  const isMobile = useIsMobile();
  const particleCount = isMobile ? 2000 : 5000;

  return (
    <group>
      <EnergySphere position={[-4, 0, 0]} color="#50E991" radius={1.2} />
      <EnergySphere position={[4, 0, 0]} color="#FF3D5A" radius={1.2} />
      <Particles count={particleCount} />
    </group>
  );
}
