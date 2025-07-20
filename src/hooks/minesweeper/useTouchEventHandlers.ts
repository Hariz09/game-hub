import React, { useCallback } from 'react';
import { useTouchHandlers } from './useBasicGameHooks';

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