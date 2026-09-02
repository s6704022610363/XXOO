import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Circle, Trophy, Flame, Timer, AlertTriangle, Pause, Play } from 'lucide-react';
import { GameScore, Player, PlayerSettings, WinningLineInfo } from '../types';
import { getWinningMethodDescription } from '../utils/gameLogic';

interface ScoreBoardProps {
  score: GameScore;
  currentPlayer: Player;
  pendingPlayer: Player | null;
  settings: PlayerSettings;
  gameStatus: 'in_progress' | 'won' | 'draw';
  winner: Player | null;
  winningInfo?: WinningLineInfo | null;
  turnTimeLeft: number;
  totalTurnTime: number;
  timeoutNotice: { player: Player; message: string } | null;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  currentPlayer,
  settings,
  gameStatus,
  winner,
  winningInfo,
  turnTimeLeft,
  totalTurnTime,
  timeoutNotice,
  isPaused,
  onTogglePause,
}) => {
  const isXTurn = currentPlayer === 'X' && gameStatus === 'in_progress';
  const isOTurn = currentPlayer === 'O' && gameStatus === 'in_progress';
  const isXWinner = winner === 'X';
  const isOWinner = winner === 'O';
  const winMethod = getWinningMethodDescription(winningInfo || null);

  const timerPercentage = Math.max(0, Math.min(100, (turnTimeLeft / totalTurnTime) * 100));
  const isLowTime = turnTimeLeft <= 10 && gameStatus === 'in_progress' && !isPaused;
  const isCriticalTime = turnTimeLeft <= 5 && gameStatus === 'in_progress' && !isPaused;

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="scoreboard-container" className="w-full max-w-4xl mx-auto space-y-2">
      {/* Top compact round stats & active turn timer bar */}
      <div
        id="card-game-stats"
        className="flex items-center justify-between px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm text-xs gap-2"
      >
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 shrink-0">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>รอบที่ {score.roundsPlayed + 1}</span>
        </div>

        {/* Dynamic Turn Timer Badge + Quick Stop / Play Toggle */}
        {gameStatus === 'in_progress' ? (
          <div className="flex items-center gap-1.5">
            <button
              id="btn-timer-badge-toggle"
              onClick={onTogglePause}
              title={isPaused ? 'กดเพื่อเล่นต่อ' : 'กดเพื่อหยุดเวลา (Stop)'}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border font-mono text-xs font-bold transition-all cursor-pointer ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : isCriticalTime
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-lg shadow-rose-500/20'
                  : isLowTime
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/90 text-cyan-300 border-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              {isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  <span>เวลาหยุด: {formatTime(turnTimeLeft)}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500 text-slate-950 font-sans font-bold">
                    PAUSED
                  </span>
                </>
              ) : (
                <>
                  <Timer
                    className={`w-3.5 h-3.5 ${
                      isCriticalTime ? 'text-rose-400 animate-spin' : isLowTime ? 'text-amber-400' : 'text-cyan-400'
                    }`}
                  />
                  <span>เวลาเทิร์น: {formatTime(turnTimeLeft)}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3 text-slate-400 font-mono text-[11px] sm:text-xs">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60">
              เสมอ: <strong id="score-draws" className="text-slate-200">{score.draws}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700/60">
              รวม: <strong className="text-slate-200">{score.roundsPlayed}</strong> รอบ
            </span>
          </div>
        )}

        <div className="text-[11px] shrink-0">
          {gameStatus === 'in_progress' ? (
            isPaused ? (
              <span className="text-amber-400 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span>หยุดชั่วคราว</span>
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="hidden xs:inline">กำลังแข่งขัน</span>
              </span>
            )
          ) : gameStatus === 'won' ? (
            <span className="text-amber-400 font-bold">มีผู้ชนะแล้ว</span>
          ) : (
            <span className="text-slate-400 font-medium">เสมอกัน</span>
          )}
        </div>
      </div>

      {/* Paused Active Banner */}
      <AnimatePresence>
        {isPaused && gameStatus === 'in_progress' && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            id="paused-notice-banner"
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-200 text-xs flex items-center justify-between shadow-lg shadow-amber-500/10"
          >
            <div className="flex items-center gap-2">
              <Pause className="w-4 h-4 text-amber-400 fill-current shrink-0" />
              <span>
                <strong>เกมหยุดอยู่ (Stop):</strong> เวลาถูกหยุดไว้ที่ <strong>{formatTime(turnTimeLeft)}</strong>
              </span>
            </div>
            <button
              id="btn-resume-from-banner"
              onClick={onTogglePause}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>เล่นต่อ</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeout Alert Banner */}
      <AnimatePresence>
        {timeoutNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            id="timeout-notice-banner"
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between shadow-lg shadow-amber-500/10"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{timeoutNotice.message}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30">
              ข้ามเทิร์นแล้ว
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side-by-Side 2 Player Cards (Clean on mobile & desktop) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 items-stretch">
        {/* Player X Card */}
        <motion.div
          id="card-player-x"
          animate={{
            scale: isXTurn ? 1.01 : 1,
            borderColor: isXWinner
              ? 'rgb(59 130 246)'
              : isXTurn
              ? isCriticalTime
                ? 'rgb(244 63 94)'
                : 'rgb(99 102 241)'
              : 'rgb(30 41 59)',
          }}
          transition={{ duration: 0.2 }}
          className={`relative overflow-hidden p-2.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            isXWinner
              ? 'bg-blue-950/50 border-blue-500 shadow-lg shadow-blue-500/20'
              : isXTurn
              ? 'bg-gradient-to-br from-slate-900 to-indigo-950/60 border-indigo-500 shadow-md shadow-indigo-500/15 ring-1 ring-indigo-400/40'
              : 'bg-slate-900/60 border-slate-800/80 opacity-80'
          }`}
        >
          {/* Active Turn Progress Bar for Player X */}
          {isXTurn && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 overflow-hidden">
              <motion.div
                className={`h-full transition-all duration-1000 ease-linear ${
                  isCriticalTime
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : isLowTime
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                id="avatar-player-x"
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-inner ${
                  isXTurn
                    ? 'bg-indigo-600 text-white shadow-indigo-500/50 ring-2 ring-indigo-400/40'
                    : 'bg-slate-800 text-indigo-400'
                }`}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span
                    id="label-player-x-name"
                    className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate block"
                  >
                    {settings.nameX || 'ผู้เล่น X'}
                  </span>
                </div>
                {isXTurn ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white rounded">
                      ตาเดิน
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCriticalTime
                          ? 'text-rose-400 animate-pulse'
                          : isLowTime
                          ? 'text-amber-400'
                          : 'text-indigo-300'
                      }`}
                    >
                      ({turnTimeLeft}s)
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-indigo-300/70 font-mono hidden sm:inline">สัญลักษณ์ [X]</span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                ชนะ
              </span>
              <span id="score-player-x" className="text-lg sm:text-2xl font-black text-indigo-400 font-mono">
                {score.xWins}
              </span>
            </div>
          </div>

          {isXWinner && (
            <div className="mt-2 pt-1.5 border-t border-blue-500/30 flex items-center justify-center gap-1 text-[11px] sm:text-xs text-blue-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>ชนะในรอบนี้! {winMethod ? `(${winMethod.title})` : ''}</span>
            </div>
          )}
        </motion.div>

        {/* Player O Card */}
        <motion.div
          id="card-player-o"
          animate={{
            scale: isOTurn ? 1.01 : 1,
            borderColor: isOWinner
              ? 'rgb(244 63 94)'
              : isOTurn
              ? isCriticalTime
                ? 'rgb(244 63 94)'
                : 'rgb(251 113 133)'
              : 'rgb(30 41 59)',
          }}
          transition={{ duration: 0.2 }}
          className={`relative overflow-hidden p-2.5 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            isOWinner
              ? 'bg-rose-950/50 border-rose-500 shadow-lg shadow-rose-500/20'
              : isOTurn
              ? 'bg-gradient-to-br from-slate-900 to-rose-950/60 border-rose-500 shadow-md shadow-rose-500/15 ring-1 ring-rose-400/40'
              : 'bg-slate-900/60 border-slate-800/80 opacity-80'
          }`}
        >
          {/* Active Turn Progress Bar for Player O */}
          {isOTurn && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800 overflow-hidden">
              <motion.div
                className={`h-full transition-all duration-1000 ease-linear ${
                  isCriticalTime
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : isLowTime
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-rose-500 to-pink-400'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                id="avatar-player-o"
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-inner ${
                  isOTurn
                    ? 'bg-rose-600 text-white shadow-rose-500/50 ring-2 ring-rose-400/40'
                    : 'bg-slate-800 text-rose-400'
                }`}
              >
                <Circle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span
                    id="label-player-o-name"
                    className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate block"
                  >
                    {settings.nameO || 'ผู้เล่น O'}
                  </span>
                </div>
                {isOTurn ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white rounded">
                      ตาเดิน
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCriticalTime
                          ? 'text-rose-400 animate-pulse'
                          : isLowTime
                          ? 'text-amber-400'
                          : 'text-rose-300'
                      }`}
                    >
                      ({turnTimeLeft}s)
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-rose-300/70 font-mono hidden sm:inline">สัญลักษณ์ [O]</span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                ชนะ
              </span>
              <span id="score-player-o" className="text-lg sm:text-2xl font-black text-rose-400 font-mono">
                {score.oWins}
              </span>
            </div>
          </div>

          {isOWinner && (
            <div className="mt-2 pt-1.5 border-t border-rose-500/30 flex items-center justify-center gap-1 text-[11px] sm:text-xs text-rose-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
              <span>ชนะในรอบนี้! {winMethod ? `(${winMethod.title})` : ''}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
