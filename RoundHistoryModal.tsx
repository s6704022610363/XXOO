import React from 'react';
import { X, History, Trophy, Users, Clock, Award } from 'lucide-react';
import { GameScore, PlayerSettings, RoundSummary } from '../types';

interface RoundHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  rounds: RoundSummary[];
  score: GameScore;
  settings: PlayerSettings;
}

export const RoundHistoryModal: React.FC<RoundHistoryModalProps> = ({
  isOpen,
  onClose,
  rounds,
  score,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal-history-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="modal-history-content"
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 relative max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">ประวัติการแข่งขันทั้งหมด</h2>
          </div>
          <button
            id="btn-close-history"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats summary */}
        <div className="grid grid-cols-3 gap-2 mb-4 shrink-0">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">
              {settings.nameX || 'ผู้เล่น X'}
            </span>
            <span className="text-xl font-black text-indigo-400 font-mono">
              {score.xWins} <span className="text-xs font-normal">ชนะ</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              ผลเสมอ
            </span>
            <span className="text-xl font-black text-slate-200 font-mono">
              {score.draws} <span className="text-xs font-normal">ครั้ง</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
            <span className="text-[10px] uppercase font-bold text-rose-300 block">
              {settings.nameO || 'ผู้เล่น O'}
            </span>
            <span className="text-xl font-black text-rose-400 font-mono">
              {score.oWins} <span className="text-xs font-normal">ชนะ</span>
            </span>
          </div>
        </div>

        {/* Round List */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {rounds.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>ยังไม่มีประวัติการเล่นที่เสร็จสิ้น</p>
              <p className="text-[11px] text-slate-600 mt-1">ผลการแข่งขันจะบันทึกอัตโนมัติเมื่อจบรอบ</p>
            </div>
          ) : (
            rounds.map((r) => {
              const isXWin = r.winner === 'X';
              const isOWin = r.winner === 'O';
              const isDraw = r.winner === 'draw';
              const winnerName = isXWin
                ? settings.nameX || 'ผู้เล่น X'
                : isOWin
                ? settings.nameO || 'ผู้เล่น O'
                : 'เสมอ';

              return (
                <div
                  key={`round-summary-${r.round}`}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-slate-300 font-mono text-[11px]">
                      #{r.round}
                    </span>

                    <div>
                      <div className="flex items-center gap-1.5 font-semibold text-white">
                        {isXWin && <Trophy className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                        {isOWin && <Trophy className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        {isDraw && <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                        <span>
                          {isDraw ? 'เสมอกัน' : `${winnerName} (${r.winner}) ชนะ`}
                        </span>
                        {r.winMethod && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-normal bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {r.winMethod}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        เดิน {r.movesCount} ตา • {r.durationSeconds} วินาที
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.timestamp}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-800 mt-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
