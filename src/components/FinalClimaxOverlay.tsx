import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Compass, RotateCcw } from 'lucide-react';
import { experienceConfig } from '../data/config';
import { soundManager } from '../audio/soundManager';

interface Props {
  onRestartUniverse: () => void;
}

export const FinalClimaxOverlay: React.FC<Props> = ({ onRestartUniverse }) => {
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    // Step progression sequence:
    // 0: "Five months."
    // 1: "Five worlds."
    // 2: "Countless moments."
    // 3: The Full Letter + "Happy 5th. ♥"
    const timer1 = setTimeout(() => setStep(1), 2600);
    const timer2 = setTimeout(() => setStep(2), 5200);
    const timer3 = setTimeout(() => {
      setStep(3);
      soundManager.playHeartbeat(50);
    }, 7800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 pointer-events-auto flex items-center justify-center p-6 md:p-12 overflow-y-auto bg-black/60 backdrop-blur-[3px]">
      <div className="max-w-2xl w-full mx-auto text-center py-12">
        {/* Cinematic Lead-in lines */}
        <div className="space-y-6 mb-12">
          <AnimatePresence>
            {step >= 0 && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-cinzel text-3xl md:text-5xl font-light text-white tracking-[0.15em] leading-relaxed"
              >
                Five months.
              </motion.h2>
            )}

            {step >= 1 && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-cinzel text-3xl md:text-5xl font-light text-neutral-300 tracking-[0.15em] leading-relaxed"
              >
                Five worlds.
              </motion.h2>
            )}

            {step >= 2 && (
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2 }}
                className="font-cinzel text-3xl md:text-5xl font-light text-rose-300 tracking-[0.15em] leading-relaxed glow-heart"
              >
                Countless moments.
              </motion.h2>
            )}
          </AnimatePresence>
        </div>

        {/* Main Final Anniversary Letter */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-3xl p-8 md:p-14 border border-white/10 text-left my-8 shadow-2xl"
            >
              <div className="space-y-6 mb-12">
                {experienceConfig.finalSequence.mainMessage.map((para, i) => (
                  <p
                    key={i}
                    className={`font-editorial text-base md:text-lg leading-[2.1] tracking-wide ${
                      i === 0
                        ? 'text-xs font-tech uppercase tracking-[0.25em] text-rose-300/80 font-semibold mb-4'
                        : 'text-neutral-200'
                    }`}
                  >
                    {para}
                  </p>
                ))}
              </div>

              {/* Signature with pulsing heart */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-xl md:text-2xl font-bold text-white tracking-[0.15em]">
                    Happy 5th.
                  </span>
                  <Heart
                    size={22}
                    className="fill-rose-500 text-rose-500 animate-heart-pulse"
                  />
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRestartUniverse();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-pill border border-white/20 text-xs font-tech tracking-wider uppercase text-neutral-200 hover:text-white transition-all transform hover:scale-105"
                >
                  <Compass size={14} className="text-rose-400" />
                  <span>Re-enter Universe</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
