import React, { useEffect, useState } from 'react';
import { X, Trophy, Sparkles, Zap, Crown } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface WinPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'WIN' | 'JACKPOT';
  period: string;
  predictedSize: 'BIG' | 'SMALL';
  predictedNumbers: [number, number];
  actualNumber: number;
  actualSize: 'BIG' | 'SMALL';
}

export const WinPopupModal: React.FC<WinPopupModalProps> = ({
  isOpen,
  onClose,
  type,
  period,
  predictedSize,
  predictedNumbers,
  actualNumber,
  actualSize,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const isJackpot = type === 'JACKPOT';

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(5);
      return;
    }

    // Play victory or jackpot sound
    if (isJackpot) {
      sound.playJackpot();
    } else {
      sound.playWin();
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isJackpot, onClose]);

  if (!isOpen) return null;

  const progressPercent = (secondsLeft / 5) * 100;
  const shortPeriod = period.length > 5 ? `#${period.slice(-5)}` : `#${period}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {/* Confetti particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-3 rounded-sm opacity-80 animate-ping ${
              isJackpot
                ? i % 2 === 0 ? 'bg-amber-400' : 'bg-yellow-200'
                : i % 2 === 0 ? 'bg-emerald-400' : 'bg-cyan-300'
            }`}
            style={{
              top: `${(i * 19) % 95}%`,
              left: `${(i * 23) % 95}%`,
              transform: `rotate(${i * 35}deg)`,
              animationDuration: `${1.2 + (i % 3) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Modal Card matching user screenshots */}
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 text-center border-2 shadow-2xl transition-all ${
          isJackpot
            ? 'bg-gradient-to-b from-[#140e02] via-[#0d0901] to-[#050300] border-amber-500/80 shadow-[0_0_50px_rgba(245,158,11,0.6)]'
            : 'bg-gradient-to-b from-[#03150d] via-[#020d08] to-[#010603] border-emerald-500/80 shadow-[0_0_50px_rgba(16,185,129,0.6)]'
        }`}
      >
        {/* Top Header Floating Badge matching Screenshot 1 & 2 */}
        <div className="relative -mt-16 mx-auto flex flex-col items-center mb-2">
          {/* Top Floating Mini Icon */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg mb-1 border ${
              isJackpot
                ? 'bg-amber-500 text-black border-amber-300'
                : 'bg-emerald-500 text-black border-emerald-300'
            }`}
          >
            {isJackpot ? <Crown className="w-4 h-4 fill-black" /> : <Zap className="w-4 h-4 fill-black" />}
          </div>

          {/* Large Cosmic Medal */}
          <div
            className={`w-24 h-24 rounded-full p-1.5 border-4 flex items-center justify-center shadow-[0_0_30px] ${
              isJackpot
                ? 'border-amber-400 shadow-amber-500/60 bg-gradient-to-tr from-amber-600 via-purple-700 to-indigo-900'
                : 'border-emerald-400 shadow-emerald-500/60 bg-gradient-to-tr from-emerald-600 via-teal-700 to-indigo-900'
            }`}
          >
            <div className="w-full h-full rounded-full bg-[#050a18] border-2 border-white/40 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-white/20 to-transparent" />
              <Trophy
                className={`w-10 h-10 ${
                  isJackpot ? 'text-amber-300 animate-bounce' : 'text-emerald-300 animate-pulse'
                }`}
              />
              <span className="text-[8px] font-black tracking-widest text-white/90 uppercase font-mono mt-0.5">
                {isJackpot ? '01 VIP' : 'V14 HIT'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Timer Pill & Close Button */}
        <div className="flex items-center justify-between mt-1 mb-3">
          <div
            className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1 ${
              isJackpot
                ? 'bg-amber-950/70 border-amber-600/50 text-amber-300'
                : 'bg-emerald-950/70 border-emerald-600/50 text-emerald-300'
            }`}
          >
            <span>⏱ CLOSING IN {secondsLeft}S</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title */}
        <h2
          className={`text-3xl sm:text-4xl font-black tracking-wider uppercase font-['Rajdhani'] drop-shadow-md ${
            isJackpot ? 'text-amber-400' : 'text-emerald-400'
          }`}
        >
          {isJackpot ? 'JACKPOT' : 'VICTORY'}
        </h2>

        {/* Subtitle */}
        <p
          className={`text-xs font-bold uppercase tracking-widest mt-0.5 mb-5 font-mono ${
            isJackpot ? 'text-amber-200/90' : 'text-emerald-200/90'
          }`}
        >
          {isJackpot ? '👑 PERFECT NUMBER HIT 👑' : '⚔ KAMIKAZE STRIKE ⚔'}
        </p>

        {/* 3 Stat Boxes matching user screenshots */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {/* PERIOD */}
          <div className="p-2.5 rounded-2xl bg-[#060c1d] border border-slate-800/80 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
              PERIOD
            </span>
            <span className="text-xs font-black font-mono text-white mt-0.5 block truncate">
              {shortPeriod}
            </span>
          </div>

          {/* PREDICTED */}
          <div className="p-2.5 rounded-2xl bg-[#060c1d] border border-slate-800/80 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
              PREDICTED
            </span>
            <span
              className={`text-xs font-black font-mono mt-0.5 block truncate ${
                isJackpot ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {predictedSize} {predictedNumbers[0]}&{predictedNumbers[1]}
            </span>
          </div>

          {/* RESULT */}
          <div className="p-2.5 rounded-2xl bg-[#060c1d] border border-slate-800/80 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
              RESULT
            </span>
            <span
              className={`text-xs font-black font-mono mt-0.5 block truncate ${
                isJackpot ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {actualNumber} {actualSize}
            </span>
          </div>
        </div>

        {/* Main Action Button */}
        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl transition-all active:scale-95 ${
            isJackpot
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black shadow-amber-500/40 hover:brightness-110'
              : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500 text-black shadow-emerald-500/40 hover:brightness-110'
          }`}
        >
          {isJackpot ? 'CLAIM GLORY' : 'CONTINUE'}
        </button>

        {/* Shrinking bottom progress line */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full mt-4 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full ${
              isJackpot ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
