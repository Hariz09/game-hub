// components/minesweeper/OptimizedGrid.tsx
'use client';

import React, { memo, useMemo, useCallback, useEffect, useState } from 'react';
import { Cell } from '@/types/minesweeper';
import { OptimizedCell } from './OptimizedCell';

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

export const OptimizedGrid = memo<OptimizedGridProps>(({
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

  // Helper function to detect screen size
  const getScreenBreakpoint = useCallback(() => {
    if (!isMounted || typeof window === 'undefined') {
      return 'lg'; // Default for SSR
    }
    
    const width = window.innerWidth;
    if (width < 480) return 'xs';
    if (width < 640) return 'sm'; 
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  }, [isMounted]);

  // Memoize grid calculations with enhanced small screen support
  const { cellSize, fontSize, gridStyle } = useMemo(() => {
    // Use container width (matching the upper components)
    let containerWidth = 800; // Default for SSR
    const screenSize = getScreenBreakpoint();

    // Only use window dimensions after hydration
    if (isMounted && typeof window !== 'undefined') {
      // Get the actual container width from the parent element
      const container = document.querySelector('.xl\\:col-span-3');
      if (container) {
        containerWidth = container.clientWidth;
      } else {
        // Enhanced fallback calculation based on screen size
        switch (screenSize) {
          case 'xs':
            containerWidth = Math.min(window.innerWidth * 0.95, 320);
            break;
          case 'sm':
            containerWidth = Math.min(window.innerWidth * 0.90, 480);
            break;
          case 'md':
            containerWidth = Math.min(window.innerWidth * 0.85, 640);
            break;
          case 'lg':
            containerWidth = Math.min(window.innerWidth * 0.85, 800);
            break;
          default:
            containerWidth = Math.min(window.innerWidth * 0.85, 1200);
        }
      }
    }

    // Account for the container padding with responsive padding
    let containerPadding;
    switch (screenSize) {
      case 'xs':
        containerPadding = 24; // p-3 = 12px * 2
        break;
      case 'sm':
        containerPadding = 32; // p-4 = 16px * 2
        break;
      default:
        containerPadding = 48; // p-6 = 24px * 2
    }
    
    const availableWidth = containerWidth - containerPadding;
    
    // Calculate optimal gap size with smaller gaps for small screens
    let gap;
    switch (screenSize) {
      case 'xs':
        gap = Math.max(1, Math.min(2, Math.floor(availableWidth / (config.cols * 25))));
        break;
      case 'sm':
        gap = Math.max(1, Math.min(3, Math.floor(availableWidth / (config.cols * 20))));
        break;
      case 'md':
        gap = Math.max(2, Math.min(4, Math.floor(availableWidth / (config.cols * 18))));
        break;
      default:
        gap = Math.max(2, Math.min(6, Math.floor(availableWidth / (config.cols * 15))));
    }
    
    const gapTotal = gap * (config.cols - 1);
    
    // Calculate cell size to fill the available width
    const cellWidth = Math.floor((availableWidth - gapTotal) / config.cols);
    
    // Enhanced minimum cell size based on screen size and grid complexity
    let minCellSize;
    let maxCellSize;
    
    switch (screenSize) {
      case 'xs':
        // Very small screens - prioritize fitting the grid
        minCellSize = Math.max(16, Math.min(24, 320 / Math.max(config.cols, config.rows)));
        maxCellSize = 28;
        break;
      case 'sm':
        // Small screens - balance between size and fit
        minCellSize = Math.max(20, Math.min(28, 400 / Math.max(config.cols, config.rows)));
        maxCellSize = 32;
        break;
      case 'md':
        // Medium screens
        minCellSize = Math.max(24, Math.min(32, 500 / Math.max(config.cols, config.rows)));
        maxCellSize = 40;
        break;
      default:
        // Large screens - original logic
        minCellSize = 30;
        maxCellSize = 60;
    }
    
    const size = Math.max(minCellSize, Math.min(maxCellSize, cellWidth));
    
    // Responsive font size calculation
    let fontMultiplier;
    switch (screenSize) {
      case 'xs':
        fontMultiplier = 0.35;
        break;
      case 'sm':
        fontMultiplier = 0.37;
        break;
      default:
        fontMultiplier = 0.4;
    }
    
    const font = Math.max(8, Math.min(18, size * fontMultiplier));

    return {
      cellSize: size,
      fontSize: font,
      gapSize: gap,
      gridStyle: {
        display: 'grid',
        gridTemplateColumns: `repeat(${config.cols}, ${size}px)`,
        gap: `${gap}px`,
        width: '100%',
        justifyContent: 'center',
      }
    };
  }, [config.cols, config.rows, isMounted, getScreenBreakpoint]);

  // Enhanced responsive grid container classes
  const gridContainerClasses = useMemo(() => {
    const screenSize = getScreenBreakpoint();
    
    // Base classes with responsive padding
    let paddingClasses;
    switch (screenSize) {
      case 'xs':
        paddingClasses = 'p-3';
        break;
      case 'sm':
        paddingClasses = 'p-4';
        break;
      default:
        paddingClasses = 'p-6';
    }
    
    let classes = `w-full backdrop-blur-2xl bg-gradient-to-br from-white/30 via-white/20 to-white/35 dark:from-black/30 dark:via-black/20 dark:to-black/35 ${paddingClasses} rounded-3xl shadow-2xl border border-white/40 dark:border-white/15 transition-all duration-700 transform-gpu overflow-hidden`;

    // Responsive border radius and shadows for small screens
    if (screenSize === 'xs' || screenSize === 'sm') {
      classes = classes.replace('rounded-3xl', 'rounded-2xl');
      classes = classes.replace('shadow-2xl', 'shadow-xl');
    }

    if (animations.shakeGrid) {
      classes += ' animate-pulse scale-95 shadow-red-500/40 border-red-400/60';
    } else if (animations.celebrateGrid) {
      classes += ' animate-bounce scale-105 shadow-purple-500/50 shadow-2xl border-purple-400/60';
    } else {
      // Reduce hover effects on small screens to avoid performance issues
      if (screenSize !== 'xs') {
        classes += ' hover:scale-[1.01] hover:shadow-3xl';
      }
    }

    return classes;
  }, [animations.shakeGrid, animations.celebrateGrid, getScreenBreakpoint]);

  // Create optimized cell handlers
  const handleFocusCell = useCallback((row: number, col: number) => {
    onFocusCell(row, col);
  }, [onFocusCell]);

  return (
    <div className="w-full">
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