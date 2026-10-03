import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Edit3, Sparkles } from 'lucide-react';
import { experienceConfig } from './data/config';
import { ExperienceConfig, ExperienceState } from './types';
import { useElapsedTimer } from './hooks/useElapsedTimer';
import { useHeartEventDetector } from './hooks/useHeartEventDetector';
import { soundManager } from './audio/soundManager';

// Components
import { AuthScreen } from './components/AuthScreen';
import { AudioController } from './components/AudioController';
import { NavigationHUD } from './components/NavigationHUD';
import { MemoryOverlay } from './components/MemoryOverlay';
import { InterludeView } from './components/InterludeView';
import { ClockOverlay } from './components/ClockOverlay';
import { HeartEventOverlay } from './components/HeartEventOverlay';
import { FinalClimaxOverlay } from './components/FinalClimaxOverlay';
import { UniverseEditorModal } from './components/UniverseEditorModal';

// 3D Canvas
import { UniverseCanvas } from './scenes/UniverseCanvas';

const LOCAL_STORAGE_KEY = 'anniversary_universe_custom_config_v2';

export const App: React.FC = () => {
  // Load optional browser-local edits; fresh browsers use the deployed final config
  const [config, setConfig] = useState<ExperienceConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return experienceConfig;
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentState, setCurrentState] = useState<ExperienceState>('AUTH');
  const [isClockExploded, setIsClockExploded] = useState(false);
  const [isClockAnimating, setIsClockAnimating] = useState(false);

  // Live timer since meeting date
  const elapsed = useElapsedTimer(config.meetingDate);

  // Hourly :43 detector
  const {
    isHeartEventActive,
    triggerManualHeartEvent,
    dismissHeartEvent,
  } = useHeartEventDetector();

  // Save new config
  const handleSaveConfig = (newConfig: ExperienceConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Reset to default template
  const handleResetConfig = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setConfig(experienceConfig);
    soundManager.playCelestialChime(500);
  };

  // Step 1: Successful Auth triggers the universe
  const handleAuthSuccess = useCallback(() => {
    setCurrentState('UNIVERSE_OVERVIEW');
    soundManager.startAmbientSpace();
  }, []);

  // Enter a specific memory world
  const handleSelectWorld = useCallback((worldNum: number) => {
    switch (worldNum) {
      case 1:
        setCurrentState('WORLD_1');
        break;
      case 2:
        setCurrentState('WORLD_2');
        break;
      case 3:
        setCurrentState('WORLD_3');
        break;
      case 4:
        setCurrentState('WORLD_4');
        break;
      case 5:
        setCurrentState('WORLD_5_TRANSITION');
        setTimeout(() => setCurrentState('CLOCK_VIEW'), 1200);
        break;
      default:
        setCurrentState('UNIVERSE_OVERVIEW');
    }
  }, []);

  // Progression from World 1 -> Interlude 1 -> World 2 -> ... -> Clock
  const handleNextFromWorld1 = useCallback(() => {
    setCurrentState('INTERLUDE_1');
  }, []);

  const handleNextFromInterlude1 = useCallback(() => {
    setCurrentState('WORLD_2');
  }, []);

  const handleNextFromWorld2 = useCallback(() => {
    setCurrentState('INTERLUDE_2');
  }, []);

  const handleNextFromInterlude2 = useCallback(() => {
    setCurrentState('WORLD_3');
  }, []);

  const handleNextFromWorld3 = useCallback(() => {
    setCurrentState('INTERLUDE_3');
  }, []);

  const handleNextFromInterlude3 = useCallback(() => {
    setCurrentState('WORLD_4');
  }, []);

  const handleNextFromWorld4 = useCallback(() => {
    setCurrentState('INTERLUDE_4');
  }, []);

  const handleNextFromInterlude4 = useCallback(() => {
    setCurrentState('WORLD_5_TRANSITION');
    setTimeout(() => setCurrentState('CLOCK_VIEW'), 1400);
  }, []);

  // Trigger the 05:00 Climax Event
  const handleTrigger0500 = useCallback(() => {
    setIsClockAnimating(true);
    setCurrentState('CLIMAX_0500');

    // 1. Hands align to 05:00, ticking slows down (3s)
    setTimeout(() => {
      // 2. Clock explodes into gears and stars
      setIsClockExploded(true);
      soundManager.playClimaxExplosion();

      // 3. Heart forms from particles
      setTimeout(() => {
        soundManager.playHeartbeat(45);

        // 4. Particles converge into giant numeral 5
        setTimeout(() => {
          setCurrentState('FINAL_NUMBER_5');
          soundManager.playCelestialChime(784);

          // 5. Final message fades in
          setTimeout(() => {
            setCurrentState('FINAL_MESSAGE');
            setIsClockAnimating(false);
          }, 3500);
        }, 3000);
      }, 2500);
    }, 3200);
  }, []);

  const handleRestartUniverse = useCallback(() => {
    setIsClockExploded(false);
    setCurrentState('UNIVERSE_OVERVIEW');
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030308] select-none">
      {/* 3D WebGL Canvas Layer */}
      {currentState !== 'AUTH' && (
        <UniverseCanvas
          currentState={currentState}
          memories={config.memories}
          onSelectPlanet={handleSelectWorld}
          isHeartEventActive={isHeartEventActive}
          isClockExploded={isClockExploded}
        />
      )}

      {/* Floating Top Left Editor Trigger Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsEditorOpen(true);
        }}
        title="In-App Customization Editor"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full glass-pill text-xs font-tech tracking-wider uppercase text-neutral-300 hover:text-white border border-white/10 hover:border-rose-400/40 shadow-lg transition-all hover:scale-105"
      >
        <Edit3 size={13} className="text-rose-400" />
        <span className="hidden sm:inline">Edit Content</span>
      </button>

      {/* Floating Audio Controller (Top Right) */}
      <AudioController />

      {/* 1. Auth Screen */}
      <AnimatePresence>
        {currentState === 'AUTH' && (
          <AuthScreen onSuccess={handleAuthSuccess} />
        )}
      </AnimatePresence>

      {/* 2. World 1 Overlay */}
      <AnimatePresence>
        {currentState === 'WORLD_1' && (
          <MemoryOverlay
            memory={config.memories[0]}
            onNext={handleNextFromWorld1}
            onBackToOrbit={() => setCurrentState('UNIVERSE_OVERVIEW')}
            nextLabel="To Interlude I"
          />
        )}
      </AnimatePresence>

      {/* Interlude 1 */}
      <AnimatePresence>
        {currentState === 'INTERLUDE_1' && (
          <InterludeView
            data={config.interludes[0]}
            onComplete={handleNextFromInterlude1}
          />
        )}
      </AnimatePresence>

      {/* 3. World 2 Overlay */}
      <AnimatePresence>
        {currentState === 'WORLD_2' && (
          <MemoryOverlay
            memory={config.memories[1]}
            onNext={handleNextFromWorld2}
            onBackToOrbit={() => setCurrentState('UNIVERSE_OVERVIEW')}
            nextLabel="To Interlude II"
          />
        )}
      </AnimatePresence>

      {/* Interlude 2 */}
      <AnimatePresence>
        {currentState === 'INTERLUDE_2' && (
          <InterludeView
            data={config.interludes[1]}
            onComplete={handleNextFromInterlude2}
          />
        )}
      </AnimatePresence>

      {/* 4. World 3 Overlay */}
      <AnimatePresence>
        {currentState === 'WORLD_3' && (
          <MemoryOverlay
            memory={config.memories[2]}
            onNext={handleNextFromWorld3}
            onBackToOrbit={() => setCurrentState('UNIVERSE_OVERVIEW')}
            nextLabel="To Interlude III"
          />
        )}
      </AnimatePresence>

      {/* Interlude 3 */}
      <AnimatePresence>
        {currentState === 'INTERLUDE_3' && (
          <InterludeView
            data={config.interludes[2]}
            onComplete={handleNextFromInterlude3}
          />
        )}
      </AnimatePresence>

      {/* 5. World 4 Overlay */}
      <AnimatePresence>
        {currentState === 'WORLD_4' && (
          <MemoryOverlay
            memory={config.memories[3]}
            onNext={handleNextFromWorld4}
            onBackToOrbit={() => setCurrentState('UNIVERSE_OVERVIEW')}
            nextLabel="To Interlude IV"
          />
        )}
      </AnimatePresence>

      {/* Interlude 4 */}
      <AnimatePresence>
        {currentState === 'INTERLUDE_4' && (
          <InterludeView
            data={config.interludes[3]}
            onComplete={handleNextFromInterlude4}
          />
        )}
      </AnimatePresence>

      {/* 6. Clock View & Climax 05:00 */}
      <AnimatePresence>
        {(currentState === 'CLOCK_VIEW' || currentState === 'CLIMAX_0500') && (
          <ClockOverlay
            elapsed={elapsed}
            onTrigger0500={handleTrigger0500}
            onBackToOrbit={() => setCurrentState('UNIVERSE_OVERVIEW')}
            isClockAnimating={isClockAnimating}
          />
        )}
      </AnimatePresence>

      {/* 7. Hourly :43 Heart Event */}
      <HeartEventOverlay
        isActive={isHeartEventActive}
        onDismiss={dismissHeartEvent}
      />

      {/* 8. Final Climax Letter */}
      <AnimatePresence>
        {currentState === 'FINAL_MESSAGE' && (
          <FinalClimaxOverlay onRestartUniverse={handleRestartUniverse} />
        )}
      </AnimatePresence>

      {/* Subtle Persistent Bottom Navigation HUD */}
      <NavigationHUD
        currentState={currentState}
        onSelectWorld={handleSelectWorld}
        onGoToClock={() => setCurrentState('CLOCK_VIEW')}
        onGoToUniverse={() => setCurrentState('UNIVERSE_OVERVIEW')}
        onTriggerHeartEvent={triggerManualHeartEvent}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* In-App Dynamic Universe Editor Modal */}
      <UniverseEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
      />
    </div>
  );
};

export default App;
