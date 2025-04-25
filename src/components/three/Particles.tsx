import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count: number;
  offsetX: number;
  offsetY: number;
  windowWidth: number;
  windowHeight: number;
  totalWidth: number;
  totalHeight: number;
}

export const Particles = ({ 
  count, 
  offsetX, 
  offsetY, 
  windowWidth, 
  windowHeight, 
  totalWidth, 
  totalHeight 
}: ParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const color = new THREE.Color();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (i < count * 0.7) {
        const t = Math.random();
        const angle = t * Math.PI * 2;
        
        const bridgeWidth = Math.sin(t * Math.PI) * 2.8;
        const curveHeight = Math.sin(t * Math.PI) * 1.2;
        
        const concentration = Math.pow(Math.sin(t * Math.PI), 1.5);
        const radius = (Math.random() * 0.9 + 0.2) * concentration;
        
        positions[i3] = (-6 + t * 12) + (offsetX * totalWidth / windowWidth);
        
        const heightCurve = Math.sin(t * Math.PI) * 0.6;
        positions[i3 + 1] = (heightCurve + Math.cos(angle) * radius * bridgeWidth) + 
          (offsetY * totalHeight / windowHeight);
        positions[i3 + 2] = Math.sin(angle) * radius * bridgeWidth;
        
        if (t < 0.5) {
          color.set('#50E991').lerp(new THREE.Color('#FFFFFF'), Math.pow(t * 2, 1.2));
        } else {
          color.set('#FFFFFF').lerp(new THREE.Color('#FF3D5A'), Math.pow((t - 0.5) * 2, 1.2));
        }
        
        color.toArray(colors, i3);
        sizes[i] = (Math.random() * 0.35 + 0.08) * concentration;
      } 
      else {
        const sphere = Math.random() > 0.5 ? 1 : -1;
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 4 + 2.5;
        
        positions[i3] = (sphere * 6 + Math.sin(theta) * Math.sin(phi) * radius) + 
          (offsetX * totalWidth / windowWidth);
        positions[i3 + 1] = (Math.cos(phi) * radius) + 
          (offsetY * totalHeight / windowHeight);
        positions[i3 + 2] = Math.cos(theta) * Math.sin(phi) * radius;
        
        if (sphere > 0) {
          color.set('#FF3D5A');
        } else {
          color.set('#50E991');
        }
        
        sizes[i] = Math.random() * 0.2 + 0.05;
      }
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
      
      const frequency = 0.8 + Math.sin(i * 0.3) * 0.2;
      const amplitude = 0.25;
      
      positionArray[i3 + 1] += Math.sin(time * frequency + x) * amplitude * 0.02;
      positionArray[i3 + 2] += Math.cos(time * frequency + x * 1.2) * amplitude * 0.02;
      
      if (Math.abs(positionArray[i3 + 1]) > 3.5) positionArray[i3 + 1] *= 0.95;
      if (Math.abs(positionArray[i3 + 2]) > 3.5) positionArray[i3 + 2] *= 0.95;
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
