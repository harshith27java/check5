import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BackgroundStars } from './BackgroundStars';
import { CentralSun } from './CentralSun';
import { PlanetSystem } from './PlanetSystem';
import { Planet1Nature } from './Planet1Nature';
import { Planet2Ocean } from './Planet2Ocean';
import { Planet3Constellation } from './Planet3Constellation';
import { Planet4Energy } from './Planet4Energy';
import { MechanicalClock3D } from './MechanicalClock3D';
import { ParticleHeart3D } from './ParticleHeart3D';
import { ParticleNumberFive3D } from './ParticleNumberFive3D';
import { ExperienceState, MemoryData } from '../types';

interface Props {
  currentState: ExperienceState;
  memories: MemoryData[];
  onSelectPlanet: (worldNum: number) => void;
  isHeartEventActive: boolean;
  isClockExploded: boolean;
}

// Internal smooth camera controller
const CameraDirector: React.FC<{
  currentState: ExperienceState;
  isHeartEventActive: boolean;
}> = ({ currentState, isHeartEventActive }) => {
  const targetCamPos = useRef(new THREE.Vector3(0, 0, 25));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // Determine destination camera position based on current experience state
    switch (currentState) {
      case 'AUTH':
        targetCamPos.current.set(0, 0, 30);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'AUTH_TRANSITION':
        targetCamPos.current.set(0, 10, 22);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'UNIVERSE_OVERVIEW':
        targetCamPos.current.set(0, 26, 42);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'WORLD_1':
      case 'INTERLUDE_1':
        targetCamPos.current.set(0, 2, 9);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'WORLD_2':
      case 'INTERLUDE_2':
        targetCamPos.current.set(0, 2, 10);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'WORLD_3':
      case 'INTERLUDE_3':
        targetCamPos.current.set(0, 1, 11);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'WORLD_4':
      case 'INTERLUDE_4':
        targetCamPos.current.set(0, 1.5, 10);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'WORLD_5_TRANSITION':
      case 'CLOCK_VIEW':
        targetCamPos.current.set(0, 0, 12);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'CLIMAX_0500':
        targetCamPos.current.set(0, 0, 16);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'FINAL_NUMBER_5':
        targetCamPos.current.set(0, 0, 12);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'FINAL_MESSAGE':
        targetCamPos.current.set(0, 4, 18);
        targetLookAt.current.set(0, 0, 0);
        break;
      default:
        targetCamPos.current.set(0, 22, 38);
        targetLookAt.current.set(0, 0, 0);
    }

    // Add gentle mouse parallax
    const mouseX = (state.pointer.x || 0) * 1.8;
    const mouseY = (state.pointer.y || 0) * 1.4;

    const actualCamTarget = targetCamPos.current.clone().add(new THREE.Vector3(mouseX, mouseY, 0));

    // Smooth lerp
    state.camera.position.lerp(actualCamTarget, Math.min(delta * 2.2, 0.1));
    state.camera.lookAt(targetLookAt.current);
  });

  return null;
};

export const UniverseCanvas: React.FC<Props> = ({
  currentState,
  memories,
  onSelectPlanet,
  isHeartEventActive,
  isClockExploded,
}) => {
  const orbitRadii = memories.map((m) => m.orbitRadius);
  const showOrbitSystem =
    currentState === 'UNIVERSE_OVERVIEW' ||
    currentState === 'AUTH_TRANSITION';

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto bg-[#030308]">
      <Canvas
        camera={{ position: [0, 20, 40], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#030308']} />

        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 15]} intensity={0.9} color="#ffffff" />
        <pointLight position={[-15, -10, -10]} intensity={0.5} color="#c084fc" />

        <CameraDirector
          currentState={currentState}
          isHeartEventActive={isHeartEventActive}
        />

        {/* Deep Space Background Stars */}
        <BackgroundStars
          count={3200}
          slowDown={isHeartEventActive || currentState === 'CLIMAX_0500'}
        />

        {/* Heart Event takes over space with giant 3D heart */}
        {isHeartEventActive && <ParticleHeart3D scale={1.2} />}

        {/* Main Orbit Solar System */}
        {showOrbitSystem && (
          <>
            <CentralSun orbitRadii={orbitRadii} pulse={isHeartEventActive} />
            <PlanetSystem
              memories={memories}
              onSelectPlanet={onSelectPlanet}
              freezeOrbits={isHeartEventActive}
            />
          </>
        )}

        {/* World 1 Interior: Nature / Beginning */}
        {(currentState === 'WORLD_1' || currentState === 'INTERLUDE_1') && (
          <Planet1Nature />
        )}

        {/* World 2 Interior: Ocean World */}
        {(currentState === 'WORLD_2' || currentState === 'INTERLUDE_2') && (
          <Planet2Ocean />
        )}

        {/* World 3 Interior: Galaxy / Constellation */}
        {(currentState === 'WORLD_3' || currentState === 'INTERLUDE_3') && (
          <Planet3Constellation />
        )}

        {/* World 4 Interior: Energy / Fragmented */}
        {(currentState === 'WORLD_4' || currentState === 'INTERLUDE_4') && (
          <Planet4Energy />
        )}

        {/* World 5 Climax: Giant Mechanical Clock */}
        {(currentState === 'WORLD_5_TRANSITION' ||
          currentState === 'CLOCK_VIEW' ||
          currentState === 'CLIMAX_0500') && (
          <MechanicalClock3D
            isTarget0500={currentState === 'CLIMAX_0500'}
            isExploded={isClockExploded}
          />
        )}

        {/* Climax & Final Reveal: Giant Particle Numeral 5 */}
        {(currentState === 'FINAL_NUMBER_5' ||
          currentState === 'FINAL_MESSAGE') && (
          <ParticleNumberFive3D memories={memories} />
        )}
      </Canvas>
    </div>
  );
};
