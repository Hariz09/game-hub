import { useCallback } from 'react';
import { Cell, MinesweeperState, MinesweeperAction, DIFFICULTIES, Difficulty } from '@/types/minesweeper';
import { 
  placeMines, 
  calculateAdjacentMines, 
  revealCells, 
  checkWin, 
  createEmptyGrid 
} from '@/utils/minesweeper';
import { useSoundSystem } from './use-sound-system';
import { useParticleSystem } from './use-particle-system';
import { useAnimationSystem } from './use-animation-system';
import { useGameScoring } from './use-game-scoring';

export const useGameActions = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>,
  announce: (message: string) => void,
  sounds: ReturnType<typeof useSoundSystem>,
  particles: ReturnType<typeof useParticleSystem>,
  animations: ReturnType<typeof useAnimationSystem>,
  scoring: ReturnType<typeof useGameScoring>
) => {
  const config = DIFFICULTIES[state.difficulty];
  
  // Calculate game statistics for scoring
  const calculateGameStats = useCallback((grid: Cell[][], timer: number, gameWon: boolean) => {
    const totalCells = config.rows * config.cols;
    const revealedCells = grid.flat().filter(cell => cell.isRevealed).length;
    const flaggedCells = grid.flat().filter(cell => cell.isFlagged).length;
    
    // Score calculation based on multiple factors
    let score = 0;
    
    if (gameWon) {
      // Base score for winning
      score += 1000;
      
      // Difficulty multiplier
      const difficultyMultiplier = state.difficulty === 'easy' ? 1 : 
                                  state.difficulty === 'medium' ? 2 : 3;
      score *= difficultyMultiplier;
      
      // Time bonus (faster = higher score)
      const timeBonus = Math.max(0, 1000 - (timer * 2));
      score += timeBonus;
      
      // Efficiency bonus (fewer unnecessary flags)
      const correctFlags = grid.flat().filter(cell => cell.isFlagged && cell.isMine).length;
      const incorrectFlags = flaggedCells - correctFlags;
      const efficiencyBonus = Math.max(0, (correctFlags * 50) - (incorrectFlags * 25));
      score += efficiencyBonus;
    } else {
      // Partial score for game over (based on progress)
      const progressScore = Math.floor((revealedCells / (totalCells - config.mines)) * 200);
      score = progressScore;
    }
    
    return {
      score: Math.floor(score),
      moves: revealedCells + flaggedCells,
      revealedCells,
      flaggedCells
    };
  }, [config, state.difficulty]);

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
      
      // Save game over score
      const gameStats = calculateGameStats(gameOverGrid, state.timer, false);
      const gameData = {
        difficulty: state.difficulty,
        gridSize: `${config.rows}x${config.cols}`,
        mineCount: config.mines, // Changed from 'mines' to 'mineCount'
        ...gameStats
      };
      
      scoring.saveGameScore(
        gameStats.score,
        gameStats.moves,
        'game_over',
        state.timer,
        gameData
      );
      
      dispatch({ type: 'GAME_LOST', payload: gameOverGrid });
      announce(`Game over! You hit a mine. Score: ${gameStats.score}`);
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
        
        // Save victory score
        const gameStats = calculateGameStats(newGrid, state.timer, true);
        const gameData = {
          difficulty: state.difficulty,
          gridSize: `${config.rows}x${config.cols}`,
          mineCount: config.mines, // Changed from 'mines' to 'mineCount'
          ...gameStats
        };
        
        scoring.saveGameScore(
          gameStats.score,
          gameStats.moves,
          'won',
          state.timer,
          gameData
        );
        
        dispatch({ type: 'GAME_WON' });
        announce(`Congratulations! You won in ${state.timer} seconds! Score: ${gameStats.score}`);
      }
    }
  }, [
    state.gameState, 
    state.grid, 
    state.firstClick, 
    state.timer, 
    state.difficulty,
    config, 
    announce, 
    sounds, 
    particles, 
    animations, 
    scoring, 
    calculateGameStats,
    dispatch
  ]);

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
  }, [state.gameState, state.grid, announce, sounds, animations, particles, dispatch]);

  const resetGame = useCallback(() => {
    const newGrid = createEmptyGrid(config.rows, config.cols);
    dispatch({ type: 'RESET_GAME', payload: { difficulty: state.difficulty, grid: newGrid } });
    animations.clearAnimations();
    particles.clearParticles();
    announce('New game started');
  }, [config.rows, config.cols, state.difficulty, announce, animations, particles, dispatch]);

  const changeDifficulty = useCallback((
    newDifficulty: Difficulty, 
    setFocusedCell: React.Dispatch<React.SetStateAction<{ row: number; col: number } | null>>
  ) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: newDifficulty });
    setFocusedCell(null);
    animations.clearAnimations();
    particles.clearParticles();
    announce(`Difficulty changed to ${newDifficulty}`);
  }, [announce, animations, particles, dispatch]);

  return {
    handleCellClick,
    handleFlag,
    resetGame,
    changeDifficulty,
  };
};