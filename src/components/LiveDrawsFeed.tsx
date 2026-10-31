import React from 'react';
import { DrawRecord } from '../types';
import { Activity, ShieldCheck, Zap, Target } from 'lucide-react';

interface LiveDrawsFeedProps {
  history: DrawRecord[];
  onManualSettle?: () => void;
  onDirectDraw?: (num: number) => void;
}

export const LiveDrawsFeed: React.FC<LiveDrawsFeedProps> = ({
  history,
  onManualSettle,
  onDirectDraw,
}) => {
  const top5 = history.slice(0, 5);

  const getBadgeColor = (num: number) => {
    if ([1, 3, 7, 9].includes(num)) return 'bg-emerald-600 text-white';
    if ([2, 4, 6, 8].includes(num)) return 'bg-rose-600 text-white';
    if (num === 0) return 'bg-gradient-to-r from-rose-600 to-purple-600 text-white';
    return 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white';
  };

  const getBallButtonClass = (num: number) => {
    if (num === 0) return 'bg-gradient-to-b from-rose-600 to-purple-600 border-purple-400 text-white';
    if (num === 5) return 'bg-gradient-to-b from-emerald-600 to-purple-600 border-purple-400 text-white';
    if ([1, 3, 7, 9].includes(num)) return 'bg-gradient-to-b from-emerald-600 to-teal-700 border-emerald-400 text-white';
    return 'bg-gradient-to-b from-rose-600 to-red-700 border-rose-400 text-white';
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 mt-3">
      <div className="rounded-2xl bg-[#091224]/85 border border-blue-900/40 p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-['Rajdhani']">
              OFFICIAL WINGO LIVE DRAW SEQUENCE
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {onManualSettle && (
              <button
                onClick={onManualSettle}
                className="text-[10px] bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold px-2.5 py-1 rounded-lg border border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                title="Auto-draw and settle result immediately with Win/Jackpot check"
              >
                ⚡ AUTO DRAW
              </button>
            )}
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              API ACTIVE
            </span>
          </div>
        </div>

        {/* 1-Tap Live Result Sync Bar for Floating Window */}
        {onDirectDraw && (
          <div className="mb-3.5 bg-[#050b1a] p-2.5 rounded-xl border border-blue-900/50">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 font-['Rajdhani'] tracking-wider">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>SYNC LIVE DRAW (1-TAP RESULT)</span>
              </div>
              <span className="text-[9px] text-cyan-400 font-mono font-bold">
                Auto Win/Loss Check
              </span>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => onDirectDraw(num)}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-lg border transition-all active:scale-90 hover:brightness-125 shadow-md ${getBallButtonClass(
                    num
                  )}`}
                  title={`Settle current issue with result: ${num} (${num >= 5 ? 'BIG' : 'SMALL'})`}
                >
                  <span className="text-xs font-black font-mono leading-none">{num}</span>
                  <span className="text-[8px] opacity-80 leading-none mt-0.5">
                    {num >= 5 ? 'B' : 'S'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5 Latest Draw Balls */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-3">
          {top5.map((item, index) => {
            const isLatest = index === 0;
            return (
              <div
                key={item.issueNumber + index}
                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all ${
                  isLatest
                    ? 'bg-blue-950/70 border-cyan-400/60 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                    : 'bg-[#050b1a] border-slate-800/80'
                }`}
              >
                {isLatest && (
                  <span className="absolute -top-2 bg-cyan-500 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full text-black">
                    LATEST
                  </span>
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${getBadgeColor(
                    item.number
                  )}`}
                >
                  {item.number}
                </div>
                <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase">
                  {item.size}
                </span>
                <span className="text-[8px] text-slate-500 font-mono">
                  #{item.issueNumber.slice(-4)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Security & Neural Signal Status Banner (Formula completely hidden) */}
        <div className="p-3 rounded-xl bg-[#040817] border border-cyan-900/40 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-slate-300">
              V14.ZYX Consensus Core: <strong className="text-emerald-400 font-bold">LOCKED & READY</strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span>Real-Time Stream Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
