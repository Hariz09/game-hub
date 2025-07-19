import { MinesweeperState, MinesweeperAction } from '@/types/minesweeper';

export const initialState: MinesweeperState = {
  difficulty: 'easy',
  grid: [],
  gameState: 'playing',
  flagCount: 0,
  firstClick: true,
  timer: 0,
  isTimerRunning: false,
};

export function minesweeperReducer(state: MinesweeperState, action: MinesweeperAction): MinesweeperState {
  switch (action.type) {
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload,
      };
    
    case 'INITIALIZE_GRID':
      return {
        ...state,
        grid: action.payload,
        gameState: 'playing',
        flagCount: 0,
        firstClick: true,
        timer: 0,
        isTimerRunning: false,
      };
    
    case 'PLACE_MINES_AND_CALCULATE':
      return {
        ...state,
        grid: action.payload.grid,
        firstClick: false,
        isTimerRunning: true,
      };
    
    case 'REVEAL_CELLS':
      return {
        ...state,
        grid: action.payload.grid,
      };
    
    case 'TOGGLE_FLAG':
      const { row, col } = action.payload;
      const currentCell = state.grid[row][col];
      const newIsFlagged = !currentCell.isFlagged;
      
      return {
        ...state,
        grid: state.grid.map((gridRow, r) =>
          gridRow.map((cell, c) => {
            if (r === row && c === col) {
              return { ...cell, isFlagged: newIsFlagged };
            }
            return cell;
          })
        ),
        flagCount: newIsFlagged ? state.flagCount + 1 : state.flagCount - 1,
      };
    
    case 'GAME_WON':
      return {
        ...state,
        gameState: 'won',
        isTimerRunning: false,
      };
    
    case 'GAME_LOST':
      return {
        ...state,
        gameState: 'lost',
        isTimerRunning: false,
        grid: action.payload,
      };
    
    case 'RESET_GAME':
      return {
        ...state,
        grid: action.payload.grid,
        difficulty: action.payload.difficulty,
        gameState: 'playing',
        flagCount: 0,
        firstClick: true,
        timer: 0,
        isTimerRunning: false,
      };
    
    case 'START_TIMER':
      return {
        ...state,
        isTimerRunning: true,
      };
    
    case 'STOP_TIMER':
      return {
        ...state,
        isTimerRunning: false,
      };
    
    case 'INCREMENT_TIMER':
      return {
        ...state,
        timer: state.timer + 1,
      };
    
    default:
      return state;
  }
}