// Main Minesweeper hook that orchestrates all other hooks
import React from 'react';
import { MinesweeperState, MinesweeperAction } from '@/types/minesweeper';

// Import all the separated hooks
import { useSoundSystem } from './use-sound-system';
import { useParticleSystem } from './use-particle-system';
import { useAnimationSystem } from './use-animation-system';
import { useGameScoring } from './use-game-scoring';
import { useAnnouncements, useFocusedCell, useTouchHandlers } from './use-basic-game-hooks';
import { useGameActions } from './use-game-actions';
import { useKeyboardNavigation } from './use-keyboard-navigation';
import { useTouchEventHandlers } from './use-touch-event-handlers';
import { useGameTimer, useGridInitialization } from './use-game-timer';

// Main hook that brings everything together
export const useMinesweeper = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>
) => {
  // Initialize all sub-hooks
  const sounds = useSoundSystem();
  const particles = useParticleSystem();
  const animations = useAnimationSystem();
  const scoring = useGameScoring();
  const { announcements, announce } = useAnnouncements();
  const { focusedCell, setFocusedCell } = useFocusedCell();
  const touchHandlers = useTouchHandlers();

  // Game actions hook
  const gameActions = useGameActions(
    state,
    dispatch,
    announce,
    sounds,
    particles,
    animations,
    scoring
  );

  // Navigation hooks
  useKeyboardNavigation(
    focusedCell,
    setFocusedCell,
    state,
    gameActions.handleCellClick,
    gameActions.handleFlag,
    announce
  );

  const touchEvents = useTouchEventHandlers(
    touchHandlers,
    gameActions.handleCellClick,
    gameActions.handleFlag
  );

  // Timer and grid initialization hooks
  useGameTimer(state, dispatch);
  useGridInitialization(state, dispatch, focusedCell, setFocusedCell);

  // Return all the functionality
  return {
    // Game state
    state,
    dispatch,

    // Sub-systems
    sounds,
    particles,
    animations,
    scoring,

    // UI state
    announcements,
    focusedCell,
    setFocusedCell,

    // Actions
    ...gameActions,

    // Event handlers
    ...touchEvents,

    // Utilities
    announce
  };
};