import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

export const AudioController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggle = () => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      soundManager.playClick();
    }
  };

  useEffect(() => {
    // If not muted, start ambient synth on first user interaction
    const unlockAudio = () => {
      soundManager.startAmbientSpace();
      window.removeEventListener('pointerdown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    return () => window.removeEventListener('pointerdown', unlockAudio);
  }, []);

  return (
    <button
      onClick={handleToggle}
      aria-label={isMuted ? 'Unmute cosmic audio' : 'Mute cosmic audio'}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-3 py-2 rounded-full glass-pill text-xs tracking-wider uppercase text-neutral-300 transition-all hover:text-white"
    >
      {isMuted ? (
        <>
          <VolumeX size={15} className="text-neutral-400" />
          <span className="hidden sm:inline font-tech opacity-70">Muted</span>
        </>
      ) : (
        <>
          <Volume2 size={15} className="text-rose-400 animate-pulse" />
          <span className="hidden sm:inline font-tech text-rose-300">Sound On</span>
          {/* Subtle equalizer bars */}
          <div className="flex items-end gap-0.5 h-3 ml-1">
            <span className="w-0.5 bg-rose-400/80 animate-[ping_1.2s_infinite] h-2"></span>
            <span className="w-0.5 bg-rose-400/80 animate-[ping_0.9s_infinite] h-3"></span>
            <span className="w-0.5 bg-rose-400/80 animate-[ping_1.5s_infinite] h-1.5"></span>
          </div>
        </>
      )}
    </button>
  );
};
