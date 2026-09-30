import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';

interface StarNode {
  id: number;
  position: [number, number, number];
  title: string;
  date: string;
  quote: string;
}

export const Planet3Constellation: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [activeStar, setActiveStar] = useState<StarNode | null>(null);

  // 5 constellation key memory stars
  const constellationStars: StarNode[] = useMemo(
    () => [
      { id: 1, position: [-3.5, 2.2, 0], title: 'Midnight Call', date: 'Late June', quote: 'Laughed until our cheeks hurt.' },
      { id: 2, position: [-1.2, 3.8, 1.2], title: 'Stargazing Bench', date: 'July 04', quote: 'Finding Orion in silence.' },
      { id: 3, position: [1.8, 2.6, -0.8], title: 'The Playlist', date: 'July 18', quote: 'Song #5 on repeat.' },
      { id: 4, position: [3.4, -0.8, 0.5], title: 'Unplanned Detour', date: 'August 02', quote: 'Getting lost was the highlight.' },
      { id: 5, position: [0.2, -2.5, -1.0], title: 'Quiet Agreement', date: 'August 24', quote: 'No words needed anymore.' },
    ],
    []
  );

  // Connect the constellation stars in order
  const linePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const ordered = [...constellationStars, constellationStars[0]];
    ordered.forEach((star) => {
      pts.push(new THREE.Vector3(...star.position));
    });
    return pts;
  }, [constellationStars]);

  // Ambient dust stars
  const dustCount = 800;
  const [dustPositions] = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return [pos];
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient background stardust */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.35} color="#c084fc" transparent opacity={0.6} />
      </points>

      {/* Constellation lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(linePoints.flatMap((p) => [p.x, p.y, p.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.6} linewidth={1.5} />
      </line>

      {/* Interactive Constellation Star Nodes */}
      {constellationStars.map((star) => (
        <group key={star.id} position={star.position}>
          <mesh
            onClick={(e) => {
              e.stopPropagation();
              soundManager.playCelestialChime(500 + star.id * 80);
              setActiveStar(activeStar?.id === star.id ? null : star);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
            }}
          >
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#c084fc"
              emissiveIntensity={1.8}
            />
          </mesh>

          {/* Glowing pulse ring around each star */}
          <mesh>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color="#a855f7" transparent opacity={0.25} />
          </mesh>

          {/* Star tooltip HTML card */}
          {activeStar?.id === star.id && (
            <Html position={[0, 0.6, 0]} center distanceFactor={15}>
              <div className="glass-panel p-3 rounded-xl border border-purple-400/40 text-left min-w-[180px] shadow-2xl pointer-events-auto">
                <span className="text-[9px] font-tech text-purple-300 uppercase tracking-wider block">
                  {star.date}
                </span>
                <h4 className="font-cinzel text-xs font-bold text-white mb-1">
                  {star.title}
                </h4>
                <p className="font-editorial text-[11px] text-neutral-300 italic">
                  "{star.quote}"
                </p>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};
