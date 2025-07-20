import { useCallback, useState } from 'react';

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