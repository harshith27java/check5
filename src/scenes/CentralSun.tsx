import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  orbitRadii: number[];
  pulse?: boolean;
}

export const CentralSun: React.FC<Props> = ({ orbitRadii, pulse = false }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
      const s = 1 + (pulse ? Math.sin(t * 4) * 0.15 : Math.sin(t * 1.5) * 0.04);
      coreRef.current.scale.set(s, s, s);
    }
    if (glowRef.current) {
      const gs = 1.4 + Math.sin(t * 2) * 0.08;
      glowRef.current.scale.set(gs, gs, gs);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Star Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshStandardMaterial
          emissive="#fbbf24"
          emissiveIntensity={2.0}
          color="#f59e0b"
          roughness={0.2}
        />
      </mesh>

      {/* Atmospheric Glow Shell */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight color="#fed7aa" intensity={3.5} distance={120} decay={2} />

      {/* 5 Orbit Rings */}
      {orbitRadii.map((radius, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.04, radius + 0.04, 96]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
