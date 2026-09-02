import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import { Player, PlayerSettings } from '../types';
import { getCellCoordinates } from '../utils/gameLogic';

interface ConfirmationBarProps {
  pendingIndex: number | null;
  currentPlayer: Player;
  settings: PlayerSettings;
  onConfirm: () => void;
  onCancel: () => void;
  disabled: boolean;
}

export const ConfirmationBar: React.FC<ConfirmationBarProps> = ({
  pendingIndex,
  currentPlayer,
  settings,
  onConfirm,
  onCancel,
  disabled,
}) => {
  const playerName =
    currentPlayer === 'X' ? settings.nameX || 'ผู้เล่น X' : settings.nameO || 'ผู้เล่น O';

  // Keyboard shortcut listener: Enter to confirm, Escape to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (pendingIndex === null || disabled) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingIndex, disabled, onConfirm, onCancel]);

  return (
    <div id="confirmation-bar-wrapper" className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {pendingIndex !== null ? (
          <motion.div
            key="pending-confirmation"
            id="confirmation-active-panel"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`p-3.5 sm:p-5 rounded-2xl border backdrop-blur-md shadow-2xl relative overflow-hidden ${
              currentPlayer === 'X'
                ? 'bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-indigo-500/80 shadow-indigo-500/20'
                : 'bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 border-rose-500/80 shadow-rose-500/20'
            }`}
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shadow ${
                    currentPlayer === 'X' ? 'bg-indigo-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {currentPlayer}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[130px] sm:max-w-none">
                  {playerName}
                </span>
              </div>

              <div
                id="pending-cell-tag"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-[11px] sm:text-xs text-amber-300 font-mono shadow-inner"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{getCellCoordinates(pendingIndex).thaiLabel}</span>
              </div>
            </div>

            {/* Confirmation Instruction Message */}
            <p className="text-[11px] sm:text-xs text-slate-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                ตรวจสอบตำแหน่งแล้วกดปุ่ม <strong className="text-amber-300">ยืนยันการเดิน</strong> ด้านล่าง
              </span>
            </p>

            {/* Action Buttons with 48px touch target */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <button
                id="btn-cancel-move"
                type="button"
                onClick={onCancel}
                disabled={disabled}
                className="min-h-[48px] px-3 sm:px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-400 shrink-0" />
                <span>ยกเลิก (Esc)</span>
              </button>

              <button
                id="btn-confirm-move"
                type="button"
                onClick={onConfirm}
                disabled={disabled}
                className={`min-h-[48px] px-3 sm:px-4 py-3 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer ${
                  currentPlayer === 'X'
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-600/30 ring-1 ring-indigo-400/50'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/30 ring-1 ring-rose-400/50'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
                <span>ยืนยันตาเดิน</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="idle-hint"
            id="confirmation-idle-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              แตะเลือก 1 ช่องว่างบนกระดาน เพื่อดูตัวอย่างและกดยืนยัน
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
