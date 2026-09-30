import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { generateNumberFivePoints } from '../utils/particles';
import { MemoryData } from '../types';

interface Props {
  memories: MemoryData[];
}

export const ParticleNumberFive3D: React.FC<Props> = ({ memories }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 4200;

  // Particle positions forming the numeral 5
  const [targetPositions, randomPositions, colors] = useMemo(() => {
    const targets = generateNumberFivePoints(count, 1.4);
    const randoms = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const rose = new THREE.Color('#f43f5e');
    const gold = new THREE.Color('#fbbf24');
    const white = new THREE.Color('#ffffff');
    const purple = new THREE.Color('#c084fc');

    for (let i = 0; i < count; i++) {
      // Dispersed positions throughout space
      randoms[i * 3] = (Math.random() - 0.5) * 50;
      randoms[i * 3 + 1] = (Math.random() - 0.5) * 50;
      randoms[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const rnd = Math.random();
      const c = rnd > 0.5 ? rose : rnd > 0.3 ? gold : rnd > 0.15 ? purple : white;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [targets, randoms, cols];
  }, []);

  // Float array for current animated positions
  const currentPositions = useMemo(() => new Float32Array(randomPositions), [randomPositions]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    // Smoothly converge particles into the number 5
    for (let i = 0; i < count * 3; i++) {
      arr[i] += (targetPositions[i] - arr[i]) * Math.min(delta * 2.2, 0.15);
    }
    posAttr.needsUpdate = true;

    // Gentle floating breathing of the 5
    pointsRef.current.rotation.y = Math.sin(Date.now() * 0.0008) * 0.08;
  });

  return (
    <group position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.65}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Floating miniature memory thumbnails embedded into the number 5 */}
      {memories.map((mem, idx) => {
        // Place each thumbnail at distinct points of the numeral 5
        const offsets = [
          [-2.2, 3.8, 0.4], // Top left of horizontal bar
          [1.8, 3.8, 0.4],  // Top right of horizontal bar
          [-2.0, 1.8, 0.4], // Mid stem
          [1.8, -0.6, 0.4], // Outer loop curve
          [-1.0, -2.6, 0.4],// Bottom tail
        ];
        const [x, y, z] = offsets[idx % offsets.length];

        return (
          <group key={mem.id} position={[x, y, z]}>
            <Html center distanceFactor={22}>
              <div className="group relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border border-white/30 shadow-[0_0_15px_rgba(244,63,94,0.4)] bg-black/60 pointer-events-auto transition-transform hover:scale-150 z-20">
                <img
                  src={mem.photos[0] || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=400&q=80'}
                  alt={mem.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
