import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Sparkles, Zap } from 'lucide-react';
import { ElapsedTime } from '../utils/time';
import { soundManager } from '../audio/soundManager';

interface Props {
  elapsed: ElapsedTime;
  onTrigger0500: () => void;
  onBackToOrbit: () => void;
  isClockAnimating?: boolean;
}

export const ClockOverlay: React.FC<Props> = ({
  elapsed,
  onTrigger0500,
  onBackToOrbit,
  isClockAnimating = false,
}) => {
  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-6 md:p-12">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <button
          onClick={() => {
            soundManager.playClick();
            onBackToOrbit();
          }}
          className="px-4 py-2 rounded-full glass-pill text-xs font-tech tracking-wider uppercase text-neutral-300 hover:text-white"
        >
          Orbit View
        </button>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-rose-500/20 text-xs font-tech text-rose-300">
          <Clock size={13} className="text-rose-400 animate-spin-slow" />
          <span>CHRONO ARCHIVE • 5TH MONTH</span>
        </div>
      </div>

      {/* Main HUD overlay for the clock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-auto max-w-xl w-full mx-auto text-center glass-panel rounded-3xl p-6 md:p-8 border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-tech tracking-[0.3em] uppercase mb-3">
          <Heart size={13} className="fill-rose-400/80 animate-pulse" />
          <span>SINCE WE MET</span>
          <Heart size={13} className="fill-rose-400/80 animate-pulse" />
        </div>

        <p className="font-tech text-xs text-neutral-400 tracking-[0.2em] mb-6">
          APRIL 30, 2026 • 00:00:00 (ASIA/KOLKATA)
        </p>

        {/* Live Elapsed Counter Numbers */}
        <div className="my-6 py-6 px-8 rounded-2xl bg-black/50 border border-white/10">
          <div className="font-cinzel text-4xl md:text-6xl font-bold tracking-[0.08em] text-white mb-4">
            {elapsed.days}{' '}
            <span className="text-lg md:text-2xl font-light text-rose-300/80 tracking-[0.25em] ml-2">
              DAYS
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 md:gap-8 font-tech text-xl md:text-3xl text-neutral-200">
            <div className="flex flex-col items-center">
              <span className="tabular-nums font-bold text-white tracking-widest">
                {elapsed.formattedHours}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-1.5">
                Hours
              </span>
            </div>
            <span className="text-rose-400 font-bold -translate-y-2">:</span>
            <div className="flex flex-col items-center">
              <span className="tabular-nums font-bold text-white tracking-widest">
                {elapsed.formattedMinutes}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 mt-1.5">
                Minutes
              </span>
            </div>
            <span className="text-rose-400 font-bold -translate-y-2">:</span>
            <div className="flex flex-col items-center">
              <span className="tabular-nums font-bold text-rose-400 tracking-widest">
                {elapsed.formattedSeconds}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-rose-400/80 mt-1.5">
                Seconds
              </span>
            </div>
          </div>
        </div>

        <p className="font-editorial text-xs md:text-sm text-neutral-300 italic mb-8 tracking-wide leading-relaxed">
          Every gear in this universe has ticked in harmony with our hearts.
        </p>

        {/* Action Button to trigger the 05:00 Climax */}
        <button
          disabled={isClockAnimating}
          onClick={() => {
            soundManager.playClockTick();
            onTrigger0500();
          }}
          className="w-full group relative overflow-hidden py-4 px-7 rounded-2xl bg-gradient-to-r from-rose-500/30 via-purple-500/30 to-amber-500/20 hover:from-rose-500/40 hover:to-amber-500/30 border border-rose-400/40 text-white font-cinzel text-sm tracking-[0.18em] uppercase transition-all shadow-[0_0_30px_rgba(244,63,94,0.25)] hover:shadow-[0_0_45px_rgba(244,63,94,0.4)] disabled:opacity-50"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
            <span>Align Clock to 05:00 & Reveal Climax</span>
            <Sparkles size={16} className="text-amber-300 animate-pulse" />
          </span>
        </button>
      </motion.div>

      {/* Bottom hint */}
      <div className="text-center pointer-events-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-black/40 text-[10px] font-tech text-neutral-400 border border-white/5">
          Hourly Event: Universe pulses into a heart at every HH:43
        </span>
      </div>
    </div>
  );
};
