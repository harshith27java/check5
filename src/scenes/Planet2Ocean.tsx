import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const Planet2Ocean: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const waveMeshRef = useRef<THREE.Mesh>(null);

  const count = 1500;
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const c1 = new THREE.Color('#38bdf8');
    const c2 = new THREE.Color('#0284c7');
    const c3 = new THREE.Color('#e0f2fe');

    for (let i = 0; i < count; i++) {
      // Underwater bubble column & drifting marine particles
      const r = 1 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 12;

      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;

      const c = Math.random() > 0.4 ? c1 : Math.random() > 0.5 ? c2 : c3;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, cols];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      // Rising bubble motion
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      const array = positionsAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        array[i * 3 + 1] += 0.02;
        if (array[i * 3 + 1] > 6) {
          array[i * 3 + 1] = -6;
        }
      }
      positionsAttr.needsUpdate = true;
      pointsRef.current.rotation.y = t * 0.03;
    }

    if (waveMeshRef.current) {
      waveMeshRef.current.rotation.y = t * 0.1;
      const s = 1 + Math.sin(t * 1.5) * 0.05;
      waveMeshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Water Sphere */}
      <mesh ref={waveMeshRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshStandardMaterial
          color="#0369a1"
          emissive="#38bdf8"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>

      {/* Bioluminescent floating water particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Wave ripples */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 5.5, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
