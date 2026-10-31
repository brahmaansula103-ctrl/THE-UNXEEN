import React from 'react';
import { GameMode } from '../types';
import { GAME_CONFIGS } from '../utils/lotteryService';
import { ShieldCheck, Volume2, VolumeX, Sparkles, RefreshCw, Cpu } from 'lucide-react';

interface HeaderProps {
  gameMode: GameMode;
  onSelectGameMode: (mode: GameMode) => void;
  isLiveApi: boolean;
  onRefresh: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isRecalculating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  gameMode,
  onSelectGameMode,
  isLiveApi,
  onRefresh,
  soundEnabled,
  onToggleSound,
  isRecalculating,
}) => {
  const games: GameMode[] = ['WinGo_30S', 'WinGo_1M', 'WinGo_3M', 'WinGo_5M'];

  return (
    <header className="w-full pt-3 pb-2 px-3 sm:px-4 max-w-xl mx-auto">
      {/* Top Branding Bar */}
      <div className="flex items-center justify-between mb-3 bg-[#0a1226]/90 border border-blue-900/40 rounded-2xl px-3 py-2 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-wider bg-gradient-to-r from-sky-300 via-blue-200 to-pink-400 bg-clip-text text-transparent font-['Chakra_Petch']">
                THE UNXEEN 🔞
              </span>
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-rose-600 to-amber-500 text-[9px] font-black rounded-md text-white tracking-widest uppercase shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                V14.ZYX PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              {isLiveApi ? 'API LIVE STREAM' : 'V14 NEURAL ENGINE SYNC'}
            </p>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="p-1.5 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors border border-slate-700/50"
            title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onRefresh}
            disabled={isRecalculating}
            aria-label="Force Refresh / Sync"
            className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 hover:text-white hover:bg-blue-600/50 transition-colors border border-blue-500/40"
            title="Recalculate & Sync"
          >
            <RefreshCw className={`w-4 h-4 ${isRecalculating ? 'animate-spin text-cyan-300' : ''}`} />
          </button>
        </div>
      </div>

      {/* Game Mode Tabs matching Screenshot 1 */}
      <div className="grid grid-cols-4 gap-2">
        {games.map((g) => {
          const config = GAME_CONFIGS[g];
          const isActive = gameMode === g;
          return (
            <button
              key={g}
              onClick={() => onSelectGameMode(g)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 relative border ${
                isActive
                  ? 'bg-gradient-to-b from-blue-600 to-blue-800 text-white font-bold border-blue-400/60 shadow-[0_0_20px_rgba(59,130,246,0.45)]'
                  : 'bg-[#091124]/90 text-slate-400 hover:text-slate-200 hover:bg-[#0f1b38] border-slate-800/80'
              }`}
            >
              <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 leading-none">
                {config.intervalSeconds >= 60 ? `${config.intervalSeconds / 60} MINUTE` : `${config.intervalSeconds} SEC`}
              </span>
              <span className="text-xs sm:text-sm font-black tracking-tight mt-0.5">
                {config.shortName}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
