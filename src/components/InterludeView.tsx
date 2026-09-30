import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { InterludeData } from '../types';
import { soundManager } from '../audio/soundManager';

interface Props {
  data: InterludeData;
  onComplete: () => void;
}

export const InterludeView: React.FC<Props> = ({ data, onComplete }) => {
  const [currentParaIndex, setCurrentParaIndex] = useState<number>(0);

  const handleNextParagraph = () => {
    soundManager.playClick();
    if (currentParaIndex < data.paragraphs.length - 1) {
      setCurrentParaIndex((prev) => prev + 1);
    } else {
      soundManager.playCelestialChime(660);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-6 md:p-12 pointer-events-auto bg-black/40 backdrop-blur-[2px]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl w-full mx-auto text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-3 text-neutral-400 text-xs font-tech tracking-[0.25em] uppercase">
          <Sparkles size={12} className="text-amber-300/70" />
          <span>Interlude</span>
          <Sparkles size={12} className="text-amber-300/70" />
        </div>

        <h2 className="font-cinzel text-2xl md:text-3xl font-semibold text-white/95 mb-3 tracking-[0.1em] leading-relaxed glow-text-subtle">
          {data.title}
        </h2>

        {data.subtitle && (
          <p className="font-tech text-xs text-neutral-400 mb-10 tracking-[0.2em]">
            {data.subtitle}
          </p>
        )}

        {/* Revealed Paragraphs */}
        <div className="space-y-7 text-left my-10 min-h-[180px] flex flex-col justify-center">
          {data.paragraphs.slice(0, currentParaIndex + 1).map((para, idx) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial text-base md:text-lg text-neutral-200/95 leading-[2.1] font-light tracking-[0.03em] pl-6 border-l-2 border-rose-400/30"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Action button */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={handleNextParagraph}
            className="group flex items-center gap-2.5 px-7 py-3 rounded-full glass-pill border border-white/20 text-neutral-200 hover:text-white font-tech text-xs tracking-[0.2em] uppercase transition-all transform hover:scale-105"
          >
            <span>
              {currentParaIndex < data.paragraphs.length - 1
                ? 'Continue reading'
                : 'Enter next world'}
            </span>
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Reading progress dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {data.paragraphs.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx <= currentParaIndex
                  ? 'w-6 bg-white/70'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
