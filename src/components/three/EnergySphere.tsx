
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnergySphereProps {
  position: [number, number, number];
  color: string;
  radius: number;
}

export const EnergySphere = ({ position, color, radius }: EnergySphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const wispy1Ref = useRef<THREE.Mesh>(null);
  const wispy2Ref = useRef<THREE.Mesh>(null);
  const orbitalRef1 = useRef<THREE.Mesh>(null);
  const orbitalRef2 = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (sphereRef.current && glowRef.current && wispy1Ref.current && wispy2Ref.current && orbitalRef1.current && orbitalRef2.current) {
      const t = clock.getElapsedTime();
      
      // Core sphere pulsing
      const pulse = Math.sin(t * 1.5) * 0.15;
      sphereRef.current.scale.set(1 + pulse, 1 + pulse, 1 + pulse);
      
      // Wispy outer layers rotation
      wispy1Ref.current.rotation.x = t * 0.2;
      wispy1Ref.current.rotation.y = t * 0.3;
      wispy2Ref.current.rotation.x = -t * 0.25;
      wispy2Ref.current.rotation.z = t * 0.35;
      
      // Orbital rings rotation
      orbitalRef1.current.rotation.x = t * 0.3;
      orbitalRef1.current.rotation.y = t * 0.5;
      orbitalRef2.current.rotation.z = t * 0.4;
      orbitalRef2.current.rotation.x = t * 0.25;
      
      // Glow effect pulsing
      const glowPulse = Math.sin(t * 0.8) * 0.2 + 1.8;
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse);
    }
  });

  return (
    <group>
      {/* Core sphere */}
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
      
      {/* Wispy outer layers */}
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
      
      {/* Orbital rings - new elements */}
      <mesh position={position} ref={orbitalRef1}>
        <torusGeometry args={[radius * 1.5, radius * 0.04, 16, 100]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      <mesh position={position} ref={orbitalRef2}>
        <torusGeometry args={[radius * 1.2, radius * 0.03, 16, 100]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Glow effect */}
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
