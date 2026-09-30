import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface Props {
  isActive: boolean;
  onDismiss: () => void;
}

export const HeartEventOverlay: React.FC<Props> = ({ isActive, onDismiss }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-between p-8"
        >
          {/* Subtle rose vignette pulse */}
          <div className="absolute inset-0 bg-radial from-rose-500/10 via-transparent to-transparent animate-pulse" />

          {/* Top Banner */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-rose-500/30 text-rose-300 font-tech text-xs tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          >
            <Heart size={14} className="fill-rose-500 animate-heart-pulse" />
            <span>Harmonic Alignment • HH:43 Heart Event</span>
            <Heart size={14} className="fill-rose-500 animate-heart-pulse" />
          </motion.div>

          {/* Giant Beating Heart Outline in Background Center */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.95, 1.15, 1, 1.15, 0.95],
              opacity: [0.4, 0.8, 0.5, 0.9, 0.4],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-rose-500/40 font-cinzel text-9xl glow-heart pointer-events-none"
          >
            ♥
          </motion.div>

          {/* Bottom dismiss or indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="font-editorial text-xs text-rose-200/70 italic tracking-wider"
          >
            All 5 worlds align to beat as one.
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
