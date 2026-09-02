import React, { useState } from 'react';
import { X, User, Volume2, Trash2, Check } from 'lucide-react';
import { PlayerSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PlayerSettings;
  onSaveSettings: (newSettings: PlayerSettings) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetAllData,
}) => {
  const [nameX, setNameX] = useState(settings.nameX);
  const [nameO, setNameO] = useState(settings.nameO);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [startingPlayerPreference, setStartingPlayerPreference] = useState(
    settings.startingPlayerPreference
  );
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      nameX: nameX.trim() || 'ผู้เล่น X',
      nameO: nameO.trim() || 'ผู้เล่น O',
      soundEnabled,
      startingPlayerPreference,
    });
    onClose();
  };

  return (
    <div
      id="modal-settings-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="modal-settings-content"
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">ตั้งค่าเกม (Game Settings)</h2>
          </div>
          <button
            id="btn-close-settings"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Player Names */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่อผู้เล่น X (Player X)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-indigo-400 font-mono">
                X
              </span>
              <input
                id="input-name-x"
                type="text"
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                maxLength={24}
                placeholder="เช่น สมชาย หรือ Player 1"
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่อผู้เล่น O (Player O)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-rose-400 font-mono">
                O
              </span>
              <input
                id="input-name-o"
                type="text"
                value={nameO}
                onChange={(e) => setNameO(e.target.value)}
                maxLength={24}
                placeholder="เช่น สมหญิง หรือ Player 2"
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-rose-500 text-white"
              />
            </div>
          </div>

          {/* Starting Player Rule */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              กติกาผู้เริ่มเล่นก่อนในแต่ละรอบ
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStartingPlayerPreference('alternate')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  startingPlayerPreference === 'alternate'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                สลับกันเริ่ม
              </button>
              <button
                type="button"
                onClick={() => setStartingPlayerPreference('X')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  startingPlayerPreference === 'X'
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                X เริ่มก่อนเสมอ
              </button>
              <button
                type="button"
                onClick={() => setStartingPlayerPreference('O')}
                className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                  startingPlayerPreference === 'O'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                O เริ่มก่อนเสมอ
              </button>
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-xs font-semibold text-slate-200">เสียงเอฟเฟกต์ (Sound Effects)</div>
                <div className="text-[11px] text-slate-500">เสียงคลิก กดยืนยัน และประกาศผล</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reset All Data Section */}
          <div className="pt-2 border-t border-slate-800">
            {showConfirmReset ? (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                <p className="text-xs text-rose-300 font-semibold">
                  ยืนยันการล้างคะแนนและประวัติทั้งหมดใช่หรือไม่?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    ใช่, ล้างข้อมูลทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-900 transition-all text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>รีเซ็ตคะแนนและประวัติทั้งหมด (Reset All Stats)</span>
              </button>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Check className="w-4 h-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
