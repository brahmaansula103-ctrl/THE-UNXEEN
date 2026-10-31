import React, { useState } from 'react';
import { X, Play, RefreshCw, SlidersHorizontal, Check } from 'lucide-react';
import { getNumberColor, getNumberSize } from '../utils/unxeenEngine';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySync: (currentPeriod: string, numbers: number[]) => void;
  initialPeriod: string;
  initialNumbers: number[];
}

export const SyncModal: React.FC<SyncModalProps> = ({
  isOpen,
  onClose,
  onApplySync,
  initialPeriod,
  initialNumbers,
}) => {
  const [period, setPeriod] = useState<string>(initialPeriod || '20261030100052187');
  const [numbers, setNumbers] = useState<number[]>(
    initialNumbers.length === 5 ? [...initialNumbers] : [9, 8, 7, 6, 2]
  );
  const [selectedSlot, setSelectedSlot] = useState<number>(0);

  if (!isOpen) return null;

  const handleSetNumber = (num: number) => {
    const updated = [...numbers];
    updated[selectedSlot] = num;
    setNumbers(updated);
    if (selectedSlot < 4) setSelectedSlot(selectedSlot + 1);
  };

  const handleApply = () => {
    onApplySync(period, numbers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#070e22] border border-blue-800/60 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-900/40 bg-[#09132c]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-black tracking-wider text-white font-['Rajdhani']">
                PERIOD & DRAW CALIBRATION
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">
                Sync current lottery period and previous 5 numbers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Current Period Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
              Active Period Issue Number
            </label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value.trim())}
              className="w-full px-3 py-2.5 rounded-xl bg-[#040816] border border-slate-700 text-cyan-300 font-mono text-sm tracking-wider focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 20261030100052187"
            />
          </div>

          {/* 5 Slots Selector */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Top 5 Draw Sequence (Slot #1 is Latest Draw):
            </div>
            <div className="grid grid-cols-5 gap-2">
              {numbers.map((num, idx) => {
                const isSelected = selectedSlot === idx;
                const size = getNumberSize(num);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(idx)}
                    className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-blue-900/70 border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] ring-2 ring-cyan-400'
                        : 'bg-[#091225] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">
                      {idx === 0 ? 'Latest #1' : `#${idx + 1}`}
                    </span>
                    <span className="text-xl font-black font-mono text-white my-1">
                      {num}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        size === 'BIG'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {size}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Keypad to pick numbers 0 to 9 */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Select Number for Slot #{selectedSlot + 1}:
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleSetNumber(digit)}
                  className={`py-3 rounded-2xl font-mono font-black text-lg transition-transform active:scale-95 border ${
                    digit >= 5
                      ? 'bg-blue-950/80 hover:bg-blue-800 text-blue-200 border-blue-800/60'
                      : 'bg-amber-950/80 hover:bg-amber-800 text-amber-200 border-amber-800/60'
                  }`}
                >
                  {digit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-900/40 bg-[#09132c] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Apply & Calibrate
          </button>
        </div>
      </div>
    </div>
  );
};
