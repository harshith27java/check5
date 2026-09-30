import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MemoryData } from '../types';
import { soundManager } from '../audio/soundManager';

interface Props {
  memories: MemoryData[];
  onSelectPlanet: (worldNum: number) => void;
  highlightedWorld?: number | null;
  freezeOrbits?: boolean;
}

interface SinglePlanetProps {
  memory: MemoryData;
  onSelect: () => void;
  isHighlighted: boolean;
  freezeOrbits: boolean;
}

const SinglePlanet: React.FC<SinglePlanetProps> = ({
  memory,
  onSelect,
  isHighlighted,
  freezeOrbits,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Offset start angle based on planet id
  const startAngle = useRef(memory.worldNumber * 1.25);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      const angle = freezeOrbits
        ? startAngle.current
        : startAngle.current + t * memory.orbitSpeed * 0.4;
      const x = Math.cos(angle) * memory.orbitRadius;
      const z = Math.sin(angle) * memory.orbitRadius;
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005;
    }
  });

  const baseScale = memory.worldNumber === 5 ? 1.6 : 1.2;
  const currentScale = hovered || isHighlighted ? baseScale * 1.35 : baseScale;

  return (
    <group ref={groupRef}>
      {/* Planet Mesh */}
      <mesh
        ref={meshRef}
        scale={currentScale}
        onClick={(e) => {
          e.stopPropagation();
          soundManager.playCelestialChime(440 + memory.worldNumber * 70);
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          setHovered(false);
        }}
      >
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={memory.planetColor}
          emissive={memory.accentColor}
          emissiveIntensity={hovered || isHighlighted ? 0.9 : 0.25}
          roughness={0.4}
          metalness={memory.worldNumber === 5 ? 0.8 : 0.2}
        />
      </mesh>

      {/* Planetary Ring for Planet 2 and 5 */}
      {(memory.worldNumber === 2 || memory.worldNumber === 5) && (
        <mesh ref={ringRef} rotation={[1.1, 0.4, 0]}>
          <ringGeometry args={[1.8, 2.5, 64]} />
          <meshStandardMaterial
            color={memory.accentColor}
            emissive={memory.accentColor}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Atmospheric Halo */}
      <mesh scale={currentScale * 1.25}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial
          color={memory.accentColor}
          transparent
          opacity={hovered || isHighlighted ? 0.35 : 0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Floating HTML Label on hover or highlight */}
      {(hovered || isHighlighted) && (
        <Html position={[0, 2.4, 0]} center distanceFactor={28}>
          <div className="px-3 py-1.5 rounded-full glass-panel border border-white/20 whitespace-nowrap text-center shadow-lg pointer-events-none animate-fadeIn">
            <p className="text-[10px] font-tech text-rose-300 uppercase tracking-widest">
              World 0{memory.worldNumber}
            </p>
            <p className="font-cinzel text-xs font-bold text-white">
              {memory.title}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

export const PlanetSystem: React.FC<Props> = ({
  memories,
  onSelectPlanet,
  highlightedWorld,
  freezeOrbits = false,
}) => {
  return (
    <group>
      {memories.map((mem) => (
        <SinglePlanet
          key={mem.id}
          memory={mem}
          onSelect={() => onSelectPlanet(mem.worldNumber)}
          isHighlighted={highlightedWorld === mem.worldNumber}
          freezeOrbits={freezeOrbits}
        />
      ))}
    </group>
  );
};
