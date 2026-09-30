import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';

export const Planet4Energy: React.FC = () => {
  const [reconstructed, setReconstructed] = useState(false);
  const shardsGroupRef = useRef<THREE.Group>(null);
  const centerOrbRef = useRef<THREE.Mesh>(null);

  const shardCount = 36;
  const shards = useMemo(() => {
    return Array.from({ length: shardCount }).map((_, i) => {
      // Dispersed chaotic position
      const spread = 8;
      const dispersedPos = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      );
      // Reconstructed spherical target position
      const phi = Math.acos(-1 + (2 * i) / shardCount);
      const theta = Math.sqrt(shardCount * Math.PI) * phi;
      const targetPos = new THREE.Vector3(
        2.2 * Math.cos(theta) * Math.sin(phi),
        2.2 * Math.sin(theta) * Math.sin(phi),
        2.2 * Math.cos(phi)
      );

      return {
        id: i,
        dispersedPos,
        targetPos,
        currentPos: dispersedPos.clone(),
        rotSpeed: (Math.random() - 0.5) * 0.05,
      };
    });
  }, []);

  const handleToggleReconstruct = () => {
    soundManager.playCelestialChime(reconstructed ? 400 : 700);
    setReconstructed(!reconstructed);
  };

  useFrame((_, delta) => {
    shards.forEach((shard) => {
      const dest = reconstructed ? shard.targetPos : shard.dispersedPos;
      shard.currentPos.lerp(dest, delta * 2.5);
    });

    if (shardsGroupRef.current) {
      shardsGroupRef.current.rotation.y += reconstructed ? delta * 0.2 : delta * 0.8;
      shardsGroupRef.current.rotation.x += reconstructed ? delta * 0.1 : delta * 0.4;
    }

    if (centerOrbRef.current) {
      centerOrbRef.current.scale.lerp(
        reconstructed ? new THREE.Vector3(1, 1, 1) : new THREE.Vector3(0.01, 0.01, 0.01),
        delta * 3
      );
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Reconstructed Core Orb */}
      <mesh ref={centerOrbRef} scale={0.01}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#fb923c"
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Floating Shards */}
      <group ref={shardsGroupRef}>
        {shards.map((s, idx) => (
          <mesh key={idx} position={s.currentPos}>
            <octahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#ffedd5"
              emissiveIntensity={reconstructed ? 0.3 : 0.9}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Reconstruct Trigger Button in 3D scene */}
      <Html position={[0, -3.8, 0]} center>
        <button
          onClick={handleToggleReconstruct}
          className="px-5 py-2 rounded-full glass-panel border border-amber-400/40 text-amber-200 hover:text-white font-tech text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105"
        >
          {reconstructed ? '⚡ Disperse Energy' : '✨ Reconstruct Memory Core'}
        </button>
      </Html>
    </group>
  );
};
