import React from 'react';
import { Trophy, Users, ArrowRight, Play, RotateCcw, Sparkles } from 'lucide-react';
import { GameStatus, Player, PlayerSettings, WinningLineInfo } from '../types';
import { getWinningMethodDescription } from '../utils/gameLogic';

interface GameStatusBannerProps {
  gameStatus: GameStatus;
  currentPlayer: Player;
  pendingIndex: number | null;
  winner: Player | null;
  winningInfo: WinningLineInfo | null;
  settings: PlayerSettings;
  onNextRound: () => void;
  onRestartRound: () => void;
}

export const GameStatusBanner: React.FC<GameStatusBannerProps> = ({
  gameStatus,
  currentPlayer,
  pendingIndex,
  winner,
  winningInfo,
  settings,
  onNextRound,
  onRestartRound,
}) => {
  const currentName =
    currentPlayer === 'X' ? settings.nameX || 'ผู้เล่น X' : settings.nameO || 'ผู้เล่น O';
  const winnerName =
    winner === 'X' ? settings.nameX || 'ผู้เล่น X' : winner === 'O' ? settings.nameO || 'ผู้เล่น O' : '';
  const winMethod = getWinningMethodDescription(winningInfo);

  if (gameStatus === 'won') {
    return (
      <div
        id="status-banner-won"
        className="w-full max-w-lg mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/60 border border-amber-500/50 shadow-2xl text-center flex flex-col items-center gap-3 animate-fade-in"
      >
        <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Trophy className="w-6 h-6 animate-bounce" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            ผลการตัดสินรอบนี้
          </span>
          <h2 id="winner-announcement-text" className="text-xl sm:text-2xl font-black text-white">
            🎉 {winnerName} ({winner}) เป็นผู้ชนะ!
          </h2>

          {/* Prominent Winning Method Announcement */}
          {winMethod && (
            <div
              id="winner-method-badge"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>ชนะด้วยวิธี:</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs">
                {winMethod.category}
              </span>
              <span className="text-amber-200 text-xs font-normal">
                ({winMethod.description})
              </span>
            </div>
          )}

          <p className="text-xs text-slate-300">
            {winMethod ? (
              <span>
                เครื่องหมาย <strong>{winner}</strong> เรียงต่อกันครบ 3 ช่องใน<strong>{winMethod.cellsDescription}</strong>
              </span>
            ) : (
              <span>ยินดีด้วย! เครื่องหมาย {winner} เรียงต่อกันครบ 3 ช่องสมบูรณ์</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 w-full max-w-xs">

          <button
            id="btn-play-next-round"
            onClick={onNextRound}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>รอบถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="btn-restart-current-round"
            onClick={onRestartRound}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="เริ่มเล่นใหม่รอบนี้ (ไม่นับรอบและผลการเล่นนี้)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>เริ่มเล่นใหม่รอบนี้</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'draw') {
    return (
      <div
        id="status-banner-draw"
        className="w-full max-w-lg mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-slate-700 shadow-2xl text-center flex flex-col items-center gap-3 animate-fade-in"
      >
        <div className="w-12 h-12 rounded-full bg-slate-700/50 border border-slate-600 flex items-center justify-center text-slate-300">
          <Users className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            ผลการตัดสินรอบนี้
          </span>
          <h2 id="draw-announcement-text" className="text-xl sm:text-2xl font-black text-white mt-0.5">
            🤝 เสมอกัน! (Draw)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            ไม่มีช่องว่างเหลือและไม่มีผู้ใดสามารถเรียงครบ 3 ช่อง
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 w-full max-w-xs">
          <button
            id="btn-play-next-round-draw"
            onClick={onNextRound}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>เล่นรอบใหม่</span>
            <Play className="w-4 h-4" />
          </button>
          <button
            id="btn-restart-current-round-draw"
            onClick={onRestartRound}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            title="เริ่มเล่นใหม่รอบนี้ (ไม่นับรอบและผลการเล่นนี้)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
            <span>เริ่มเล่นใหม่รอบนี้</span>
          </button>
        </div>
      </div>
    );
  }

  // In-progress status message
  return (
    <div
      id="status-banner-in-progress"
      className="w-full max-w-lg mx-auto py-2.5 px-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
    >
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            currentPlayer === 'X' ? 'bg-indigo-400 animate-ping' : 'bg-rose-400 animate-ping'
          }`}
        />
        <span className="text-slate-300">
          ตาเดินของ:{' '}
          <strong className={currentPlayer === 'X' ? 'text-indigo-400' : 'text-rose-400'}>
            {currentName} [{currentPlayer}]
          </strong>
        </span>
      </div>

      <div className="text-slate-400 text-[11px] font-mono">
        {pendingIndex !== null ? (
          <span className="text-amber-400 font-medium">⚠️ รอกดยืนยันตาเดิน</span>
        ) : (
          <span>เลือกช่องเพื่อลงเครื่องหมาย</span>
        )}
      </div>
    </div>
  );
};
