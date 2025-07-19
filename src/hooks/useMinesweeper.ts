import { useCallback, useState, useEffect, useRef } from 'react';
import { Cell, MinesweeperState, MinesweeperAction, DIFFICULTIES } from '@/types/minesweeper';
import { 
  placeMines, 
  calculateAdjacentMines, 
  revealCells, 
  checkWin, 
  createEmptyGrid 
} from '@/utils/minesweeper';

// Enhanced sound system
export const useSoundSystem = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createBeep = useCallback((frequency: number, duration: number, volume: number = 0.3) => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [soundEnabled, initAudioContext]);

  const playClickSound = useCallback(() => createBeep(800, 0.1), [createBeep]);
  const playFlagSound = useCallback(() => createBeep(1000, 0.15), [createBeep]);
  const playRevealSound = useCallback(() => createBeep(600, 0.08), [createBeep]);
  const playExplosionSound = useCallback(() => {
    // Explosion sound sequence
    createBeep(150, 0.3, 0.5);
    setTimeout(() => createBeep(100, 0.4, 0.3), 100);
  }, [createBeep]);
  
  const playVictorySound = useCallback(() => {
    // Victory melody
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((freq, index) => {
      setTimeout(() => createBeep(freq, 0.3, 0.4), index * 200);
    });
  }, [createBeep]);

  return {
    soundEnabled,
    setSoundEnabled,
    playClickSound,
    playFlagSound,
    playRevealSound,
    playExplosionSound,
    playVictorySound
  };
};

// Enhanced particle system
export const useParticleSystem = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    type: 'explosion' | 'confetti' | 'flag';
    timestamp: number;
  }>>([]);

  const addParticles = useCallback((x: number, y: number, type: 'explosion' | 'confetti' | 'flag') => {
    const newParticles = Array.from({ length: type === 'explosion' ? 8 : 12 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      type,
      timestamp: Date.now()
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => 
        !newParticles.some(newP => newP.id === p.id)
      ));
    }, type === 'confetti' ? 3000 : 1000);
  }, []);

  const clearParticles = useCallback(() => {
    setParticles([]);
  }, []);

  return { particles, addParticles, clearParticles };
};

// Enhanced animations system
export const useAnimationSystem = () => {
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set());
  const [shakeGrid, setShakeGrid] = useState(false);
  const [celebrateGrid, setCelebrateGrid] = useState(false);

  const animateCell = useCallback((row: number, col: number, duration: number = 300) => {
    const cellId = `${row}-${col}`;
    setAnimatingCells(prev => new Set([...prev, cellId]));
    
    setTimeout(() => {
      setAnimatingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellId);
        return newSet;
      });
    }, duration);
  }, []);

  const triggerGridShake = useCallback(() => {
    setShakeGrid(true);
    setTimeout(() => setShakeGrid(false), 600);
  }, []);

  const triggerGridCelebration = useCallback(() => {
    setCelebrateGrid(true);
    setTimeout(() => setCelebrateGrid(false), 2000);
  }, []);

  const isCellAnimating = useCallback((row: number, col: number) => {
    return animatingCells.has(`${row}-${col}`);
  }, [animatingCells]);

  return {
    animateCell,
    triggerGridShake,
    triggerGridCelebration,
    isCellAnimating,
    shakeGrid,
    celebrateGrid,
    clearAnimations: () => {
      setAnimatingCells(new Set());
      setShakeGrid(false);
      setCelebrateGrid(false);
    }
  };
};

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<string>('');

  const announce = useCallback((message: string) => {
    setAnnouncements(message);
    setTimeout(() => setAnnouncements(''), 1000);
  }, []);

  return { announcements, announce };
};

export const useFocusedCell = () => {
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  return { focusedCell, setFocusedCell };
};

export const useTouchHandlers = () => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);

  return {
    longPressTimer,
    setLongPressTimer,
    touchStartTime,
    setTouchStartTime,
  };
};

export const useGameActions = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>,
  announce: (message: string) => void,
  sounds: ReturnType<typeof useSoundSystem>,
  particles: ReturnType<typeof useParticleSystem>,
  animations: ReturnType<typeof useAnimationSystem>
) => {
  const config = DIFFICULTIES[state.difficulty];

  const handleCellClick = useCallback((row: number, col: number, cellElement?: HTMLElement) => {
    if (state.gameState !== 'playing' || state.grid[row][col].isRevealed || state.grid[row][col].isFlagged) {
      return;
    }

    let newGrid = [...state.grid];
    
    // Play click sound and animate cell
    sounds.playClickSound();
    animations.animateCell(row, col);

    // First click - place mines and calculate adjacent counts
    if (state.firstClick) {
      newGrid = placeMines(newGrid, row, col, config.rows, config.cols, config.mines);
      newGrid = calculateAdjacentMines(newGrid, config.rows, config.cols);
      dispatch({ type: 'PLACE_MINES_AND_CALCULATE', payload: { grid: newGrid, row, col } });
      newGrid = revealCells(newGrid, row, col, config.rows, config.cols);
      announce('Game started. First cell revealed.');
    } else {
      newGrid = revealCells(newGrid, row, col, config.rows, config.cols);
    }

    // Check if mine was clicked
    if (newGrid[row][col].isMine) {
      const gameOverGrid = newGrid.map(gridRow =>
        gridRow.map(cell =>
          cell.isMine ? { ...cell, isRevealed: true } : cell
        )
      );
      
      // Explosion effects
      sounds.playExplosionSound();
      animations.triggerGridShake();
      
      if (cellElement) {
        const rect = cellElement.getBoundingClientRect();
        particles.addParticles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          'explosion'
        );
      }
      
      dispatch({ type: 'GAME_LOST', payload: gameOverGrid });
      announce('Game over! You hit a mine.');
    } else {
      sounds.playRevealSound();
      dispatch({ type: 'REVEAL_CELLS', payload: { grid: newGrid, row, col } });
      
      const cell = newGrid[row][col];
      if (cell.adjacentMines === 0) {
        announce('Empty cell revealed, clearing surrounding area.');
      } else {
        announce(`Cell revealed with ${cell.adjacentMines} adjacent mines.`);
      }
      
      if (checkWin(newGrid, config.rows, config.cols)) {
        // Victory effects
        sounds.playVictorySound();
        animations.triggerGridCelebration();
        
        // Add confetti particles across the grid
        setTimeout(() => {
          for (let i = 0; i < 20; i++) {
            setTimeout(() => {
              particles.addParticles(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight * 0.5,
                'confetti'
              );
            }, i * 100);
          }
        }, 300);
        
        dispatch({ type: 'GAME_WON' });
        announce(`Congratulations! You won in ${state.timer} seconds!`);
      }
    }
  }, [state.gameState, state.grid, state.firstClick, state.timer, config, announce, sounds, particles, animations]);

  const handleFlag = useCallback((row: number, col: number, cellElement?: HTMLElement) => {
    if (state.gameState !== 'playing' || state.grid[row][col].isRevealed) {
      return;
    }

    const cell = state.grid[row][col];
    
    // Play flag sound and animate
    sounds.playFlagSound();
    animations.animateCell(row, col, 200);
    
    if (cellElement && !cell.isFlagged) {
      const rect = cellElement.getBoundingClientRect();
      particles.addParticles(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        'flag'
      );
    }
    
    dispatch({ type: 'TOGGLE_FLAG', payload: { row, col } });
    
    if (cell.isFlagged) {
      announce('Flag removed');
    } else {
      announce('Flag placed');
    }
  }, [state.gameState, state.grid, announce, sounds, animations, particles]);

  const resetGame = useCallback(() => {
    const newGrid = createEmptyGrid(config.rows, config.cols);
    dispatch({ type: 'RESET_GAME', payload: { difficulty: state.difficulty, grid: newGrid } });
    animations.clearAnimations();
    particles.clearParticles();
    announce('New game started');
  }, [config.rows, config.cols, state.difficulty, announce, animations, particles]);

  const changeDifficulty = useCallback((newDifficulty: any, setFocusedCell: any) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: newDifficulty });
    setFocusedCell(null);
    animations.clearAnimations();
    particles.clearParticles();
    announce(`Difficulty changed to ${newDifficulty}`);
  }, [announce, animations, particles]);

  return {
    handleCellClick,
    handleFlag,
    resetGame,
    changeDifficulty,
  };
};

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

// Enhanced touch event handlers with haptic feedback
export const useTouchEventHandlers = (
  { longPressTimer, setLongPressTimer, touchStartTime, setTouchStartTime }: ReturnType<typeof useTouchHandlers>,
  handleCellClick: (row: number, col: number, element?: HTMLElement) => void,
  handleFlag: (row: number, col: number, element?: HTMLElement) => void
) => {
  const hapticFeedback = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50]
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    setTouchStartTime(Date.now());
    
    const timer = setTimeout(() => {
      hapticFeedback('medium');
      handleFlag(row, col, e.currentTarget as HTMLElement);
      setLongPressTimer(null);
    }, 500);
    
    setLongPressTimer(timer);
  }, [handleFlag, setTouchStartTime, setLongPressTimer, hapticFeedback]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      
      // If it was a short press (less than 500ms), treat it as a click
      if (Date.now() - touchStartTime < 500) {
        hapticFeedback('light');
        handleCellClick(row, col, e.currentTarget as HTMLElement);
      }
    }
  }, [longPressTimer, touchStartTime, handleCellClick, setLongPressTimer, hapticFeedback]);

  const handleRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    handleFlag(row, col, e.currentTarget as HTMLElement);
  }, [handleFlag]);

  return {
    handleTouchStart,
    handleTouchEnd,
    handleRightClick,
  };
};

// Hook for timer management
export const useGameTimer = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>
) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isTimerRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'INCREMENT_TIMER' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isTimerRunning, dispatch]);
};

// Hook for grid initialization
export const useGridInitialization = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>,
  focusedCell: { row: number; col: number } | null,
  setFocusedCell: (cell: { row: number; col: number } | null) => void
) => {
  const config = DIFFICULTIES[state.difficulty];

  // Initialize grid on difficulty change
  useEffect(() => {
    const newGrid = createEmptyGrid(config.rows, config.cols);
    dispatch({ type: 'INITIALIZE_GRID', payload: newGrid });
  }, [state.difficulty, config.rows, config.cols, dispatch]);

  // Initialize focus on first cell when game starts
  useEffect(() => {
    if (state.grid.length > 0 && !focusedCell) {
      setFocusedCell({ row: 0, col: 0 });
    }
  }, [state.grid.length, focusedCell, setFocusedCell]);
};