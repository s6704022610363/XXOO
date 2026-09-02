import React from 'react';
import { ListOrdered, Clock, X, Circle } from 'lucide-react';
import { MoveRecord, PlayerSettings } from '../types';

interface MoveLogListProps {
  moves: MoveRecord[];
  settings: PlayerSettings;
}

export const MoveLogList: React.FC<MoveLogListProps> = ({ moves, settings }) => {
  if (moves.length === 0) {
    return (
      <div
        id="move-log-empty"
        className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-500"
      >
        <ListOrdered className="w-5 h-5 mx-auto mb-1.5 opacity-50" />
        <p>ยังไม่มีการเดินในรอบนี้ (คลิกเลือกช่องแล้วกดยืนยันเพื่อเริ่มบันทึก)</p>
      </div>
    );
  }

  return (
    <div
      id="move-log-container"
      className="p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <ListOrdered className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>ประวัติตาเดินในรอบนี้ ({moves.length}/9 ตา)</span>
        </div>
        <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">เรียงตามลำดับ</span>
      </div>

      <div
        id="move-log-scroll-area"
        className="max-h-40 sm:max-h-48 overflow-y-auto space-y-1.5 pr-1 text-xs scrollbar-thin scrollbar-thumb-slate-800"
      >
        {moves.map((move) => {
          const playerName =
            move.player === 'X' ? settings.nameX || 'ผู้เล่น X' : settings.nameO || 'ผู้เล่น O';

          return (
            <div
              key={`move-${move.moveNumber}`}
              id={`move-item-${move.moveNumber}`}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-slate-700/80 transition-all text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold shrink-0">
                  {move.moveNumber}
                </span>

                <div className="flex items-center gap-1 min-w-0">
                  {move.player === 'X' ? (
                    <X className="w-3.5 h-3.5 text-indigo-400 stroke-[3] shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-rose-400 stroke-[3] shrink-0" />
                  )}
                  <span className="font-medium text-slate-200 truncate">{playerName}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] shrink-0">
                <span className="px-1.5 sm:px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-semibold">
                  {move.coordLabel} (แถว {move.row}, {move.col})
                </span>
                <span className="text-slate-500 flex items-center gap-1 text-[10px] hidden xs:flex">
                  <Clock className="w-3 h-3" />
                  {move.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
