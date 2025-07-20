// optimized-page.tsx
'use client';

import React, { useReducer, useMemo, useCallback, memo, useEffect, useState } from 'react';
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
  useAnimationSystem,
  useGameScoring
} from '@/hooks/minesweeper';
import { initialState, minesweeperReducer } from '@/lib/reducer/minesweeper';
import { getCellContent, getCellClasses, getAriaLabel } from '@/utils/minesweeper';
import { GameControls } from '@/components/minesweeper/GameControl';
import { GameInstructions } from '@/components/minesweeper/GameInstruction';
import { GameMessages } from '@/components/minesweeper/GameMessages';
import { MobileHelp } from '@/components/minesweeper/MobileHelp';
import { ScoreDisplay } from '@/components/minesweeper/ScoreDisplay';
import { Leaderboard } from '@/components/minesweeper/Leaderboard';
import Sidebar from '@/components/sidebar/Sidebar';
import CleanBackground from '@/components/CleanBackground';
import { Cell } from '@/types/minesweeper';

// Optimized Cell Component - Memoized to prevent unnecessary re-renders
interface OptimizedCellProps {
  cell: Cell;
  rowIndex: number;
  colIndex: number;
  cellSize: number;
  fontSize: number;
  isFocused: boolean;
  isAnimating: boolean;
  shakeGrid: boolean;
  celebrateGrid: boolean;
  gridConfig: { rows: number; cols: number };
  remainingMines: number;
  onCellClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
  onTouchStart: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEnd: (e: React.TouchEvent, row: number, col: number) => void;
  onFocus: () => void;
  gameState: string;
}

const OptimizedCell = memo<OptimizedCellProps>(({
  cell,
  rowIndex,
  colIndex,
  cellSize,
  fontSize,
  isFocused,
  isAnimating,
  shakeGrid,
  celebrateGrid,
  gridConfig,
  remainingMines,
  onCellClick,
  onRightClick,
  onTouchStart,
  onTouchEnd,
  onFocus,
  gameState
}) => {
  // Memoize expensive calculations
  const cellClasses = useMemo(() => {
    const focusedCell = isFocused ? { row: rowIndex, col: colIndex } : null;
    return getCellClasses(
      cell,
      rowIndex,
      colIndex,
      focusedCell,
      isAnimating,
      shakeGrid,
      celebrateGrid
    );
  }, [cell, rowIndex, colIndex, isFocused, isAnimating, shakeGrid, celebrateGrid]);

  const ariaLabel = useMemo(() => {
    return getAriaLabel(
      cell,
      rowIndex,
      colIndex,
      gridConfig.rows,
      gridConfig.cols,
      remainingMines
    );
  }, [cell, rowIndex, colIndex, gridConfig.rows, gridConfig.cols, remainingMines]);

  // Precompute corner/edge status
  const { isCornerCell, isEdgeCell } = useMemo(() => {
    const isCorner = (rowIndex === 0 || rowIndex === gridConfig.rows - 1) &&
      (colIndex === 0 || colIndex === gridConfig.cols - 1);
    const isEdge = rowIndex === 0 || rowIndex === gridConfig.rows - 1 ||
      colIndex === 0 || colIndex === gridConfig.cols - 1;
    return { isCornerCell: isCorner, isEdgeCell: isEdge };
  }, [rowIndex, colIndex, gridConfig.rows, gridConfig.cols]);

  // Optimized style object - memoized to prevent recreation
  const cellStyle = useMemo(() => ({
    width: `${cellSize}px`,
    height: `${cellSize}px`,
    fontSize: `${fontSize}px`,
    minWidth: `${cellSize}px`,
    minHeight: `${cellSize}px`,
    maxWidth: `${cellSize}px`,
    maxHeight: `${cellSize}px`,
    boxSizing: 'border-box' as const
  }), [cellSize, fontSize]);

  // Optimized click handlers
  const handleClick = useCallback(() => {
    onCellClick(rowIndex, colIndex);
  }, [onCellClick, rowIndex, colIndex]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    onRightClick(e, rowIndex, colIndex);
  }, [onRightClick, rowIndex, colIndex]);

  const handleTouchStartEvent = useCallback((e: React.TouchEvent) => {
    onTouchStart(e, rowIndex, colIndex);
  }, [onTouchStart, rowIndex, colIndex]);

  const handleTouchEndEvent = useCallback((e: React.TouchEvent) => {
    onTouchEnd(e, rowIndex, colIndex);
  }, [onTouchEnd, rowIndex, colIndex]);

  // Simplified cell content styling
  const contentClassName = useMemo(() => {
    if (!cell.isRevealed || cell.adjacentMines === 0) return 'text-current';

    const colorMap = {
      1: 'text-blue-600 dark:text-blue-400',
      2: 'text-green-600 dark:text-green-400',
      3: 'text-red-600 dark:text-red-400',
      4: 'text-purple-600 dark:text-purple-400',
      5: 'text-yellow-600 dark:text-yellow-400',
      6: 'text-pink-600 dark:text-pink-400',
      7: 'text-indigo-600 dark:text-indigo-400',
      8: 'text-gray-800 dark:text-gray-200'
    };

    return `font-extrabold ${colorMap[cell.adjacentMines as keyof typeof colorMap] || colorMap[8]}`;
  }, [cell.isRevealed, cell.adjacentMines]);

  // Simplified base classes - reduced complexity
  const baseClasses = useMemo(() => {
    let classes = `relative transition-all duration-200 transform-gpu flex-shrink-0 border font-bold flex items-center justify-center overflow-hidden group z-0 ${isCornerCell ? 'rounded-lg' : 'rounded-md'}`;

    // Enhanced background classes based on cell state
    if (cell.isRevealed) {
      if (cell.isMine) {
        classes += ' bg-gradient-to-br from-red-500 to-red-700 border-red-500 text-white shadow-lg shadow-red-500/25';
      } else if (cell.adjacentMines > 0) {
        classes += ' bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 border-blue-200 dark:border-slate-500 shadow-sm';
      } else {
        classes += ' bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border-emerald-200 dark:border-gray-600 shadow-sm';
      }
    } else if (cell.isFlagged) {
      classes += ' bg-gradient-to-br from-amber-400 to-orange-500 border-amber-400 text-white hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-amber-500/30 transform hover:scale-[1.02]';
    } else {
      classes += ' bg-gradient-to-br from-slate-100/80 to-slate-200/60 dark:from-gray-600/80 dark:to-gray-700/60 border-slate-200 dark:border-gray-500 hover:from-violet-200/70 hover:to-purple-300/50 hover:border-violet-300 hover:scale-105 hover:shadow-md hover:shadow-violet-500/20 active:scale-95 backdrop-blur-sm';
    }

    if (isFocused) {
      classes += ' ring-2 ring-violet-400 dark:ring-violet-300 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 z-10 shadow-lg shadow-violet-500/25';
    }

    return classes;
  }, [cell.isRevealed, cell.isMine, cell.adjacentMines, cell.isFlagged, isFocused, isCornerCell]);

  return (
    <button
      className={baseClasses}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onTouchStart={handleTouchStartEvent}
      onTouchEnd={handleTouchEndEvent}
      onFocus={onFocus}
      disabled={gameState !== 'playing'}
      role="gridcell"
      aria-label={ariaLabel}
      tabIndex={isFocused ? 0 : -1}
      style={cellStyle}
    >
      <span className={`drop-shadow-sm select-none ${contentClassName} group-hover:scale-110 group-active:scale-90`}>
        {getCellContent(cell)}
      </span>
    </button>
  );
});

OptimizedCell.displayName = 'OptimizedCell';

// Optimized Grid Component
interface OptimizedGridProps {
  grid: Cell[][];
  config: { rows: number; cols: number; mines: number };
  gameState: string;
  focusedCell: { row: number; col: number } | null;
  remainingMines: number;
  animations: {
    shakeGrid: boolean;
    celebrateGrid: boolean;
    isCellAnimating: (row: number, col: number) => boolean;
  };
  onCellClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
  onTouchStart: (e: React.TouchEvent, row: number, col: number) => void;
  onTouchEnd: (e: React.TouchEvent, row: number, col: number) => void;
  onFocusCell: (row: number, col: number) => void;
}

const OptimizedGrid = memo<OptimizedGridProps>(({
  grid,
  config,
  gameState,
  focusedCell,
  remainingMines,
  animations,
  onCellClick,
  onRightClick,
  onTouchStart,
  onTouchEnd,
  onFocusCell
}) => {
  // Fix hydration issue: Use state to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate default dimensions (server-side safe)
  const getDefaultDimensions = useCallback(() => {
    // Use conservative defaults for SSR
    const defaultWidth = 800;
    const defaultHeight = 600;
    const paddingTotal = 48;
    const gap = Math.max(1, Math.min(4, 200 / Math.max(config.cols, config.rows)));
    const gapTotal = gap * (config.cols - 1);

    const maxCellWidth = Math.floor((defaultWidth - paddingTotal - gapTotal) / config.cols);
    const maxCellHeight = Math.floor((defaultHeight - paddingTotal - (gap * (config.rows - 1))) / config.rows);

    const size = Math.max(20, Math.min(48, Math.min(maxCellWidth, maxCellHeight)));
    const font = Math.max(8, Math.min(16, size * 0.35));

    return {
      cellSize: size,
      fontSize: font,
      gapSize: gap,
    };
  }, [config.cols, config.rows]);

  // Memoize grid calculations with hydration-safe approach
  const { cellSize, fontSize, gridStyle, gapSize } = useMemo(() => {
    let availableWidth = 800; // Default for SSR
    let availableHeight = 600; // Default for SSR

    // Only use window dimensions after hydration
    if (isMounted && typeof window !== 'undefined') {
      availableWidth = Math.min(window.innerWidth * 0.85, 800);
      availableHeight = Math.min(window.innerHeight * 0.65, 600);
    }

    const paddingTotal = 48;
    const gap = Math.max(1, Math.min(4, 200 / Math.max(config.cols, config.rows)));
    const gapTotal = gap * (config.cols - 1);

    const maxCellWidth = Math.floor((availableWidth - paddingTotal - gapTotal) / config.cols);
    const maxCellHeight = Math.floor((availableHeight - paddingTotal - (gap * (config.rows - 1))) / config.rows);

    const size = Math.max(20, Math.min(48, Math.min(maxCellWidth, maxCellHeight)));
    const font = Math.max(8, Math.min(16, size * 0.35));

    return {
      cellSize: size,
      fontSize: font,
      gapSize: gap,
      gridStyle: {
        display: 'grid',
        gridTemplateColumns: `repeat(${config.cols}, ${size}px)`,
        gap: `${gap}px`,
        maxWidth: 'min(95vw, 800px)',
        maxHeight: 'min(70vh, 600px)',
        width: 'fit-content',
        height: 'fit-content',
      }
    };
  }, [config.cols, config.rows, isMounted]);

  // Memoize grid container classes
  const gridContainerClasses = useMemo(() => {
    let classes = `relative inline-block backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/35 dark:from-black/30 dark:via-black/20 dark:to-black/35 p-6 rounded-3xl shadow-2xl border border-white/40 dark:border-white/15 transition-all duration-700 transform-gpu overflow-hidden`;

    if (animations.shakeGrid) {
      classes += ' animate-pulse scale-95 shadow-red-500/40 border-red-400/60';
    } else if (animations.celebrateGrid) {
      classes += ' animate-bounce scale-105 shadow-purple-500/50 shadow-2xl border-purple-400/60';
    } else {
      classes += ' hover:scale-[1.01] hover:shadow-3xl';
    }

    return classes;
  }, [animations.shakeGrid, animations.celebrateGrid]);

  // Create optimized cell handlers
  const handleFocusCell = useCallback((row: number, col: number) => {
    onFocusCell(row, col);
  }, [onFocusCell]);

  return (
    <div className="flex justify-center items-center min-h-0 flex-1 px-4">
      <div
        className={gridContainerClasses}
        style={gridStyle}
        role="grid"
        aria-label={`Minesweeper game board, ${config.rows} rows by ${config.cols} columns, ${remainingMines} mines remaining`}
      >
        {/* Simplified background */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-black/5 dark:from-black/5 dark:to-white/5 pointer-events-none" />

        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <OptimizedCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              cellSize={cellSize}
              fontSize={fontSize}
              isFocused={focusedCell?.row === rowIndex && focusedCell?.col === colIndex}
              isAnimating={animations.isCellAnimating(rowIndex, colIndex)}
              shakeGrid={animations.shakeGrid}
              celebrateGrid={animations.celebrateGrid}
              gridConfig={config}
              remainingMines={remainingMines}
              onCellClick={onCellClick}
              onRightClick={onRightClick}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onFocus={() => handleFocusCell(rowIndex, colIndex)}
              gameState={gameState}
            />
          ))
        )}
      </div>
    </div>
  );
});

OptimizedGrid.displayName = 'OptimizedGrid';

// Main optimized component
export default function OptimizedMinesweeperPage() {
  const [state, dispatch] = useReducer(minesweeperReducer, initialState);
  const { announcements, announce } = useAnnouncements();
  const { focusedCell, setFocusedCell } = useFocusedCell();
  const touchHandlers = useTouchHandlers();

  const sounds = useSoundSystem();
  const particles = useParticleSystem();
  const animations = useAnimationSystem();
  const scoring = useGameScoring();

  const config = DIFFICULTIES[state.difficulty];
  const remainingMines = config.mines - state.flagCount;

  // Memoize game actions to prevent recreation
  const { handleCellClick, handleFlag, resetGame, changeDifficulty } = useGameActions(
    state,
    dispatch,
    announce,
    sounds,
    particles,
    animations,
    scoring
  );

  useKeyboardNavigation(focusedCell, setFocusedCell, state, handleCellClick, handleFlag, announce);

  const { handleTouchStart, handleTouchEnd, handleRightClick } = useTouchEventHandlers(
    touchHandlers,
    handleCellClick,
    handleFlag
  );

  useGameTimer(state, dispatch);
  useGridInitialization(state, dispatch, focusedCell, setFocusedCell);

  // Memoize difficulty change handler
  const onDifficultyChange = useCallback((newDifficulty: any) => {
    changeDifficulty(newDifficulty, setFocusedCell);
  }, [changeDifficulty, setFocusedCell]);

  // Memoize current progress calculation
  const currentProgress = useMemo(() => {
    const totalCells = config.rows * config.cols;
    const flatGrid = state.grid.flat();
    const revealedCells = flatGrid.filter(cell => cell.isRevealed).length;
    const flaggedCells = flatGrid.filter(cell => cell.isFlagged).length;
    const unrevealedSafeCells = flatGrid.filter(cell => !cell.isRevealed && !cell.isMine).length;
    const progressPercentage = Math.round(((totalCells - config.mines - unrevealedSafeCells) / (totalCells - config.mines)) * 100) || 0;

    return {
      revealedCells,
      flaggedCells,
      progressPercentage,
      moves: revealedCells + flaggedCells
    };
  }, [config.rows, config.cols, config.mines, state.grid]);

  // Memoize particle effects
  const particleEffects = useMemo(() => (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute w-4 h-4 rounded-full transition-all duration-1000 ${particle.type === 'explosion'
              ? 'bg-gradient-to-r from-red-400 to-rose-500 shadow-lg shadow-red-500/50 animate-ping'
              : particle.type === 'confetti'
                ? 'bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-500 shadow-lg shadow-purple-500/50 animate-bounce'
                : 'bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-500/50 animate-pulse'
            }`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            animationDuration: particle.type === 'confetti' ? '2.5s' : particle.type === 'explosion' ? '1.2s' : '1.5s',
            transform: `translate(-50%, -50%) scale(${particle.type === 'explosion' ? 1.8 : particle.type === 'confetti' ? 1.2 : 1})`
          }}
        />
      ))}
    </div>
  ), [particles.particles]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CleanBackground />

      <div className="relative z-10 min-h-screen py-6">
        <Sidebar />

        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcements}
        </div>

        {particleEffects}

        <div className="container mx-auto px-4 max-w-8xl">
          {/* Header */}
          <header className="mb-8">
            <div className="backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-black/20 dark:via-black/10 dark:to-black/20 rounded-3xl p-6 border border-white/30 dark:border-white/10 shadow-2xl shadow-purple-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
                      <span className="text-3xl filter drop-shadow-lg">💣</span>
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 dark:from-purple-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                      Minesweeper
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Strategic puzzle game with enhanced features
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-black/10 rounded-full border border-white/20 dark:border-white/10">
                    <div className={`w-2 h-2 rounded-full ${sounds.soundEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Audio {sounds.soundEnabled ? 'On' : 'Off'}
                    </span>
                  </div>
                  <button
                    onClick={() => sounds.setSoundEnabled(!sounds.soundEnabled)}
                    className={`group relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl backdrop-blur-md border ${sounds.soundEnabled
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400/50 shadow-green-500/25 hover:shadow-green-500/40'
                      : 'bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30 shadow-gray-500/10'
                      }`}
                    title={`Sound ${sounds.soundEnabled ? 'enabled' : 'disabled'}`}
                    aria-label={`Toggle sound ${sounds.soundEnabled ? 'off' : 'on'}`}
                  >
                    <span className="text-2xl transition-transform group-hover:scale-110">
                      {sounds.soundEnabled ? '🔊' : '🔇'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Game controls */}
              <div className="backdrop-blur-xl bg-gradient-to-r from-white/15 via-white/10 to-white/15 dark:from-black/15 dark:via-black/10 dark:to-black/15 rounded-3xl p-6 border border-white/25 dark:border-white/10 shadow-2xl shadow-blue-500/5">
                <GameControls
                  difficulty={state.difficulty}
                  gameState={state.gameState}
                  remainingMines={remainingMines}
                  timer={state.timer}
                  onDifficultyChange={onDifficultyChange}
                  onResetGame={resetGame}
                />
              </div>

              {/* Instructions */}
              <details className="group backdrop-blur-xl bg-gradient-to-r from-white/15 via-white/10 to-white/15 dark:from-black/15 dark:via-black/10 dark:to-black/15 rounded-3xl border border-white/25 dark:border-white/10 shadow-2xl overflow-hidden relative z-10">
                <summary className="p-6 cursor-pointer select-none flex items-center justify-between hover:bg-white/5 dark:hover:bg-black/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">Game Instructions</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">How to play and controls</p>
                    </div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 transform transition-transform group-open:rotate-180">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6">
                  <GameInstructions />
                </div>
              </details>

              {/* Optimized Game Board */}
              <OptimizedGrid
                grid={state.grid}
                config={config}
                gameState={state.gameState}
                focusedCell={focusedCell}
                remainingMines={remainingMines}
                animations={animations}
                onCellClick={handleCellClick}
                onRightClick={handleRightClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onFocusCell={(row, col) => setFocusedCell({ row, col })}
              />

              <div className="xl:hidden backdrop-blur-xl bg-gradient-to-r from-white/15 via-white/10 to-white/15 dark:from-black/15 dark:via-black/10 dark:to-black/15 rounded-3xl p-6 border border-white/25 dark:border-white/10 shadow-2xl">
                <MobileHelp />
              </div>
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 via-white/10 to-white/20 dark:from-black/20 dark:via-black/10 dark:to-black/20 rounded-3xl p-6 border border-white/30 dark:border-white/10 shadow-2xl shadow-purple-500/10">
                <ScoreDisplay
                  currentProgress={currentProgress}
                  gameState={state.gameState}
                  timer={state.timer}
                  difficulty={state.difficulty}
                  isAuthenticated={scoring.isAuthenticated}
                  userBestScore={scoring.userBestScore}
                />
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 via-white/10 to-white/15 dark:from-black/15 dark:via-black/10 dark:to-black/15 rounded-3xl p-6 border border-white/25 dark:border-white/10 shadow-2xl">
                <Leaderboard
                  leaderboard={scoring.leaderboard}
                  isLoading={scoring.isLoading}
                  isAuthenticated={scoring.isAuthenticated}
                  onRefresh={scoring.loadLeaderboard}
                />
              </div>
            </div>
          </div>
        </div>

        <GameMessages
          gameState={state.gameState}
          timer={state.timer}
          onClose={() => {
            if (state.gameState === 'won' || state.gameState === 'lost') {
              resetGame();
            }
          }}
        />
      </div>
    </div>
  );
}