import React from 'react';
import { Difficulty, GameState } from '@/types/minesweeper';

interface GameControlsProps {
  difficulty: Difficulty;
  gameState: GameState;
  remainingMines: number;
  timer: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onResetGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  gameState,
  remainingMines,
  timer,
  onDifficultyChange,
  onResetGame,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onDifficultyChange('easy')}
            className={`px-3 md:px-4 py-2 rounded text-sm md:text-base ${
              difficulty === 'easy' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={difficulty === 'easy'}
          >
            Easy (9×9)
          </button>
          <button
            onClick={() => onDifficultyChange('medium')}
            className={`px-3 md:px-4 py-2 rounded text-sm md:text-base ${
              difficulty === 'medium' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={difficulty === 'medium'}
          >
            Medium (16×16)
          </button>
          <button
            onClick={() => onDifficultyChange('hard')}
            className={`px-3 md:px-4 py-2 rounded text-sm md:text-base ${
              difficulty === 'hard' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            aria-pressed={difficulty === 'hard'}
          >
            Hard (16×30)
          </button>
        </div>
        
        <button
          onClick={onResetGame}
          className="px-4 md:px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm md:text-base"
          aria-label="Start new game"
        >
          New Game
        </button>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm md:text-lg">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Mines:</span>
          <span className="bg-red-100 px-2 md:px-3 py-1 rounded" aria-label={`${remainingMines} mines remaining`}>
            {remainingMines}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Time:</span>
          <span className="bg-blue-100 px-2 md:px-3 py-1 rounded" aria-label={`${timer} seconds elapsed`}>
            {timer}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <span className={`px-2 md:px-3 py-1 rounded font-bold ${
            gameState === 'won' 
              ? 'bg-green-100 text-green-800' 
              : gameState === 'lost'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {gameState === 'won' ? '🎉 You Won!' : 
             gameState === 'lost' ? '💥 Game Over' : 
             '🎮 Playing'}
          </span>
        </div>
      </div>
    </div>
  );
};
