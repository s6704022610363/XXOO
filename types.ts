export type Player = 'X' | 'O';

export type CellValue = Player | null;

export type BoardState = CellValue[];

export interface WinningLineInfo {
  line: [number, number, number];
  type: 'row' | 'col' | 'diag-main' | 'diag-anti';
  index: number;
}

export type GameStatus = 'in_progress' | 'won' | 'draw';

export interface MoveRecord {
  moveNumber: number;
  player: Player;
  cellIndex: number;
  row: number; // 1-3
  col: number; // 1-3
  coordLabel: string; // e.g., 'A1', 'B2'
  timestamp: string;
}

export interface RoundSummary {
  round: number;
  winner: Player | 'draw';
  winningInfo?: WinningLineInfo | null;
  winMethod?: string;
  movesCount: number;
  durationSeconds: number;
  timestamp: string;
}

export interface GameScore {
  xWins: number;
  oWins: number;
  draws: number;
  roundsPlayed: number;
}

export interface PlayerSettings {
  nameX: string;
  nameO: string;
  soundEnabled: boolean;
  startingPlayerPreference: 'X' | 'O' | 'alternate';
}
