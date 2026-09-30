import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../audio/soundManager';

interface Props {
  isTarget0500?: boolean;
  isExploded?: boolean;
}

// Gear component with teeth and inner spokes
const GearMesh: React.FC<{
  radius: number;
  teeth: number;
  speed: number;
  direction?: number;
  color?: string;
  metalness?: number;
  z?: number;
  slowDownFactor?: number;
}> = ({
  radius,
  teeth,
  speed,
  direction = 1,
  color = '#e2e8f0',
  metalness = 0.85,
  z = 0,
  slowDownFactor = 1,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += speed * direction * delta * slowDownFactor;
    }
  });

  const teethMeshes = useMemo(() => {
    return Array.from({ length: teeth }).map((_, i) => {
      const angle = (i / teeth) * Math.PI * 2;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotation: angle,
      };
    });
  }, [radius, teeth]);

  return (
    <group ref={meshRef} position={[0, 0, z]}>
      {/* Outer rim */}
      <mesh>
        <ringGeometry args={[radius * 0.75, radius, 48]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Center hub */}
      <mesh>
        <circleGeometry args={[radius * 0.35, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spokes */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
          <planeGeometry args={[radius * 1.5, 0.12]} />
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Teeth along periphery */}
      {teethMeshes.map((t, idx) => (
        <mesh key={idx} position={[t.x, t.y, 0]} rotation={[0, 0, t.rotation]}>
          <boxGeometry args={[radius * 0.16, radius * 0.12, 0.08]} />
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
};

export const MechanicalClock3D: React.FC<Props> = ({
  isTarget0500 = false,
  isExploded = false,
}) => {
  const clockGroupRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const secondHandRef = useRef<THREE.Group>(null);
  const explosionGroupRef = useRef<THREE.Group>(null);

  // Sound ticking on frame intervals
  const lastTickTime = useRef(0);

  // Exploding flying debris shards
  const debris = useMemo(() => {
    return Array.from({ length: 120 }).map(() => ({
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      ),
      rot: new THREE.Vector3(
        Math.random() * 5,
        Math.random() * 5,
        Math.random() * 5
      ),
    }));
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Occasional sound tick when clock view is active and not exploded
    if (!isExploded && t - lastTickTime.current > 1.0) {
      lastTickTime.current = t;
      soundManager.playClockTick();
    }

    if (isTarget0500) {
      // 05:00 position:
      // Hour hand at 5 o'clock -> 5 * (360/12) = 150 deg = (5/12)*2*PI radians clockwise => -2.618 rad
      // Minute hand at 12 o'clock -> 0 deg => 0 rad
      const targetHourAngle = -((5 / 12) * Math.PI * 2);
      const targetMinAngle = 0;

      if (hourHandRef.current) {
        hourHandRef.current.rotation.z = THREE.MathUtils.lerp(
          hourHandRef.current.rotation.z,
          targetHourAngle,
          delta * 2.0
        );
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.rotation.z = THREE.MathUtils.lerp(
          minuteHandRef.current.rotation.z,
          targetMinAngle,
          delta * 2.0
        );
      }
      if (secondHandRef.current) {
        secondHandRef.current.rotation.z = THREE.MathUtils.lerp(
          secondHandRef.current.rotation.z,
          0,
          delta * 3.0
        );
      }
    } else {
      // Normal continuous clock motion
      if (hourHandRef.current) hourHandRef.current.rotation.z = -t * 0.05;
      if (minuteHandRef.current) minuteHandRef.current.rotation.z = -t * 0.25;
      if (secondHandRef.current) secondHandRef.current.rotation.z = -t * 1.5;
    }

    // Explosion flying outward
    if (isExploded && explosionGroupRef.current) {
      debris.forEach((d) => {
        d.pos.addScaledVector(d.vel, delta);
      });
      explosionGroupRef.current.children.forEach((child, i) => {
        if (debris[i]) {
          child.position.copy(debris[i].pos);
          child.rotation.x += debris[i].rot.x * delta;
          child.rotation.y += debris[i].rot.y * delta;
        }
      });
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {!isExploded && (
        <group ref={clockGroupRef}>
          {/* Dial outer casing ring */}
          <mesh>
            <ringGeometry args={[5.2, 5.7, 64]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.9}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Hour markers around dial */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = Math.cos(angle) * 4.6;
            const y = Math.sin(angle) * 4.6;
            const isFive = i === 5;
            return (
              <mesh key={i} position={[x, y, 0.05]} rotation={[0, 0, angle]}>
                <boxGeometry args={[isFive ? 0.35 : 0.2, 0.08, 0.05]} />
                <meshStandardMaterial
                  color={isFive ? '#f43f5e' : '#ffffff'}
                  emissive={isFive ? '#f43f5e' : '#000000'}
                  emissiveIntensity={isFive ? 1.5 : 0}
                />
              </mesh>
            );
          })}

          {/* Interlocking Gears */}
          <GearMesh
            radius={2.4}
            teeth={24}
            speed={0.4}
            direction={1}
            color="#d97706"
            z={-0.3}
            slowDownFactor={isTarget0500 ? 0.15 : 1}
          />
          <group position={[2.8, 1.8, 0]}>
            <GearMesh
              radius={1.4}
              teeth={14}
              speed={0.7}
              direction={-1}
              color="#fbbf24"
              z={-0.2}
              slowDownFactor={isTarget0500 ? 0.15 : 1}
            />
          </group>
          <group position={[-2.4, -1.9, 0]}>
            <GearMesh
              radius={1.6}
              teeth={16}
              speed={0.6}
              direction={-1}
              color="#f59e0b"
              z={-0.25}
              slowDownFactor={isTarget0500 ? 0.15 : 1}
            />
          </group>
          <group position={[-1.8, 2.5, 0]}>
            <GearMesh
              radius={1.1}
              teeth={12}
              speed={0.9}
              direction={1}
              color="#fb7185"
              z={-0.15}
              slowDownFactor={isTarget0500 ? 0.15 : 1}
            />
          </group>

          {/* Clock Center Boss */}
          <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.3, 32]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Hour Hand */}
          <group ref={hourHandRef} position={[0, 0, 0.12]}>
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[0.18, 2.6, 0.05]} />
              <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 2.7, 0]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.26, 0.26, 0.05]} />
              <meshStandardMaterial color="#f43f5e" />
            </mesh>
          </group>

          {/* Minute Hand */}
          <group ref={minuteHandRef} position={[0, 0, 0.18]}>
            <mesh position={[0, 1.9, 0]}>
              <boxGeometry args={[0.12, 3.8, 0.05]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>

          {/* Second Hand */}
          <group ref={secondHandRef} position={[0, 0, 0.24]}>
            <mesh position={[0, 2.1, 0]}>
              <boxGeometry args={[0.04, 4.4, 0.04]} />
              <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={0.8} />
            </mesh>
          </group>
        </group>
      )}

      {/* Explosion Flying Shards */}
      {isExploded && (
        <group ref={explosionGroupRef}>
          {debris.map((_, i) => (
            <mesh key={i}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#f43f5e' : i % 2 === 0 ? '#fbbf24' : '#38bdf8'}
                emissive="#ffffff"
                emissiveIntensity={0.6}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
