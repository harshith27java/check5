import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe, Heart, Sparkles, Edit3 } from 'lucide-react';
import { ExperienceState } from '../types';
import { soundManager } from '../audio/soundManager';

interface Props {
  currentState: ExperienceState;
  onSelectWorld: (worldNum: number) => void;
  onGoToClock: () => void;
  onGoToUniverse: () => void;
  onTriggerHeartEvent: () => void;
  onOpenEditor: () => void;
}

export const NavigationHUD: React.FC<Props> = ({
  currentState,
  onSelectWorld,
  onGoToClock,
  onGoToUniverse,
  onTriggerHeartEvent,
  onOpenEditor,
}) => {
  // Only show when inside the universe
  if (currentState === 'AUTH' || currentState === 'AUTH_TRANSITION') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-1.5 rounded-full glass-panel border border-white/10 shadow-2xl"
      >
        {/* Universe Orbit Overview button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoToUniverse();
          }}
          title="Universe Overview"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tech tracking-wider uppercase transition-all ${
            currentState === 'UNIVERSE_OVERVIEW'
              ? 'bg-white/20 text-white font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Globe size={13} />
          <span className="hidden sm:inline">Universe</span>
        </button>

        <span className="w-px h-4 bg-white/10" />

        {/* 5 World Dots */}
        <div className="flex items-center gap-1 px-1">
          {[1, 2, 3, 4, 5].map((num) => {
            const isActive =
              currentState === `WORLD_${num}` ||
              (currentState === 'WORLD_5_TRANSITION' && num === 5);

            return (
              <button
                key={num}
                onClick={() => {
                  soundManager.playClick();
                  onSelectWorld(num);
                }}
                title={`Enter Memory World ${num}`}
                className={`relative w-7 h-7 rounded-full flex items-center justify-center font-tech text-xs transition-all ${
                  isActive
                    ? 'bg-rose-500/30 text-rose-200 border border-rose-400 font-bold scale-110'
                    : 'text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{num}</span>
                {isActive && (
                  <span className="absolute -bottom-1 w-1 h-1 bg-rose-400 rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        <span className="w-px h-4 bg-white/10" />

        {/* Clock Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onGoToClock();
          }}
          title="The Mechanical Clock"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tech tracking-wider uppercase transition-all ${
            currentState === 'CLOCK_VIEW' || currentState === 'CLIMAX_0500'
              ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock size={13} className="text-amber-400" />
          <span className="hidden sm:inline">Clock</span>
        </button>

        {/* Heart event preview button */}
        <button
          onClick={() => {
            soundManager.playHeartbeat();
            onTriggerHeartEvent();
          }}
          title="Pulse :43 Heart Event"
          className="p-1.5 rounded-full text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Heart size={14} className="fill-rose-400/40" />
        </button>

        <span className="w-px h-4 bg-white/10" />

        {/* In-App Editor Trigger */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenEditor();
          }}
          title="Customize Photos & Content"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-tech tracking-wider uppercase text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all hover:scale-105"
        >
          <Edit3 size={12} />
          <span className="hidden md:inline">Edit</span>
        </button>
      </motion.div>
    </div>
  );
};
