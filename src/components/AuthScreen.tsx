import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle } from 'lucide-react';
import { ErrorModal143 } from './ErrorModal143';
import { soundManager } from '../audio/soundManager';

interface Props {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onSuccess }) => {
  const [showError143, setShowError143] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'black' | 'heart' | 'stars'>('idle');

  const handleWrongAnswer = () => {
    setShowError143(true);
  };

  const handleCorrectAnswer = () => {
    soundManager.playClick();
    setIsTransitioning(true);
    setTransitionPhase('black');

    // 1. Black pause (800ms)
    setTimeout(() => {
      setTransitionPhase('heart');
      soundManager.playHeartbeat(50);

      // 2. Heart beats once, then stars burst
      setTimeout(() => {
        setTransitionPhase('stars');
        soundManager.playCelestialChime(528);

        // 3. Enter main universe
        setTimeout(() => {
          onSuccess();
        }, 2200);
      }, 1600);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#030308] text-white">
      {/* Birth of Universe Transition Sequence */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-[#030308] flex items-center justify-center pointer-events-none"
          >
            {transitionPhase === 'heart' && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{
                  scale: [0.1, 1.4, 1, 1.5, 0.2],
                  opacity: [0, 1, 0.8, 1, 0],
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="text-rose-500 font-cinzel text-7xl md:text-8xl glow-heart"
              >
                ♥
              </motion.div>
            )}

            {transitionPhase === 'stars' && (
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Thousands of particle stars bursting from center */}
                {[...Array(60)].map((_, i) => {
                  const angle = (i / 60) * Math.PI * 2;
                  const dist = 600 + Math.random() * 800;
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0.8 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        opacity: [1, 1, 0.2],
                        scale: [0.8, 2.5, 0.5],
                      }}
                      transition={{ duration: 2.0, ease: 'easeOut' }}
                      className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ffffff]"
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mysterious Auth Screen */}
      {!isTransitioning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full mx-auto text-center"
        >
          {/* Subtle icon */}
          <div className="flex items-center justify-center mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping mr-2" />
            <span className="font-tech text-[11px] tracking-[0.3em] uppercase text-neutral-400">
              Identity Verification
            </span>
          </div>

          <h3 className="font-editorial text-sm md:text-base text-neutral-400 mb-4 font-light tracking-wider">
            One very important question...
          </h3>

          <h1 className="font-cinzel text-3xl md:text-4xl font-bold tracking-[0.12em] text-white mb-12 leading-relaxed glow-text-subtle">
            English or Spanish?
          </h1>

          {/* Three explicit choices */}
          <div className="space-y-4">
            <button
              onClick={handleWrongAnswer}
              className="w-full py-4 px-6 rounded-xl glass-panel border border-white/10 hover:border-white/25 text-neutral-200 hover:text-white font-editorial text-sm tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              English
            </button>

            <button
              onClick={handleWrongAnswer}
              className="w-full py-4 px-6 rounded-xl glass-panel border border-white/10 hover:border-white/25 text-neutral-200 hover:text-white font-editorial text-sm tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Spanish
            </button>

            <button
              onClick={handleCorrectAnswer}
              className="w-full py-4 px-6 rounded-xl glass-panel border border-rose-500/20 hover:border-rose-400/50 bg-rose-500/5 hover:bg-rose-500/15 text-rose-100 font-editorial text-sm font-medium tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(244,63,94,0.12)]"
            >
              I'm not gay
            </button>
          </div>

          <p className="mt-12 font-tech text-[10px] text-neutral-400 uppercase tracking-[0.3em]">
            A universe awaits on the other side
          </p>
        </motion.div>
      )}

      {/* 143 Error Modal */}
      <AnimatePresence>
        {showError143 && (
          <ErrorModal143 onRetry={() => setShowError143(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
