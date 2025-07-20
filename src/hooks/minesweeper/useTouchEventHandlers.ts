import React, { useCallback, useRef } from 'react';
import { useTouchHandlers } from './useBasicGameHooks';

export const useTouchEventHandlers = (
  { longPressTimer, setLongPressTimer, touchStartTime, setTouchStartTime }: ReturnType<typeof useTouchHandlers>,
  handleCellClick: (row: number, col: number, element?: HTMLElement) => void,
  handleFlag: (row: number, col: number, element?: HTMLElement) => void
) => {
  const justFlaggedRef = useRef(false);

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
    justFlaggedRef.current = false;
    
    const timer = setTimeout(() => {
      hapticFeedback('medium');
      handleFlag(row, col, e.currentTarget as HTMLElement);
      justFlaggedRef.current = true;
      
      // Add delay after flagging to prevent immediate unflagging
      setTimeout(() => {
        justFlaggedRef.current = false;
      }, 200); // 200ms delay after flagging
      
      setLongPressTimer(null);
    }, 500);
    
    setLongPressTimer(timer);
  }, [handleFlag, setTouchStartTime, setLongPressTimer, hapticFeedback]);

  const handleTouchEnd = useCallback((e: React.TouchEvent, row: number, col: number) => {
    e.preventDefault();
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      
      // Only handle click if it was a short press and we didn't just flag
      if (Date.now() - touchStartTime < 5000 && !justFlaggedRef.current) {
        hapticFeedback('light');
        handleCellClick(row, col, e.currentTarget as HTMLElement);
      }
    } else if (!justFlaggedRef.current) {
      // Handle case where touch end happens after long press timer already fired
      // but only if we didn't just flag (to prevent immediate unflagging)
      if (Date.now() - touchStartTime >= 5000) {
        // This was a long press that already triggered flagging, do nothing
        return;
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