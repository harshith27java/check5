import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { MemoryData } from '../types';
import { soundManager } from '../audio/soundManager';

interface Props {
  memory: MemoryData;
  onNext: () => void;
  onBackToOrbit: () => void;
  nextLabel?: string;
}

export const MemoryOverlay: React.FC<Props> = ({
  memory,
  onNext,
  onBackToOrbit,
  nextLabel = 'Proceed to next milestone',
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <>
      <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-12 overflow-y-auto">
        {/* Top bar with back to orbit */}
        <div className="flex items-center justify-between w-full pointer-events-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onBackToOrbit();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-pill text-xs font-tech tracking-wider uppercase text-neutral-300 hover:text-white"
          >
            <ArrowLeft size={14} />
            <span>Return to Orbit</span>
          </button>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-tech tracking-widest text-neutral-300">
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: memory.accentColor }}
            />
            <span>WORLD 0{memory.worldNumber} / 05</span>
          </div>
        </div>

        {/* Central Memory Content Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto max-w-2xl w-full mx-auto my-8 glass-panel rounded-2xl p-6 md:p-10 border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-3 font-tech text-xs tracking-[0.25em] uppercase">
            <span style={{ color: memory.accentColor }}>{memory.theme}</span>
            <span className="text-white/30">•</span>
            <span className="text-neutral-400">{memory.date}</span>
          </div>

          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-3 tracking-[0.1em] leading-snug">
            {memory.title}
          </h2>

          <p className="font-editorial text-sm text-neutral-300 italic mb-8 tracking-wider">
            "{memory.subtitle}"
          </p>

          <div className="space-y-6 mb-10">
            {memory.message.map((para, i) => (
              <p
                key={i}
                className="font-editorial text-sm md:text-base text-neutral-200 leading-[2.0] tracking-wide"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Floating Memory Photos */}
          {memory.photos && memory.photos.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3 text-xs font-tech uppercase tracking-wider text-neutral-400">
                <ImageIcon size={13} />
                <span>Captured Light</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {memory.photos.map((src, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedPhoto(src);
                    }}
                    className="relative aspect-video rounded-lg overflow-hidden border border-white/10 cursor-pointer group bg-neutral-900/80"
                  >
                    <img
                      src={src}
                      alt={`Memory ${memory.title} #${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                      <span className="text-[10px] font-tech text-white/80">View</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end pt-2 border-t border-white/10">
            <button
              onClick={() => {
                soundManager.playCelestialChime(580);
                onNext();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-tech text-xs tracking-widest uppercase transition-all transform hover:scale-105 active:scale-95"
            >
              <span>{nextLabel}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>

        {/* Empty bottom spacer for balance */}
        <div className="h-6" />
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <div className="relative max-w-3xl max-h-[85vh] rounded-xl overflow-hidden border border-white/20 shadow-2xl">
              <img
                src={selectedPhoto}
                alt="Enlarged memory"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
