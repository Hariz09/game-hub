// optimized-page.tsx
'use client';

import React, { useReducer, useMemo, useCallback } from 'react';
import { DIFFICULTIES, Difficulty } from '@/types/minesweeper';
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
import { GameControls } from '@/components/minesweeper/GameControl';
import { GameInstructions } from '@/components/minesweeper/GameInstruction';
import { GameMessages } from '@/components/minesweeper/GameMessages';
import { MobileHelp } from '@/components/minesweeper/MobileHelp';
import { ScoreDisplay } from '@/components/minesweeper/ScoreDisplay';
import { Leaderboard } from '@/components/minesweeper/Leaderboard';
import Sidebar from '@/components/sidebar/Sidebar';
import CleanBackground from '@/components/CleanBackground';
import { OptimizedGrid } from '@/components/minesweeper/OptimizedGrid';
import { DynamicHeader } from '@/components/minesweeper/Hedaer';

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
  const onDifficultyChange = useCallback((newDifficulty: Difficulty) => {
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

  // Filter leaderboard entries to ensure duration_seconds is defined
  const filteredLeaderboard = useMemo(() => 
    scoring.leaderboard.filter(entry => entry.duration_seconds !== undefined)
      .map(entry => ({
        ...entry,
        duration_seconds: entry.duration_seconds as number
      })),
    [scoring.leaderboard]
  );

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
          <DynamicHeader sounds={{
            soundEnabled: sounds.soundEnabled,
            setSoundEnabled: sounds.setSoundEnabled
          }}          
          />

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
                  userBestScore={scoring.userBestScore ?? undefined}
                />
              </div>

              <div className="backdrop-blur-xl bg-gradient-to-br from-white/15 via-white/10 to-white/15 dark:from-black/15 dark:via-black/10 dark:to-black/15 rounded-3xl p-6 border border-white/25 dark:border-white/10 shadow-2xl">
                <Leaderboard
                  leaderboard={filteredLeaderboard}
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