import { BoardState, Player, WinningLineInfo } from '../types';

export const WINNING_COMBINATIONS: Array<{
  line: [number, number, number];
  type: 'row' | 'col' | 'diag-main' | 'diag-anti';
  index: number;
}> = [
  // Rows
  { line: [0, 1, 2], type: 'row', index: 0 },
  { line: [3, 4, 5], type: 'row', index: 1 },
  { line: [6, 7, 8], type: 'row', index: 2 },
  // Columns
  { line: [0, 3, 6], type: 'col', index: 0 },
  { line: [1, 4, 7], type: 'col', index: 1 },
  { line: [2, 5, 8], type: 'col', index: 2 },
  // Diagonals
  { line: [0, 4, 8], type: 'diag-main', index: 0 },
  { line: [2, 4, 6], type: 'diag-anti', index: 1 },
];

export function checkWinner(board: BoardState): {
  winner: Player;
  winningInfo: WinningLineInfo;
} | null {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo.line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a] as Player,
        winningInfo: combo,
      };
    }
  }
  return null;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every((cell) => cell !== null);
}

export function getCellCoordinates(index: number): {
  row: number;
  col: number;
  label: string;
  thaiLabel: string;
} {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const rowLetters = ['A', 'B', 'C'];
  const label = `${rowLetters[row - 1]}${col}`;
  const thaiLabel = `แถว ${row}, คอลัมน์ ${col} (${label})`;

  return { row, col, label, thaiLabel };
}

export interface WinningMethodDetails {
  category: 'แนวนอน' | 'แนวตั้ง' | 'แนวทแยง';
  title: string;
  description: string;
  cellsDescription: string;
}

export function getWinningMethodDescription(
  winningInfo: WinningLineInfo | null
): WinningMethodDetails | null {
  if (!winningInfo) return null;

  switch (winningInfo.type) {
    case 'row': {
      const rowNum = winningInfo.index + 1;
      return {
        category: 'แนวนอน',
        title: 'แนวนอน',
        description: `แนวนอน (แถวที่ ${rowNum})`,
        cellsDescription: `แถวที่ ${rowNum} (${winningInfo.line.map((i) => getCellCoordinates(i).label).join(', ')})`,
      };
    }
    case 'col': {
      const colNum = winningInfo.index + 1;
      return {
        category: 'แนวตั้ง',
        title: 'แนวตั้ง',
        description: `แนวตั้ง (คอลัมน์ที่ ${colNum})`,
        cellsDescription: `คอลัมน์ที่ ${colNum} (${winningInfo.line.map((i) => getCellCoordinates(i).label).join(', ')})`,
      };
    }
    case 'diag-main': {
      return {
        category: 'แนวทแยง',
        title: 'แนวทแยง',
        description: 'แนวทแยง (ซ้ายบนลงขวาล่าง ↘)',
        cellsDescription: 'แนวทแยงมุมหลัก (A1 - B2 - C3)',
      };
    }
    case 'diag-anti': {
      return {
        category: 'แนวทแยง',
        title: 'แนวทแยง',
        description: 'แนวทแยง (ขวาบนลงซ้ายล่าง ↙)',
        cellsDescription: 'แนวทแยงมุมกลับ (A3 - B2 - C1)',
      };
    }
    default:
      return null;
  }
}
