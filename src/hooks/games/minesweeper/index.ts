// Main exports - for most use cases, just import the main hook
export { useMinesweeper } from './use-minesweeper';

// Individual hook exports - for advanced use cases or testing
export { useSoundSystem } from './use-sound-system';
export { useParticleSystem } from './use-particle-system';
export { useAnimationSystem } from './use-animation-system';
export { useGameScoring } from './use-game-scoring';
export { 
  useAnnouncements, 
  useFocusedCell, 
  useTouchHandlers 
} from './use-basic-game-hooks';
export { useGameActions } from './use-game-actions';
export { useKeyboardNavigation } from './use-keyboard-navigation';
export { useTouchEventHandlers } from './use-touch-event-handlers';
export { useGameTimer, useGridInitialization } from './use-game-timer';