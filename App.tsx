/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { ConfirmationBar } from './components/ConfirmationBar';
import { GameStatusBanner } from './components/GameStatusBanner';
import { MoveLogList } from './components/MoveLogList';
import { SettingsModal } from './components/SettingsModal';
import { RoundHistoryModal } from './components/RoundHistoryModal';
import { WinnerCelebration } from './components/WinnerCelebration';
import { GameRulesSection } from './components/GameRulesSection';
import {
  BoardState,
  GameScore,
  GameStatus,
  MoveRecord,
  Player,
  PlayerSettings,
  RoundSummary,
  WinningLineInfo,
} from './types';
import { checkWinner, getCellCoordinates, isBoardFull, getWinningMethodDescription } from './utils/gameLogic';
import { soundManager } from './utils/audio';

const STORAGE_KEY_SCORE = 'xo_game_score_v1';
const STORAGE_KEY_SETTINGS = 'xo_game_settings_v1';
const STORAGE_KEY_ROUNDS = 'xo_game_rounds_v1';

export default function App() {
  // Settings & Preferences
  const [settings, setSettings] = useState<PlayerSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localstorage parse error
    }
    return {
      nameX: 'ผู้เล่น X',
      nameO: 'ผู้เล่น O',
      soundEnabled: true,
      startingPlayerPreference: 'alternate',
    };
  });

  // Score statistics
  const [score, setScore] = useState<GameScore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localstorage error
    }
    return { xWins: 0, oWins: 0, draws: 0, roundsPlayed: 0 };
  });

  // History of completed rounds
  const [roundsHistory, setRoundsHistory] = useState<RoundSummary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROUNDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore localstorage error
    }
    return [];
  });

  // Core Game State
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('in_progress');
  const [winningInfo, setWinningInfo] = useState<WinningLineInfo | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moves, setMoves] = useState<MoveRecord[]>([]);

  // Starting player of current round
  const [roundStarter, setRoundStarter] = useState<Player>('X');
  const roundStartTimeRef = useRef<number>(Date.now());

  // Turn Timer State (1 minute = 60 seconds per turn)
  const TURN_DURATION_SECONDS = 60;
  const [turnTimeLeft, setTurnTimeLeft] = useState<number>(TURN_DURATION_SECONDS);
  const [timeoutNotice, setTimeoutNotice] = useState<{ player: Player; message: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // UI Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Sync sound manager muted state
  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Storage error ignored
    }
  }, [settings]);

  // Persist score
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCORE, JSON.stringify(score));
    } catch {
      // Storage error ignored
    }
  }, [score]);

  // Persist rounds history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROUNDS, JSON.stringify(roundsHistory));
    } catch {
      // Storage error ignored
    }
  }, [roundsHistory]);

  // Turn Countdown Timer Effect (1 minute / 60 seconds per player turn)
  useEffect(() => {
    if (gameStatus !== 'in_progress' || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setTurnTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        // Audio tick cues for last 5 seconds
        if (prev <= 6 && prev > 1) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, currentPlayer, isPaused]);

  // Toggle Pause / Stop Handler
  const handleTogglePause = useCallback(() => {
    if (gameStatus !== 'in_progress') return;
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        soundManager.playPause();
      } else {
        soundManager.playResume();
      }
      return next;
    });
  }, [gameStatus]);

  // Auto skip turn when time runs out (0 seconds)
  useEffect(() => {
    if (gameStatus === 'in_progress' && turnTimeLeft === 0 && !isPaused) {
      const timedOutPlayer = currentPlayer;
      const nextPlayer: Player = timedOutPlayer === 'X' ? 'O' : 'X';
      const timedOutPlayerName =
        timedOutPlayer === 'X' ? settings.nameX || 'ผู้เล่น X' : settings.nameO || 'ผู้เล่น O';

      // Play timeout buzzer/chime
      soundManager.playTimeout();

      // Clear any staged cell
      setPendingIndex(null);

      // Show alert notice for turn skip
      setTimeoutNotice({
        player: timedOutPlayer,
        message: `หมดเวลา 1 นาที! ข้ามเทิร์นของ ${timedOutPlayerName} (${timedOutPlayer}) ไปยัง ${
          nextPlayer === 'X' ? settings.nameX || 'ผู้เล่น X' : settings.nameO || 'ผู้เล่น O'
        } (${nextPlayer}) แล้ว`,
      });

      // Switch turn to the other player and reset clock
      setCurrentPlayer(nextPlayer);
      setTurnTimeLeft(TURN_DURATION_SECONDS);

      // Clear timeout banner after 4 seconds
      const timeoutId = setTimeout(() => {
        setTimeoutNotice(null);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [turnTimeLeft, gameStatus, currentPlayer, settings.nameX, settings.nameO]);

  // Cell Click: Select or change staged cell
  const handleCellClick = useCallback(
    (index: number) => {
      if (gameStatus !== 'in_progress' || isPaused) return;
      if (board[index] !== null) return;

      if (pendingIndex === index) {
        // Clicking same pending cell is a no-op
        return;
      }

      setPendingIndex(index);
      soundManager.playSelect();
    },
    [gameStatus, isPaused, board, pendingIndex]
  );

  // Cancel Pending Selection
  const handleCancelMove = useCallback(() => {
    if (pendingIndex === null || isPaused) return;
    setPendingIndex(null);
    soundManager.playCancel();
  }, [pendingIndex, isPaused]);

  // Confirm Move: Commit staged move into board and process turn logic
  const handleConfirmMove = useCallback(() => {
    if (pendingIndex === null || gameStatus !== 'in_progress' || isPaused) return;
    if (board[pendingIndex] !== null) return;

    const moveIndex = pendingIndex;
    const movePlayer = currentPlayer;
    const newBoard: BoardState = [...board];
    newBoard[moveIndex] = movePlayer;

    const coords = getCellCoordinates(moveIndex);
    const nowTime = new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const newMoveRecord: MoveRecord = {
      moveNumber: moves.length + 1,
      player: movePlayer,
      cellIndex: moveIndex,
      row: coords.row,
      col: coords.col,
      coordLabel: coords.label,
      timestamp: nowTime,
    };

    const updatedMoves = [...moves, newMoveRecord];
    setMoves(updatedMoves);
    soundManager.playConfirm(movePlayer);

    // Check for Win
    const winResult = checkWinner(newBoard);
    if (winResult) {
      setBoard(newBoard);
      setWinningInfo(winResult.winningInfo);
      setWinner(winResult.winner);
      setGameStatus('won');
      setIsPaused(false);
      setPendingIndex(null);

      const durationSec = Math.max(
        1,
        Math.round((Date.now() - roundStartTimeRef.current) / 1000)
      );
      const winMethodDesc = getWinningMethodDescription(winResult.winningInfo);
      const newRoundSummary: RoundSummary = {
        round: score.roundsPlayed + 1,
        winner: winResult.winner,
        winningInfo: winResult.winningInfo,
        winMethod: winMethodDesc ? winMethodDesc.description : undefined,
        movesCount: updatedMoves.length,
        durationSeconds: durationSec,
        timestamp: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setRoundsHistory((prev) => [newRoundSummary, ...prev]);
      setScore((prev) => ({
        ...prev,
        xWins: winResult.winner === 'X' ? prev.xWins + 1 : prev.xWins,
        oWins: winResult.winner === 'O' ? prev.oWins + 1 : prev.oWins,
        roundsPlayed: prev.roundsPlayed + 1,
      }));

      soundManager.playWin();
      return;
    }

    // Check for Draw
    if (isBoardFull(newBoard)) {
      setBoard(newBoard);
      setGameStatus('draw');
      setIsPaused(false);
      setPendingIndex(null);

      const durationSec = Math.max(
        1,
        Math.round((Date.now() - roundStartTimeRef.current) / 1000)
      );
      const newRoundSummary: RoundSummary = {
        round: score.roundsPlayed + 1,
        winner: 'draw',
        movesCount: updatedMoves.length,
        durationSeconds: durationSec,
        timestamp: new Date().toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setRoundsHistory((prev) => [newRoundSummary, ...prev]);
      setScore((prev) => ({
        ...prev,
        draws: prev.draws + 1,
        roundsPlayed: prev.roundsPlayed + 1,
      }));

      soundManager.playDraw();
      return;
    }

    // Advance to next turn
    setBoard(newBoard);
    setPendingIndex(null);
    setCurrentPlayer(movePlayer === 'X' ? 'O' : 'X');
    setTurnTimeLeft(TURN_DURATION_SECONDS);
  }, [pendingIndex, gameStatus, board, currentPlayer, moves, score.roundsPlayed]);

  // Start Next Round
  const startNextRound = useCallback(() => {
    let nextStarter: Player = 'X';
    if (settings.startingPlayerPreference === 'alternate') {
      nextStarter = roundStarter === 'X' ? 'O' : 'X';
    } else if (settings.startingPlayerPreference === 'O') {
      nextStarter = 'O';
    } else {
      nextStarter = 'X';
    }

    setRoundStarter(nextStarter);
    setCurrentPlayer(nextStarter);
    setBoard(Array(9).fill(null));
    setPendingIndex(null);
    setWinningInfo(null);
    setWinner(null);
    setGameStatus('in_progress');
    setIsPaused(false);
    setMoves([]);
    setTurnTimeLeft(TURN_DURATION_SECONDS);
    setTimeoutNotice(null);
    roundStartTimeRef.current = Date.now();
    soundManager.playReset();
  }, [roundStarter, settings.startingPlayerPreference]);

  // Restart Current Round (Do not count this game as a round if it just concluded)
  const restartCurrentRound = useCallback(() => {
    if (gameStatus === 'won') {
      if (winner === 'X') {
        setScore((prev) => ({
          ...prev,
          xWins: Math.max(0, prev.xWins - 1),
          roundsPlayed: Math.max(0, prev.roundsPlayed - 1),
        }));
      } else if (winner === 'O') {
        setScore((prev) => ({
          ...prev,
          oWins: Math.max(0, prev.oWins - 1),
          roundsPlayed: Math.max(0, prev.roundsPlayed - 1),
        }));
      }
      setRoundsHistory((prev) => prev.slice(1));
    } else if (gameStatus === 'draw') {
      setScore((prev) => ({
        ...prev,
        draws: Math.max(0, prev.draws - 1),
        roundsPlayed: Math.max(0, prev.roundsPlayed - 1),
      }));
      setRoundsHistory((prev) => prev.slice(1));
    }

    setBoard(Array(9).fill(null));
    setPendingIndex(null);
    setWinningInfo(null);
    setWinner(null);
    setGameStatus('in_progress');
    setIsPaused(false);
    setMoves([]);
    setCurrentPlayer(roundStarter);
    setTurnTimeLeft(TURN_DURATION_SECONDS);
    setTimeoutNotice(null);
    roundStartTimeRef.current = Date.now();
    soundManager.playReset();
  }, [gameStatus, winner, roundStarter]);

  // Reset all data & statistics (wipes scores, round history, and resets board)
  const handleResetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_SCORE);
    localStorage.removeItem(STORAGE_KEY_ROUNDS);
    setScore({ xWins: 0, oWins: 0, draws: 0, roundsPlayed: 0 });
    setRoundsHistory([]);
    setBoard(Array(9).fill(null));
    setPendingIndex(null);
    setWinningInfo(null);
    setWinner(null);
    setGameStatus('in_progress');
    setIsPaused(false);
    setMoves([]);
    setCurrentPlayer(roundStarter);
    setTurnTimeLeft(TURN_DURATION_SECONDS);
    setTimeoutNotice(null);
    roundStartTimeRef.current = Date.now();
    soundManager.playReset();
  }, [roundStarter]);

  // Toggle Sound Shortcut
  const handleToggleSound = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  }, []);

  const winnerName =
    winner === 'X' ? settings.nameX || 'ผู้เล่น X' : winner === 'O' ? settings.nameO || 'ผู้เล่น O' : '';

  return (
    <main
      id="main-app-wrapper"
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-4 px-3 sm:px-6 relative selection:bg-indigo-500 selection:text-white"
    >
      {/* Celebration animation for winner */}
      <WinnerCelebration winner={winner} winnerName={winnerName} />

      <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-5">
        {/* Top Header */}
        <Header
          score={score}
          settings={settings}
          isPaused={isPaused}
          gameStatus={gameStatus}
          onTogglePause={handleTogglePause}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onResetGame={handleResetAllData}
        />

        {/* Players & Scoreboard status */}
        <ScoreBoard
          score={score}
          currentPlayer={currentPlayer}
          pendingPlayer={pendingIndex !== null ? currentPlayer : null}
          settings={settings}
          gameStatus={gameStatus}
          winner={winner}
          winningInfo={winningInfo}
          turnTimeLeft={turnTimeLeft}
          totalTurnTime={TURN_DURATION_SECONDS}
          timeoutNotice={timeoutNotice}
          isPaused={isPaused}
          onTogglePause={handleTogglePause}
        />

        {/* Status announcement banner */}
        <GameStatusBanner
          gameStatus={gameStatus}
          currentPlayer={currentPlayer}
          pendingIndex={pendingIndex}
          winner={winner}
          winningInfo={winningInfo}
          settings={settings}
          onNextRound={startNextRound}
          onRestartRound={restartCurrentRound}
        />

        {/* Interactive 3x3 Game Board */}
        <div className="flex flex-col items-center justify-center my-2">
          <GameBoard
            board={board}
            pendingIndex={pendingIndex}
            currentPlayer={currentPlayer}
            winningInfo={winningInfo}
            onCellClick={handleCellClick}
            disabled={gameStatus !== 'in_progress' || isPaused}
          />
        </div>

        {/* Move Confirmation Action Bar (Required) */}
        {gameStatus === 'in_progress' && (
          <ConfirmationBar
            pendingIndex={pendingIndex}
            currentPlayer={currentPlayer}
            settings={settings}
            onConfirm={handleConfirmMove}
            onCancel={handleCancelMove}
            disabled={pendingIndex === null || gameStatus !== 'in_progress' || isPaused}
          />
        )}

        {/* Move Log History for current round */}
        <div className="w-full max-w-lg mx-auto">
          <MoveLogList moves={moves} settings={settings} />
        </div>

        {/* Rules and How to Play Section on the same page */}
        <GameRulesSection />
      </div>

      {/* Footer info */}
      <footer
        id="app-footer"
        className="w-full max-w-4xl mx-auto text-center text-xs text-slate-500 pt-6 pb-2 border-t border-slate-900 mt-6"
      >
        <p>
          เกม XO 3x3 พร้อมระบบยืนยันตาเดิน • รองรับการเล่น 2 คน (Pass & Play)
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onResetAllData={handleResetAllData}
      />

      {/* Match History Modal */}
      <RoundHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        rounds={roundsHistory}
        score={score}
        settings={settings}
      />
    </main>
  );
}
