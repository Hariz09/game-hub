// Main exports - for most use cases, just import the main hook
export { useMinesweeper } from './useMinesweeper';

// Individual hook exports - for advanced use cases or testing
export { useSoundSystem } from './useSoundSystem';
export { useParticleSystem } from './useParticleSystem';
export { useAnimationSystem } from './useAnimationSystem';
export { useGameScoring } from './useGameScoring';
export { 
  useAnnouncements, 
  useFocusedCell, 
  useTouchHandlers 
} from './useBasicGameHooks';
export { useGameActions } from './useGameActions';
export { useKeyboardNavigation } from './useKeyboardNavigation';
export { useTouchEventHandlers } from './useTouchEventHandlers';
export { useGameTimer, useGridInitialization } from './useGameTimer';