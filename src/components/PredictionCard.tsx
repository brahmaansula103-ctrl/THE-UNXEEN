import React from 'react';
import { PredictionResult } from '../utils/unxeenEngine';
import { Check, Target, Zap, ShieldCheck, Lock, SlidersHorizontal } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  isRecalculating?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  isRecalculating,
}) => {
  const isBig = prediction?.predictedSize === 'BIG';
  const num1 = prediction?.predictedNumbers[0] ?? (isBig ? 7 : 2);
  const num2 = prediction?.predictedNumbers[1] ?? (isBig ? 9 : 3);

  // Ball background colors matching WinGo styles
  const getBallStyle = (num: number) => {
    if ([1, 3, 7, 9].includes(num)) {
      return {
        bg: 'from-emerald-500 to-emerald-700',
        ring: 'border-emerald-300',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      };
    }
    if ([2, 4, 6, 8].includes(num)) {
      return {
        bg: 'from-rose-500 to-rose-700',
        ring: 'border-rose-300',
        glow: 'shadow-[0_0_20px_rgba(244,63,94,0.5)]',
      };
    }
    if (num === 0) {
      return {
        bg: 'from-rose-600 via-purple-600 to-indigo-600',
        ring: 'border-purple-300',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
      };
    }
    // 5
    return {
      bg: 'from-emerald-600 via-purple-600 to-indigo-600',
      ring: 'border-purple-300',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
    };
  };

  const ball1Style = getBallStyle(num1);
  const ball2Style = getBallStyle(num2);

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 mt-3">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#081125] to-[#040816] border border-blue-800/40 p-4 sm:p-5 shadow-[0_10px_35px_rgba(2,6,23,0.95)]">
        {/* Top Prediction Bar (No Pattern Option to Protect IP) */}
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8] animate-pulse" />
            <span className="text-xs font-black tracking-widest text-sky-200 uppercase font-['Rajdhani']">
              PREDICTION
            </span>
            <span className="text-[10px] bg-blue-950/80 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800/50">
              ISSUE #{prediction?.issueNumber.slice(-5) || 'NEXT'}
            </span>
          </div>

          {prediction?.isInverted ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-300 text-[10px] font-mono font-black shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              ⚡ ULTA (POST-LOSS)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AUTO-SIGNAL ACTIVE
            </div>
          )}
        </div>

        {/* Center Section: Glowing Big/Small Circle */}
        <div className="flex flex-col items-center justify-center my-4">
          <div className="relative group">
            {/* Ambient Pulse Glow */}
            <div
              className={`absolute -inset-2 rounded-full blur-xl opacity-60 animate-pulse transition-colors ${
                isBig ? 'bg-blue-500' : 'bg-amber-500'
              }`}
            />

            {/* Main Orb */}
            <div
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-2 shadow-2xl transition-all duration-300 ${
                isBig
                  ? 'bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 border-blue-300 shadow-[0_0_35px_rgba(59,130,246,0.7)]'
                  : 'bg-gradient-to-b from-amber-500 via-orange-600 to-amber-700 border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.7)]'
              }`}
            >
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-md">
                {isBig ? 'B' : 'S'}
              </span>
              <span className="text-xs sm:text-sm font-black text-white/95 uppercase tracking-widest mt-0.5">
                {prediction?.predictedSize || 'CALCULATING'}
              </span>

              {/* Verified Green Badge Checkmark */}
              <div className="absolute top-1 right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-[#081125] flex items-center justify-center text-white shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Dual Number Lottery Balls */}
          <div className="flex items-center gap-3 mt-4">
            {/* Ball 1 */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-b ${ball1Style.bg} border-2 border-dashed ${ball1Style.ring} ${ball1Style.glow} flex items-center justify-center relative shadow-lg transform transition-transform hover:scale-105`}
              >
                <span className="text-white font-black text-lg font-mono drop-shadow-md">
                  {num1}
                </span>
                <span className="absolute -top-1 text-[8px] text-yellow-300">★</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1">#{num1}</span>
            </div>

            {/* Plus sign */}
            <span className="text-cyan-400 font-bold text-lg font-mono">+</span>

            {/* Ball 2 */}
            <div className="relative flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-b ${ball2Style.bg} border-2 border-dashed ${ball2Style.ring} ${ball2Style.glow} flex items-center justify-center relative shadow-lg transform transition-transform hover:scale-105`}
              >
                <span className="text-white font-black text-lg font-mono drop-shadow-md">
                  {num2}
                </span>
                <span className="absolute -top-1 text-[8px] text-yellow-300">★</span>
              </div>
              <span className="text-[9px] text-slate-400 font-mono mt-1">#{num2}</span>
            </div>
          </div>
        </div>

        {/* Prediction Summary Badge */}
        <div className="rounded-2xl bg-[#060c1c]/90 border border-blue-900/40 p-3 text-center my-2 shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-blue-400 font-black text-sm tracking-wider uppercase">
            <span>{prediction?.predictedSize}</span>
            <Target className="w-4 h-4 text-rose-500 inline" />
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5 font-['Rajdhani'] font-bold">
            NUMBER PREDICTION
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-widest mt-0.5">
            {num1} / {num2}
          </div>
          {prediction?.isInverted && (
            <div className="text-[10px] text-amber-400 font-mono font-bold mt-1 bg-amber-950/40 border border-amber-800/40 rounded-lg py-0.5 px-2 inline-block">
              ⚡ ULTA PREDICTION ACTIVE (LOSS RECOVERY)
            </div>
          )}
        </div>

        {/* Confidence Meter */}
        <div className="mt-3 px-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Zap className="w-3.5 h-3.5" />
              CONFIDENCE {prediction?.confidence || 88}%
            </span>
            <span className="text-slate-500 text-[10px] font-mono">
              V14.ZYX PRO CALIBRATED
            </span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={{ width: `${prediction?.confidence || 88}%` }}
            />
          </div>
        </div>

        {/* Encrypted VIP AI Footer (No formula or patterns exposed) */}
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-blue-900/30 text-[11px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-ping" />
              <span>SERVER AI CONSENSUS ENGINE</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
              <Lock className="w-3 h-3 text-cyan-400" />
              <span>ENCRYPTED V14 VIP</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-[#050b1a] px-3 py-2 rounded-xl border border-blue-900/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-white font-mono font-bold">
                  ALGO: 🔞 UNXEEN V14.ZYX QUANTUM
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Multi-Factor Probability Lock • Auto-Calibrated
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              LOCKED 🔒
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
