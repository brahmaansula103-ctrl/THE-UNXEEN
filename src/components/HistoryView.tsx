import React, { useState } from 'react';
import { PredictionRecord, StatsSummary } from '../types';
import {
  PieChart,
  Trash2,
  Share2,
  Layers,
  CheckCircle,
  XCircle,
  Gauge,
  Sparkles,
  Check,
  AlertCircle,
  ArrowRight,
  Edit2,
  X,
} from 'lucide-react';

interface HistoryViewProps {
  records: PredictionRecord[];
  stats: StatsSummary;
  onClearHistory: () => void;
  onUpdateRecordResult?: (recordId: string, actualNumber: number) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  records,
  stats,
  onClearHistory,
  onUpdateRecordResult,
}) => {
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleShare = () => {
    const text = `🎯 THE UNXEEN 🔞 V14.ZYX PRO REPORT\nTotal Predictions: ${stats.total}\nWins: ${stats.wins} | Jackpots: ${stats.jackpots}\nAccuracy Rate: ${stats.winRate}%\nPowered by Unxeen Neural Engine!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNumberColorClass = (num: number) => {
    switch (num) {
      case 0:
        return 'bg-gradient-to-tr from-rose-500 to-purple-600 border-purple-300';
      case 1:
      case 3:
      case 7:
      case 9:
        return 'bg-gradient-to-tr from-emerald-500 to-teal-600 border-emerald-300';
      case 2:
      case 4:
      case 6:
      case 8:
        return 'bg-gradient-to-tr from-rose-500 to-red-600 border-rose-300';
      case 5:
        return 'bg-gradient-to-tr from-emerald-600 to-purple-600 border-purple-300';
      default:
        return 'bg-blue-600 border-blue-300';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-3 sm:px-4 py-4 pb-24">
      {/* Top Header Card matching Screenshot 2 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wider font-['Rajdhani']">
              HISTORY
            </h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              AI PREDICTION REPORT
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[11px] font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          TRACKED
        </div>
      </div>

      {/* Action Buttons: CLEAR and SHARE */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={onClearHistory}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(225,29,72,0.4)] active:scale-95 transition-all"
        >
          <Trash2 className="w-4 h-4" />
          CLEAR
        </button>

        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm uppercase tracking-wider shadow-[0_4px_20px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'COPIED!' : 'SHARE'}
        </button>
      </div>

      {/* 4 Stats Cards matching Screenshot 2 */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {/* TOTAL */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091225] border border-blue-900/40 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-white">
            {stats.total}
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            TOTAL
          </span>
        </div>

        {/* WINS */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091225] border border-blue-900/40 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-emerald-400">
            {stats.wins}
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            WINS
          </span>
        </div>

        {/* LOSSES */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091225] border border-blue-900/40 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-1">
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-rose-400">
            {stats.losses}
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            LOSSES
          </span>
        </div>

        {/* RATE */}
        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#091225] border border-blue-900/40 shadow-md">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
            <Gauge className="w-4 h-4" />
          </div>
          <span className="text-lg sm:text-xl font-black font-mono text-amber-400">
            {stats.winRate}%
          </span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
            RATE
          </span>
        </div>
      </div>

      {/* Prediction Records List matching Screenshot 2 & 4 */}
      <div className="space-y-3">
        {records.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#070e20] border border-slate-800 p-6 text-slate-400">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-500 mb-2" />
            <p className="text-sm font-semibold">No predictions tracked yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Active predictions will automatically log and verify against draw results!
            </p>
          </div>
        ) : (
          records.map((rec) => {
            const displayNum = rec.actualNumber !== undefined ? rec.actualNumber : rec.topResult;
            const isJackpot = rec.status === 'JACKPOT';
            const isWin = rec.status === 'WIN';
            const isPending = rec.status === 'PENDING';

            return (
              <div
                key={rec.id}
                className={`relative flex items-center justify-between p-3.5 rounded-2xl bg-[#091328]/90 border transition-all ${
                  isJackpot
                    ? 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                    : isWin
                    ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : isPending
                    ? 'border-blue-500/40'
                    : 'border-slate-800'
                }`}
              >
                {/* Left side decorative border tab */}
                <div
                  className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${
                    isJackpot
                      ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                      : isWin
                      ? 'bg-emerald-400'
                      : isPending
                      ? 'bg-blue-400'
                      : 'bg-rose-500'
                  }`}
                />

                {/* Left Ball & Info */}
                <div className="flex items-center gap-3 pl-2">
                  <div
                    className={`w-11 h-11 rounded-full border-2 border-dashed flex items-center justify-center text-white font-mono font-black text-lg shadow-md ${getNumberColorClass(
                      displayNum
                    )}`}
                  >
                    {displayNum}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                      <span className="text-[10px] text-slate-400 font-mono">
                        ISSUE {rec.issueNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          rec.predictedSize === 'BIG'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                        }`}
                      >
                        {rec.predictedSize}
                      </span>

                      {rec.isInverted && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-500/60">
                          ⚡ ULTA
                        </span>
                      )}

                      <span className="text-xs font-mono font-bold text-rose-400">
                        #{rec.predictedNumbers[0]}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        #{rec.predictedNumbers[1]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono mt-1">
                      {rec.actualNumber !== undefined ? (
                        <>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span>RESULT {rec.actualNumber}</span>
                          <span>•</span>
                          <span className="font-bold">{rec.actualSize}</span>
                        </>
                      ) : (
                        <span className="text-slate-500">Waiting draw...</span>
                      )}

                      {onUpdateRecordResult && (
                        <button
                          onClick={() => setEditingId(editingId === rec.id ? null : rec.id)}
                          className="text-[9px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded flex items-center gap-1 transition-all"
                          title="Correct draw number"
                        >
                          {editingId === rec.id ? <X className="w-2.5 h-2.5" /> : <Edit2 className="w-2.5 h-2.5" />}
                          <span>{editingId === rec.id ? 'Close' : 'Fix'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Status Badge matching Screenshots */}
                <div className="flex flex-col items-end gap-1">
                  {isPending && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-slate-300 bg-slate-800/80 border border-slate-700">
                      PENDING
                    </span>
                  )}
                  {isWin && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                      WIN
                    </span>
                  )}
                  {isJackpot && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-amber-300 bg-amber-950/90 border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      JACKPOT
                    </span>
                  )}
                  {rec.status === 'LOSS' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-rose-400 bg-rose-950/80 border border-rose-800/60">
                      LOSS
                    </span>
                  )}
                </div>

                {/* Inline 1-tap number fixer */}
                {editingId === rec.id && onUpdateRecordResult && (
                  <div className="absolute -bottom-10 left-2 right-2 z-20 bg-[#040816] border border-cyan-500/60 rounded-xl p-1.5 shadow-2xl flex items-center justify-between gap-1 animate-in fade-in zoom-in-95">
                    <span className="text-[9px] text-cyan-300 font-mono font-bold pl-1">REAL:</span>
                    <div className="grid grid-cols-10 gap-0.5 flex-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <button
                          key={n}
                          onClick={() => {
                            onUpdateRecordResult(rec.id, n);
                            setEditingId(null);
                          }}
                          className={`py-0.5 rounded text-[10px] font-black font-mono text-white ${getNumberColorClass(
                            n
                          )}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
