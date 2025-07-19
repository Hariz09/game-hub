'use client';

import React, { useReducer } from 'react';
import { DIFFICULTIES } from '@/types/minesweeper';
import { 
  useAnnouncements, 
  useFocusedCell, 
  useTouchHandlers, 
  useGameActions, 
  useKeyboardNavigation,
  useTouchEventHandlers,
  useGameTimer,
  useGridInitialization,
  useSoundSystem,
  useParticleSystem,
  useAnimationSystem
} from '@/hooks/useMinesweeper';
import { initialState, minesweeperReducer } from '@/lib/reducer/minesweeper';
import { getCellContent, getCellClasses, getAriaLabel } from '@/utils/minesweeper';
import { GameControls } from '@/components/minesweeper/GameControl';
import { GameInstructions } from '@/components/minesweeper/GameInstruction';
import { GameMessages } from '@/components/minesweeper/GameMessages';
import { MobileHelp } from '@/components/minesweeper/MobileHelp';

export default function MinesweeperPage() {
  const [state, dispatch] = useReducer(minesweeperReducer, initialState);
  const { announcements, announce } = useAnnouncements();
  const { focusedCell, setFocusedCell } = useFocusedCell();
  const touchHandlers = useTouchHandlers();
  
  // Enhanced feature systems
  const sounds = useSoundSystem();
  const particles = useParticleSystem();
  const animations = useAnimationSystem();
  
  const config = DIFFICULTIES[state.difficulty];
  const remainingMines = config.mines - state.flagCount;

  // Get game actions from custom hook with enhanced features
  const { handleCellClick, handleFlag, resetGame, changeDifficulty } = useGameActions(
    state, 
    dispatch, 
    announce, 
    sounds, 
    particles, 
    animations
  );
  
  // Set up keyboard navigation
  useKeyboardNavigation(focusedCell, setFocusedCell, state, handleCellClick, handleFlag, announce);
  
  // Touch event handlers
  const { handleTouchStart, handleTouchEnd, handleRightClick } = useTouchEventHandlers(
    touchHandlers,
    handleCellClick,
    handleFlag
  );

  // Timer management
  useGameTimer(state, dispatch);
  
  // Grid initialization
  useGridInitialization(state, dispatch, focusedCell, setFocusedCell);

  const onDifficultyChange = (newDifficulty: any) => {
    changeDifficulty(newDifficulty, setFocusedCell);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 md:py-8">
      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcements}
      </div>
      
      {/* Particle effects container */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.particles.map(particle => (
          <div
            key={particle.id}
            className={`absolute w-2 h-2 rounded-full animate-ping ${
              particle.type === 'explosion' 
                ? 'bg-red-500' 
                : particle.type === 'confetti'
                ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500'
                : 'bg-yellow-400'
            }`}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              animationDuration: particle.type === 'confetti' ? '3s' : '1s',
              transform: `translate(-50%, -50%) scale(${particle.type === 'explosion' ? 1.5 : 1})`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center flex-grow text-gray-800">
            💣 Minesweeper
          </h1>
          
          {/* Sound toggle */}
          <button
            onClick={() => sounds.setSoundEnabled(!sounds.soundEnabled)}
            className={`p-2 rounded-lg transition-colors ${
              sounds.soundEnabled 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
            }`}
            title={`Sound ${sounds.soundEnabled ? 'enabled' : 'disabled'}`}
            aria-label={`Toggle sound ${sounds.soundEnabled ? 'off' : 'on'}`}
          >
            {sounds.soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <GameControls
          difficulty={state.difficulty}
          gameState={state.gameState}
          remainingMines={remainingMines}
          timer={state.timer}
          onDifficultyChange={onDifficultyChange}
          onResetGame={resetGame}
        />

        <GameInstructions />
        
        {/* Game Grid */}
        <div className="flex justify-center overflow-auto">
          <div 
            className={`inline-block bg-white p-2 md:p-4 rounded-lg shadow-lg transition-transform duration-300 ${
              animations.shakeGrid ? 'animate-pulse transform scale-95' : ''
            } ${
              animations.celebrateGrid ? 'animate-bounce' : ''
            }`}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
              gap: '1px'
            }}
            role="grid"
            aria-label="Minesweeper game board"
          >
            {state.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClasses(
                    cell, 
                    rowIndex, 
                    colIndex, 
                    focusedCell,
                    animations.isCellAnimating(rowIndex, colIndex),
                    animations.shakeGrid,
                    animations.celebrateGrid
                  )}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                  onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                  onTouchEnd={(e) => handleTouchEnd(e, rowIndex, colIndex)}
                  onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                  disabled={state.gameState !== 'playing'}
                  role="gridcell"
                  aria-label={getAriaLabel(
                    cell, 
                    rowIndex, 
                    colIndex, 
                    config.rows, 
                    config.cols, 
                    remainingMines
                  )}
                  tabIndex={focusedCell && focusedCell.row === rowIndex && focusedCell.col === colIndex ? 0 : -1}
                >
                  {getCellContent(cell)}
                </button>
              ))
            )}
          </div>
        </div>

        <GameMessages gameState={state.gameState} timer={state.timer} />
        <MobileHelp />
        
        {/* Enhanced accessibility info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Sound: {sounds.soundEnabled ? 'Enabled' : 'Disabled'} | 
            Progress: {Math.round(((config.rows * config.cols - config.mines - state.grid.flat().filter(cell => !cell.isRevealed && !cell.isMine).length) / (config.rows * config.cols - config.mines)) * 100) || 0}%
          </p>
        </div>
      </div>
    </div>
  );
}