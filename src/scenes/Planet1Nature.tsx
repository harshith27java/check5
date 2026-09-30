import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Planet1Nature: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Group>(null);

  const count = 1200;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const green1 = new THREE.Color('#4ade80');
    const green2 = new THREE.Color('#86efac');
    const amber = new THREE.Color('#fef08a');

    for (let i = 0; i < count; i++) {
      // Swirling organic foliage / pollen spiral
      const theta = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 12;
      const height = (Math.random() - 0.5) * 8;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = height + Math.sin(radius * 0.5) * 1.5;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      const c = Math.random() > 0.3 ? green1 : Math.random() > 0.5 ? green2 : amber;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, cols];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = -t * 0.05;
      ringRef.current.position.y = Math.sin(t * 0.8) * 0.3;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Nature Orb */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#15803d"
          emissive="#22c55e"
          emissiveIntensity={0.6}
          roughness={0.6}
        />
      </mesh>

      {/* Floating Organic Pollen & Flora particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          vertexColors
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </points>

      {/* Warm Ambient Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[5.5, 0.05, 16, 64]} />
          <meshBasicMaterial color="#86efac" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
};
