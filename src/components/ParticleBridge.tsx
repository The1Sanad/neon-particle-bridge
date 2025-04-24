
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParticleProps {
  count: number;
}

const EnergySphere = ({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      sphereRef.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh position={position} ref={sphereRef}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={2} 
        roughness={0.2} 
        metalness={0.8}
      />
    </mesh>
  );
};

const Particles = ({ count }: ParticleProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Position particles in a bridge shape between spheres
      const t = Math.random();
      const curveHeight = 2 * Math.sin(t * Math.PI);
      
      positions[i3] = -4 + t * 8; // x: interpolate from -4 to 4
      positions[i3 + 1] = curveHeight + (Math.random() - 0.5) * 1.5; // y: curved path with some randomness
      positions[i3 + 2] = (Math.random() - 0.5) * 2; // z: some depth
      
      // Color interpolation between red and green
      if (t < 0.5) {
        color.set('#FF3D5A').lerp(new THREE.Color('#FFFFFF'), t * 2);
      } else {
        color.set('#FFFFFF').lerp(new THREE.Color('#50E991'), (t - 0.5) * 2);
      }
      
      color.toArray(colors, i3);
    }
    
    return { positions, colors };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    
    const time = clock.getElapsedTime();
    const positionArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = positionArray[i3];
      const y = positionArray[i3 + 1];
      
      // Apply wave-like movement
      const frequency = 1.5;
      const amplitude = 0.1;
      
      // Different movement based on position
      positionArray[i3 + 1] = y + Math.sin(time * frequency + x) * amplitude;
      positionArray[i3 + 2] += Math.cos(time * frequency + x) * amplitude * 0.5;
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
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export function ParticleBridge() {
  const isMobile = useIsMobile();
  
  // Use fewer particles on mobile for better performance
  const particleCount = isMobile ? 1000 : 3000;

  return (
    <group>
      <EnergySphere position={[-4, 0, 0]} color="#FF3D5A" radius={1} />
      <EnergySphere position={[4, 0, 0]} color="#50E991" radius={1} />
      <Particles count={particleCount} />
    </group>
  );
}
