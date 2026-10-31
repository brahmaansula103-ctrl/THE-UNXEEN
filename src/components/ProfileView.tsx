import React, { useState, useEffect } from 'react';
import { User, Shield, Sparkles, Key, Globe, Volume2, Save, Check, Award, RefreshCw } from 'lucide-react';
import { DEFAULT_API_URL } from '../utils/lotteryService';
import { StatsSummary } from '../types';

interface ProfileViewProps {
  stats: StatsSummary;
  onUpdateApiUrl: (url: string) => void;
  onUpdatePeriodOffset: (offset: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  stats,
  onUpdateApiUrl,
  onUpdatePeriodOffset,
  soundEnabled,
  onToggleSound,
}) => {
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem('unxeen_profile_name') || 'THE UNXEEN 🔞 VIP';
  });

  const [vipBadge, setVipBadge] = useState<string>(() => {
    return localStorage.getItem('unxeen_vip_badge') || 'V14.ZYX PRO LIFETIME';
  });

  const [apiUrl, setApiUrl] = useState<string>(() => {
    return localStorage.getItem('unxeen_custom_api_url_v14') || DEFAULT_API_URL;
  });

  const [periodOffset, setPeriodOffset] = useState<number>(() => {
    const saved = localStorage.getItem('unxeen_period_offset');
    return saved ? parseInt(saved, 10) : 52187;
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    localStorage.setItem('unxeen_profile_name', profileName);
    localStorage.setItem('unxeen_vip_badge', vipBadge);
    localStorage.setItem('unxeen_custom_api_url_v14', apiUrl);
    localStorage.setItem('unxeen_period_offset', periodOffset.toString());

    onUpdateApiUrl(apiUrl);
    onUpdatePeriodOffset(periodOffset);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetApi = () => {
    setApiUrl(DEFAULT_API_URL);
    setPeriodOffset(52187);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 pb-28 space-y-4">
      {/* Header Profile Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1938] via-[#071129] to-[#040817] border border-blue-800/50 p-5 shadow-2xl">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
            <User className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white font-['Rajdhani'] tracking-wide">
                {profileName || 'THE UNXEEN VIP'}
              </h1>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-600/60 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                {vipBadge || 'V14.ZYX PRO'}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                ID: #UNX-7749
              </span>
            </div>
          </div>
        </div>

        {/* Mini Performance Bar */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-blue-900/40 text-center font-mono">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Win Rate</span>
            <span className="text-base font-black text-emerald-400">{stats.winRate}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Wins</span>
            <span className="text-base font-black text-cyan-400">{stats.wins}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Jackpots</span>
            <span className="text-base font-black text-amber-400">{stats.jackpots}</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Name and VIP Title */}
        <div className="rounded-2xl bg-[#081125] border border-blue-900/40 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-['Rajdhani']">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            PROFILE IDENTITY SETTINGS
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#040816] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              placeholder="Enter your VIP Profile name"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
              VIP Tier Title
            </label>
            <input
              type="text"
              value={vipBadge}
              onChange={(e) => setVipBadge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#040816] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              placeholder="e.g. V14.ZYX PRO MASTER"
            />
          </div>
        </div>

        {/* API Endpoint & Period Calibration Settings */}
        <div className="rounded-2xl bg-[#081125] border border-blue-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-['Rajdhani']">
              <Globe className="w-4 h-4 text-cyan-400" />
              API & PERIOD CALIBRATION
            </div>
            <button
              type="button"
              onClick={handleResetApi}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Defaults
            </button>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
              WinGo History API URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#040816] border border-slate-700 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-400"
              placeholder="https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?t="
            />
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Official endpoint for live results. Falls back seamlessly to continuous engine if WAF restricts direct fetch.
            </p>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Base Period Number Offset (e.g. 52187)
            </label>
            <input
              type="number"
              value={periodOffset}
              onChange={(e) => setPeriodOffset(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 rounded-xl bg-[#040816] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
              placeholder="52187"
            />
            <p className="text-[10px] text-slate-500 font-mono mt-1">
              Calibrates the 5-digit sequence matching your lottery screen.
            </p>
          </div>
        </div>

        {/* Audio & Haptics */}
        <div className="rounded-2xl bg-[#081125] border border-blue-900/40 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white block">Futuristic Audio FX</span>
              <span className="text-[10px] text-slate-400">Countdown alerts & jackpot audio synthesizer</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleSound}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-colors ${
              soundEnabled
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/50'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            {soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-wider text-sm shadow-[0_4px_25px_rgba(59,130,246,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
              PROFILE & API SAVED!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              SAVE PROFILE & SETTINGS
            </>
          )}
        </button>
      </form>
    </div>
  );
};
