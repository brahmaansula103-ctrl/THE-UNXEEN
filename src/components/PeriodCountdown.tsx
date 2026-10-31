import React from 'react';
import { Clock, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface PeriodCountdownProps {
  currentPeriod: string;
  secondsRemaining: number;
  totalSeconds: number;
  onOpenSync: () => void;
  gameShortName: string;
}

export const PeriodCountdown: React.FC<PeriodCountdownProps> = ({
  currentPeriod,
  secondsRemaining,
  totalSeconds,
  onOpenSync,
  gameShortName,
}) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isUrgent = secondsRemaining <= 5;

  // Percentage for progress bar
  const progressPercent = ((totalSeconds - secondsRemaining) / totalSeconds) * 100;

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 mt-2">
      <div className="relative overflow-hidden rounded-2xl bg-[#091224]/90 border border-blue-900/50 p-4 shadow-[0_4px_25px_rgba(3,7,18,0.8)] backdrop-blur-md">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          {/* Left: Current Period */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-widest font-['Rajdhani']">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-pulse" />
              CURRENT PERIOD ({gameShortName})
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base sm:text-lg font-mono font-black text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                {currentPeriod || '---'}
              </span>
              <button
                type="button"
                onClick={onOpenSync}
                className="p-1 rounded-md bg-blue-950/80 border border-blue-800/60 text-cyan-300 hover:text-white transition-colors"
                title="Calibrate / Sync Issue Number"
              >
                <SlidersHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right: Next Draw Countdown Clock */}
          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-['Rajdhani'] flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              NEXT DRAW
            </div>
            <div
              className={`text-2xl sm:text-3xl font-mono font-black tracking-widest mt-0.5 transition-colors duration-200 ${
                isUrgent
                  ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-pulse'
                  : 'text-[#38bdf8] drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]'
              }`}
            >
              {formattedTimer}
            </div>
          </div>
        </div>

        {/* Minimalist timer progress line at the bottom */}
        <div className="w-full h-1 bg-slate-800/80 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isUrgent
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
