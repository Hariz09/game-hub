import { useCallback, useEffect } from 'react';
import { MinesweeperState, DIFFICULTIES } from '@/types/minesweeper';

export const useKeyboardNavigation = (
  focusedCell: { row: number; col: number } | null,
  setFocusedCell: (cell: { row: number; col: number } | null) => void,
  state: MinesweeperState,
  handleCellClick: (row: number, col: number) => void,
  handleFlag: (row: number, col: number) => void,
  announce: (message: string) => void
) => {
  const config = DIFFICULTIES[state.difficulty];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!focusedCell || state.gameState !== 'playing') return;

    const { row, col } = focusedCell;
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(config.rows - 1, row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(config.cols - 1, col + 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleCellClick(row, col);
        return;
      case 'f':
      case 'F':
        e.preventDefault();
        handleFlag(row, col);
        return;
      case 'Escape':
        e.preventDefault();
        setFocusedCell(null);
        return;
      default:
        return;
    }

    if (newRow !== row || newCol !== col) {
      setFocusedCell({ row: newRow, col: newCol });
      const cell = state.grid[newRow][newCol];
      let cellDescription = `Cell ${newRow + 1}, ${newCol + 1}. `;
      
      if (cell.isRevealed) {
        if (cell.isMine) {
          cellDescription += 'Mine revealed.';
        } else if (cell.adjacentMines === 0) {
          cellDescription += 'Empty cell.';
        } else {
          cellDescription += `${cell.adjacentMines} adjacent mines.`;
        }
      } else if (cell.isFlagged) {
        cellDescription += 'Flagged cell.';
      } else {
        cellDescription += 'Hidden cell.';
      }
      
      announce(cellDescription);
    }
  }, [focusedCell, state.gameState, state.grid, config, handleCellClick, handleFlag, setFocusedCell, announce]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};