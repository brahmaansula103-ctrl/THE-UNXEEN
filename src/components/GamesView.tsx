import React from 'react';
import { GameMode, DrawRecord } from '../types';
import { GAME_CONFIGS } from '../utils/lotteryService';
import { Gamepad2, TrendingUp, Radio, Activity, Check } from 'lucide-react';

interface GamesViewProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  history: DrawRecord[];
}

export const GamesView: React.FC<GamesViewProps> = ({
  gameMode,
  onSelectGameMode,
  history,
}) => {
  const games: GameMode[] = ['WinGo_30S', 'WinGo_1M', 'WinGo_3M', 'WinGo_5M'];

  // Calculate statistics from current history
  const total = history.length || 1;
  const bigCount = history.filter((h) => h.size === 'BIG').length;
  const smallCount = history.filter((h) => h.size === 'SMALL').length;
  const bigPercent = Math.round((bigCount / total) * 100);
  const smallPercent = Math.round((smallCount / total) * 100);

  // Number frequency
  const counts: Record<number, number> = {};
  for (let i = 0; i <= 9; i++) counts[i] = 0;
  history.forEach((h) => {
    counts[h.number] = (counts[h.number] || 0) + 1;
  });

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 pb-24 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.6)]">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider font-['Rajdhani']">
            SUPPORTED WINGO GAMES
          </h1>
          <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
            Select Interval & Trend Analytics
          </p>
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {games.map((g) => {
          const cfg = GAME_CONFIGS[g];
          const isSelected = gameMode === g;
          return (
            <button
              key={g}
              onClick={() => onSelectGameMode(g)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#0c1c44] to-[#071129] border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-cyan-400'
                  : 'bg-[#081125] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-white tracking-wide font-['Rajdhani']">
                  {cfg.name}
                </span>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-cyan-500 text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-1">
                Interval: {cfg.intervalSeconds}s • {Math.round(86400 / cfg.intervalSeconds)} Draws/Day
              </div>
              <div className="text-[10px] text-cyan-400/80 font-mono mt-2 truncate">
                Endpoint: /{cfg.apiPath}
              </div>
            </button>
          );
        })}
      </div>

      {/* Big vs Small Ratio */}
      <div className="p-4 rounded-2xl bg-[#081125] border border-blue-900/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 font-['Rajdhani']">
          <span className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            BIG VS SMALL TREND (LAST {total} DRAWS)
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Real-Time Data</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span className="text-blue-400">BIG ({bigCount}) - {bigPercent}%</span>
            <span className="text-amber-400">SMALL ({smallCount}) - {smallPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${bigPercent}%` }}
            />
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
              style={{ width: `${smallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hot Number Distribution (0-9) */}
      <div className="p-4 rounded-2xl bg-[#081125] border border-blue-900/40">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 font-['Rajdhani'] mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          NUMBER FREQUENCY DISTRIBUTION (0–9)
        </div>

        <div className="grid grid-cols-10 gap-1.5">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const freq = counts[num] || 0;
            const isHot = freq >= 4;
            return (
              <div
                key={num}
                className={`flex flex-col items-center p-1.5 rounded-xl border text-center transition-all ${
                  isHot
                    ? 'bg-emerald-950/70 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-[#050b1a] border-slate-800'
                }`}
              >
                <span className="text-sm font-black font-mono text-white">{num}</span>
                <span className="text-[9px] font-bold text-slate-400 font-mono mt-0.5">
                  {freq}x
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
