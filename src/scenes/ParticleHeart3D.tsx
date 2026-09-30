import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateHeartPoints } from '../utils/particles';

interface Props {
  scale?: number;
}

export const ParticleHeart3D: React.FC<Props> = ({ scale = 1.0 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors] = useMemo(() => {
    const pos = generateHeartPoints(count, 3.2 * scale);
    const cols = new Float32Array(count * 3);

    const rose1 = new THREE.Color('#f43f5e');
    const rose2 = new THREE.Color('#fb7185');
    const gold = new THREE.Color('#fef08a');
    const purple = new THREE.Color('#e879f9');

    for (let i = 0; i < count; i++) {
      const rnd = Math.random();
      const c = rnd > 0.6 ? rose1 : rnd > 0.3 ? rose2 : rnd > 0.15 ? purple : gold;
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    return [pos, cols];
  }, [scale]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      // Gentle heart beat pulse formula
      const beat = 1 + Math.pow(Math.sin(t * 3.5), 63) * 0.18 + Math.pow(Math.sin(t * 3.5 + 0.3), 63) * 0.1;
      pointsRef.current.scale.set(beat, beat, beat);
      pointsRef.current.rotation.y = Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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
  );
};
