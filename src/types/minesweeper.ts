export interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type GameState = 'playing' | 'won' | 'lost';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 }
} as const;

export interface MinesweeperState {
  difficulty: Difficulty;
  grid: Cell[][];
  gameState: GameState;
  flagCount: number;
  firstClick: boolean;
  timer: number;
  isTimerRunning: boolean;
}

export type MinesweeperAction =
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'INITIALIZE_GRID'; payload: Cell[][] }
  | { type: 'PLACE_MINES_AND_CALCULATE'; payload: { grid: Cell[][]; row: number; col: number } }
  | { type: 'REVEAL_CELLS'; payload: { grid: Cell[][]; row: number; col: number } }
  | { type: 'TOGGLE_FLAG'; payload: { row: number; col: number } }
  | { type: 'GAME_WON' }
  | { type: 'GAME_LOST'; payload: Cell[][] }
  | { type: 'RESET_GAME'; payload: { difficulty: Difficulty; grid: Cell[][] } }
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'INCREMENT_TIMER' };

// Enhanced types for new features
export interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'explosion' | 'confetti' | 'flag';
  timestamp: number;
}

export interface GameStats {
  revealedCells: number;
  flaggedCells: number;
  remainingMines: number;
  progress: number;
  safeCellsRemaining: number;
}

export interface DifficultyStats {
  cells: number;
  mines: number;
  density: string;
}

export interface CellPosition {
  x: number;
  y: number;
}

export interface GameValidation {
  isValid: boolean;
  errors: string[];
}

// Hook return types for better TypeScript support
export interface SoundSystem {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playClickSound: () => void;
  playFlagSound: () => void;
  playRevealSound: () => void;
  playExplosionSound: () => void;
  playVictorySound: () => void;
}

export interface ParticleSystem {
  particles: Particle[];
  addParticles: (x: number, y: number, type: 'explosion' | 'confetti' | 'flag') => void;
  clearParticles: () => void;
}

export interface AnimationSystem {
  animateCell: (row: number, col: number, duration?: number) => void;
  triggerGridShake: () => void;
  triggerGridCelebration: () => void;
  isCellAnimating: (row: number, col: number) => boolean;
  shakeGrid: boolean;
  celebrateGrid: boolean;
  clearAnimations: () => void;
}

export interface TouchHandlers {
  longPressTimer: NodeJS.Timeout | null;
  setLongPressTimer: (timer: NodeJS.Timeout | null) => void;
  touchStartTime: number;
  setTouchStartTime: (time: number) => void;
}

// Enhanced configuration with display names
export const DIFFICULTY_CONFIG = {
  easy: { 
    ...DIFFICULTIES.easy, 
    name: 'Easy', 
    description: 'Perfect for beginners',
    color: 'green'
  },
  medium: { 
    ...DIFFICULTIES.medium, 
    name: 'Medium', 
    description: 'Moderate challenge',
    color: 'yellow'
  },
  hard: { 
    ...DIFFICULTIES.hard, 
    name: 'Hard', 
    description: 'Expert level',
    color: 'red'
  }
} as const;

// Extend the Window interface to include webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}