import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface Props {
  onRetry: () => void;
}

export const ErrorModal143: React.FC<Props> = ({ onRetry }) => {
  useEffect(() => {
    soundManager.playRejectionSound();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      {/* Floating background heart particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: `${(i * 7) % 100}vw`,
              y: '105vh',
              opacity: 0,
              scale: 0.5 + Math.random() * 0.8,
            }}
            animate={{
              y: '-10vh',
              opacity: [0, 0.7, 0.9, 0],
              x: `${((i * 7) % 100) + (Math.random() - 0.5) * 8}vw`,
            }}
            transition={{
              duration: 3 + Math.random() * 2.5,
              repeat: Infinity,
              delay: i * 0.25,
              ease: 'easeOut',
            }}
            className="absolute text-rose-400/60"
          >
            ♥
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="relative max-w-sm w-full glass-panel border border-rose-500/30 rounded-2xl p-6 text-center animate-cute-shake shadow-[0_0_50px_rgba(244,63,94,0.2)]"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-rose-500/20 blur-2xl rounded-full pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-2 text-rose-400 text-xs tracking-widest font-tech uppercase">
          <Heart size={14} className="fill-rose-400 animate-heart-pulse" />
          <span>ACCESS DENIED</span>
          <Heart size={14} className="fill-rose-400 animate-heart-pulse" />
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.95, 1.05, 1] }}
          transition={{ duration: 0.4 }}
          className="my-5 font-cinzel text-5xl font-black tracking-[0.2em] text-white glow-heart"
        >
          143
        </motion.div>

        <p className="font-editorial text-sm text-neutral-200 leading-loose tracking-wide px-3 my-6">
          Hearts detected, but apparently the answer was wrong...
          <br />
          <span className="text-xs text-rose-300/80 italic mt-2.5 block tracking-wider">
            (You know what the only acceptable answer is)
          </span>
        </p>

        <button
          onClick={() => {
            soundManager.playClick();
            onRetry();
          }}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 border border-rose-400/40 text-rose-100 font-editorial text-sm tracking-wider transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw size={15} className="animate-spin-slow" />
          <span>Try again</span>
        </button>
      </motion.div>
    </div>
  );
};
