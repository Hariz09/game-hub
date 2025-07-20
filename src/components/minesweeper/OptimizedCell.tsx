// components/minesweeper/OptimizedCell.tsx
'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { Cell } from '@/types/minesweeper';
import { getCellContent, getCellClasses, getAriaLabel } from '@/utils/minesweeper';

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

export const OptimizedCell = memo<OptimizedCellProps>(({
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