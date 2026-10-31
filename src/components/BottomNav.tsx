import React from 'react';
import { Home, Gamepad2, Zap, History, User } from 'lucide-react';

export type ActiveTab = 'home' | 'games' | 'history' | 'profile';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onQuickRecalc: () => void;
  isRecalculating: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onQuickRecalc,
  isRecalculating,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#060c1d]/95 backdrop-blur-lg border-t border-blue-900/40 pb-safe">
      <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* PREDICTION */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'home' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wider mt-1 uppercase font-['Rajdhani']">
            PREDICTION
          </span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_5px_#38bdf8]" />
          )}
        </button>

        {/* GAMES */}
        <button
          onClick={() => onSelectTab('games')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'games' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wider mt-1 uppercase font-['Rajdhani']">
            GAMES
          </span>
          {activeTab === 'games' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_5px_#38bdf8]" />
          )}
        </button>

        {/* Center Floating Action Button (⚡ V14) */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onQuickRecalc}
            aria-label="Calculate / Turbo Sync"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.8)] border-2 border-cyan-300 active:scale-95 transition-all group"
          >
            <Zap
              className={`w-5 h-5 text-yellow-300 ${
                isRecalculating ? 'animate-spin text-white' : 'group-hover:scale-110'
              }`}
            />
            <span className="text-[9px] font-black tracking-tighter uppercase font-mono mt-0.5">
              V14
            </span>
          </button>
        </div>

        {/* HISTORY */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'history' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wider mt-1 uppercase font-['Rajdhani']">
            HISTORY
          </span>
          {activeTab === 'history' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_5px_#38bdf8]" />
          )}
        </button>

        {/* PROFILE */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 transition-colors ${
            activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-wider mt-1 uppercase font-['Rajdhani']">
            PROFILE
          </span>
          {activeTab === 'profile' && (
            <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_5px_#38bdf8]" />
          )}
        </button>
      </div>
    </nav>
  );
};
