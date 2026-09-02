import React from 'react';
import { motion } from 'motion/react';
import { X, Circle } from 'lucide-react';
import { BoardState, Player, WinningLineInfo } from '../types';
import { getCellCoordinates } from '../utils/gameLogic';

interface GameBoardProps {
  board: BoardState;
  pendingIndex: number | null;
  currentPlayer: Player;
  winningInfo: WinningLineInfo | null;
  onCellClick: (index: number) => void;
  disabled: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  pendingIndex,
  currentPlayer,
  winningInfo,
  onCellClick,
  disabled,
}) => {
  const isWinningCell = (index: number) => {
    return winningInfo ? winningInfo.line.includes(index as 0 | 1 | 2) : false;
  };

  return (
    <div
      id="game-board-container"
      className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[400px] aspect-square mx-auto p-2.5 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl touch-manipulation"
    >
      {/* Outer ambient glow based on current active/pending player */}
      <div
        className={`absolute -inset-1 rounded-3xl opacity-20 blur-xl pointer-events-none transition-all duration-500 ${
          currentPlayer === 'X' ? 'bg-indigo-500' : 'bg-rose-500'
        }`}
      />

      {/* 3x3 Grid Layout */}
      <div
        id="board-grid-3x3"
        role="grid"
        aria-label="ตารางเกม XO 3x3"
        className="relative z-10 grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 w-full h-full"
      >
        {board.map((cellValue, index) => {
          const { label, thaiLabel } = getCellCoordinates(index);
          const isPending = pendingIndex === index;
          const isWinner = isWinningCell(index);
          const isOccupied = cellValue !== null;

          return (
            <motion.button
              key={`cell-${index}`}
              id={`board-cell-${index}`}
              type="button"
              role="gridcell"
              aria-label={`${thaiLabel} ${cellValue ? `มีเครื่องหมาย ${cellValue}` : isPending ? `เลือกชั่วคราวโดย ${currentPlayer}` : 'ช่องว่าง'}`}
              disabled={disabled || (isOccupied && !isPending)}
              onClick={() => onCellClick(index)}
              whileHover={
                !disabled && !isOccupied
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !disabled && !isOccupied
                  ? { scale: 0.95 }
                  : {}
              }
              className={`group relative flex flex-col items-center justify-center rounded-2xl border transition-all duration-200 select-none overflow-hidden touch-manipulation min-h-[70px] ${
                isWinner
                  ? 'bg-gradient-to-br from-amber-500/30 to-yellow-600/30 border-yellow-400 shadow-lg shadow-yellow-500/30 ring-2 ring-yellow-400/50'
                  : isPending
                  ? currentPlayer === 'X'
                    ? 'bg-indigo-950/60 border-indigo-400 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-400/50'
                    : 'bg-rose-950/60 border-rose-400 shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/50'
                  : isOccupied
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 active:bg-slate-800/70 cursor-pointer'
              }`}
            >
              {/* Corner coordinate badge */}
              <span
                className={`absolute top-1.5 left-2 text-[9px] sm:text-[10px] font-mono tracking-wider transition-colors ${
                  isWinner
                    ? 'text-yellow-300 font-bold'
                    : isPending
                    ? 'text-white font-bold'
                    : 'text-slate-600 group-hover:text-slate-400'
                }`}
              >
                {label}
              </span>

              {/* Cell Value: Confirmed Mark */}
              {cellValue === 'X' && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-center justify-center text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                >
                  <X className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 stroke-[2.5]" />
                </motion.div>
              )}

              {cellValue === 'O' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-center justify-center text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                >
                  <Circle className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 stroke-[2.5]" />
                </motion.div>
              )}

              {/* Pending Staged Mark (Waiting for confirmation) */}
              {!cellValue && isPending && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0.6, 0.95, 0.6] }}
                  transition={{
                    scale: { type: 'spring', stiffness: 400, damping: 20 },
                    opacity: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                  }}
                  className={`flex flex-col items-center justify-center ${
                    currentPlayer === 'X' ? 'text-indigo-300' : 'text-rose-300'
                  }`}
                >
                  {currentPlayer === 'X' ? (
                    <X className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 stroke-[2] opacity-80" />
                  ) : (
                    <Circle className="w-9 h-9 xs:w-10 xs:h-10 sm:w-14 sm:h-14 stroke-[2] opacity-80" />
                  )}
                  <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.2 rounded bg-slate-900/90 border border-slate-700 mt-0.5">
                    รอยืนยัน
                  </span>
                </motion.div>
              )}

              {/* Subtle hover placeholder when empty & not pending */}
              {!cellValue && !isPending && !disabled && (
                <div
                  className={`opacity-0 group-hover:opacity-20 transition-opacity flex items-center justify-center ${
                    currentPlayer === 'X' ? 'text-indigo-400' : 'text-rose-400'
                  }`}
                >
                  {currentPlayer === 'X' ? (
                    <X className="w-8 h-8 sm:w-12 sm:h-12 stroke-[1.5]" />
                  ) : (
                    <Circle className="w-7 h-7 sm:w-10 sm:h-10 stroke-[1.5]" />
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
