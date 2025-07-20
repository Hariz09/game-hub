import { useEffect } from 'react';
import { MinesweeperState, MinesweeperAction, DIFFICULTIES } from '@/types/minesweeper';
import { createEmptyGrid } from '@/utils/minesweeper';

export const useGameTimer = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>
) => {
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isTimerRunning) {
      interval = setInterval(() => {
        dispatch({ type: 'INCREMENT_TIMER' });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isTimerRunning, dispatch]);
};

export const useGridInitialization = (
  state: MinesweeperState,
  dispatch: React.Dispatch<MinesweeperAction>,
  focusedCell: { row: number; col: number } | null,
  setFocusedCell: (cell: { row: number; col: number } | null) => void
) => {
  const config = DIFFICULTIES[state.difficulty];

  useEffect(() => {
    const newGrid = createEmptyGrid(config.rows, config.cols);
    dispatch({ type: 'INITIALIZE_GRID', payload: newGrid });
  }, [state.difficulty, config.rows, config.cols, dispatch]);

  useEffect(() => {
    if (state.grid.length > 0 && !focusedCell) {
      setFocusedCell({ row: 0, col: 0 });
    }
  }, [state.grid.length, focusedCell, setFocusedCell]);
};