import { Cell } from '@/types/minesweeper';

export const createEmptyGrid = (rows: number, cols: number): Cell[][] => {
  const newGrid: Cell[][] = [];
  for (let row = 0; row < rows; row++) {
    newGrid[row] = [];
    for (let col = 0; col < cols; col++) {
      newGrid[row][col] = {
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      };
    }
  }
  return newGrid;
};

export const placeMines = (
  grid: Cell[][], 
  firstClickRow: number, 
  firstClickCol: number, 
  rows: number, 
  cols: number, 
  mines: number
): Cell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  let minesPlaced = 0;
  
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    
    if (!newGrid[row][col].isMine && !(row === firstClickRow && col === firstClickCol)) {
      newGrid[row][col].isMine = true;
      minesPlaced++;
    }
  }
  
  return newGrid;
};

export const calculateAdjacentMines = (grid: Cell[][], rows: number, cols: number): Cell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newGrid[row][col].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (
              newRow >= 0 && newRow < rows &&
              newCol >= 0 && newCol < cols &&
              newGrid[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }
        newGrid[row][col].adjacentMines = count;
      }
    }
  }
  
  return newGrid;
};

export const revealCells = (grid: Cell[][], row: number, col: number, rows: number, cols: number): Cell[][] => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  
  const reveal = (r: number, c: number) => {
    if (
      r < 0 || r >= rows ||
      c < 0 || c >= cols ||
      newGrid[r][c].isRevealed ||
      newGrid[r][c].isFlagged
    ) {
      return;
    }
    
    newGrid[r][c].isRevealed = true;
    
    if (newGrid[r][c].adjacentMines === 0 && !newGrid[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          reveal(r + dr, c + dc);
        }
      }
    }
  };
  
  reveal(row, col);
  return newGrid;
};

export const checkWin = (grid: Cell[][], rows: number, cols: number): boolean => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

export const getCellContent = (cell: Cell): string => {
  if (cell.isFlagged) return '🚩';
  if (!cell.isRevealed) return '';
  if (cell.isMine) return '💣';
  if (cell.adjacentMines === 0) return '';
  return cell.adjacentMines.toString();
};

// Enhanced cell classes with animation support
export const getCellClasses = (
  cell: Cell, 
  row: number, 
  col: number, 
  focusedCell: { row: number; col: number } | null,
  isAnimating: boolean = false,
  shakeGrid: boolean = false,
  celebrateGrid: boolean = false
): string => {
  let classes = 'w-10 h-10 md:w-8 md:h-8 border border-gray-400 flex items-center justify-center text-sm font-bold cursor-pointer select-none transition-all duration-200 ';
  
  // Animation classes
  if (isAnimating) {
    classes += 'transform scale-110 shadow-lg ';
  }
  
  if (shakeGrid) {
    classes += 'animate-pulse ';
  }
  
  if (celebrateGrid) {
    classes += 'animate-bounce ';
  }
  
  // Focus styling with enhanced accessibility
  if (focusedCell && focusedCell.row === row && focusedCell.col === col) {
    classes += 'ring-2 ring-blue-500 ring-offset-1 z-10 ';
  }
  
  if (cell.isRevealed) {
    if (cell.isMine) {
      classes += 'bg-red-500 text-white shadow-inner ';
    } else {
      classes += 'bg-gray-200 shadow-inner ';
      const numberColors = [
        '', 'text-blue-600', 'text-green-600', 'text-red-600',
        'text-purple-600', 'text-yellow-600', 'text-pink-600',
        'text-gray-600', 'text-black'
      ];
      classes += numberColors[cell.adjacentMines] || '';
    }
  } else {
    if (cell.isFlagged) {
      classes += 'bg-yellow-200 hover:bg-yellow-250 active:bg-yellow-300 ';
    } else {
      classes += 'bg-gray-300 hover:bg-gray-250 active:bg-gray-400 shadow-sm hover:shadow-md ';
    }
  }
  
  // Add hover effects for better UX
  if (!cell.isRevealed && !cell.isFlagged) {
    classes += 'hover:transform hover:scale-105 ';
  }
  
  return classes.trim();
};

// Enhanced aria label with more contextual information
export const getAriaLabel = (
  cell: Cell, 
  row: number, 
  col: number,
  totalRows: number,
  totalCols: number,
  remainingMines?: number
): string => {
  let label = `Cell ${row + 1} of ${totalRows}, ${col + 1} of ${totalCols}. `;
  
  if (cell.isRevealed) {
    if (cell.isMine) {
      label += 'Mine revealed. Game over.';
    } else if (cell.adjacentMines === 0) {
      label += 'Empty cell, no adjacent mines.';
    } else {
      label += `${cell.adjacentMines} adjacent mine${cell.adjacentMines !== 1 ? 's' : ''}.`;
    }
  } else if (cell.isFlagged) {
    label += 'Flagged as potential mine.';
    if (remainingMines !== undefined) {
      label += ` ${remainingMines} mines remaining.`;
    }
  } else {
    label += 'Hidden cell. Press space or enter to reveal, or F to flag.';
  }
  
  return label;
};

// Enhanced game statistics
export const getGameStats = (
  grid: Cell[][],
  rows: number,
  cols: number,
  totalMines: number
): {
  revealedCells: number;
  flaggedCells: number;
  remainingMines: number;
  progress: number;
  safeCellsRemaining: number;
} => {
  let revealedCells = 0;
  let flaggedCells = 0;
  let mineCells = 0;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      if (cell.isRevealed) revealedCells++;
      if (cell.isFlagged) flaggedCells++;
      if (cell.isMine) mineCells++;
    }
  }
  
  const totalSafeCells = (rows * cols) - totalMines;
  const safeCellsRemaining = totalSafeCells - revealedCells;
  const progress = totalSafeCells > 0 ? (revealedCells / totalSafeCells) * 100 : 0;
  const remainingMines = Math.max(0, totalMines - flaggedCells);
  
  return {
    revealedCells,
    flaggedCells,
    remainingMines,
    progress: Math.round(progress),
    safeCellsRemaining
  };
};

// Difficulty level helpers
export const getDifficultyStats = (difficulty: string) => {
  const stats = {
    beginner: { cells: 81, mines: 10, density: '12.3%' },
    intermediate: { cells: 256, mines: 40, density: '15.6%' },
    expert: { cells: 480, mines: 99, density: '20.6%' }
  };
  
  return stats[difficulty as keyof typeof stats] || stats.beginner;
};

// Helper for generating cell positions for effects
export const getCellPosition = (
  row: number,
  col: number,
  cellSize: number = 32,
  gridOffset: { x: number; y: number } = { x: 0, y: 0 }
): { x: number; y: number } => {
  return {
    x: gridOffset.x + (col * cellSize) + (cellSize / 2),
    y: gridOffset.y + (row * cellSize) + (cellSize / 2)
  };
};

// Enhanced validation helpers
export const validateGameState = (
  grid: Cell[][],
  rows: number,
  cols: number,
  expectedMines: number
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Check grid dimensions
  if (grid.length !== rows) {
    errors.push(`Grid has ${grid.length} rows, expected ${rows}`);
  }
  
  if (grid[0]?.length !== cols) {
    errors.push(`Grid has ${grid[0]?.length || 0} columns, expected ${cols}`);
  }
  
  // Count mines
  let actualMines = 0;
  let revealedMines = 0;
  
  for (let row = 0; row < Math.min(grid.length, rows); row++) {
    for (let col = 0; col < Math.min(grid[row]?.length || 0, cols); col++) {
      const cell = grid[row][col];
      if (cell.isMine) {
        actualMines++;
        if (cell.isRevealed) revealedMines++;
      }
    }
  }
  
  if (actualMines !== expectedMines) {
    errors.push(`Found ${actualMines} mines, expected ${expectedMines}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper for calculating optimal first click
export const getSuggestedFirstClick = (rows: number, cols: number): { row: number; col: number } => {
  // Suggest center or near-center for optimal mine distribution
  return {
    row: Math.floor(rows / 2),
    col: Math.floor(cols / 2)
  };
};