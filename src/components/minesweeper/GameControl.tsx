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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusEmoji = () => {
    switch (gameState) {
      case 'won': return '🎉';
      case 'lost': return '💥';
      default: return '🎮';
    }
  };

  const getStatusText = () => {
    switch (gameState) {
      case 'won': return 'Victory!';
      case 'lost': return 'Game Over';
      default: return 'Playing';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with status and reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">{getStatusEmoji()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Minesweeper
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <button
          onClick={onResetGame}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95"
          aria-label="Start new game"
        >
          <span className="flex items-center">
            New Game
          </span>
        </button>
      </div>
      
      {/* Difficulty Selection */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></span>
          Difficulty Level
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'easy' as Difficulty, label: 'Easy', size: '9×9', gradient: 'from-emerald-500 to-green-600', mines: '10 mines' },
            { key: 'medium' as Difficulty, label: 'Medium', size: '16×16', gradient: 'from-amber-500 to-orange-600', mines: '40 mines' },
            { key: 'hard' as Difficulty, label: 'Hard (Use Computer)', size: '16×30', gradient: 'from-rose-500 to-red-600', mines: '99 mines' }
          ].map(({ key, label, size, gradient, mines }) => (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`p-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                difficulty === key 
                  ? `bg-gradient-to-br ${gradient} text-white shadow-lg hover:shadow-xl ring-2 ring-white/50 dark:ring-white/30` 
                  : 'bg-white/20 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50 border border-white/30 dark:border-gray-600/30'
              }`}
              aria-pressed={difficulty === key}
            >
              <div className="text-base font-bold">{label}</div>
              <div className="text-xs opacity-90 mt-1">{size}</div>
              <div className="text-xs opacity-80 mt-0.5">{mines}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 backdrop-blur-sm rounded-2xl p-5 border border-red-200/30 dark:border-red-700/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">💣</span>
            </div>
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Mines Left</span>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent" aria-label={`${remainingMines} mines remaining`}>
            {remainingMines}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/30 dark:border-cyan-700/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm">⏱️</span>
            </div>
            <span className="text-sm font-semibold text-blue-700 dark:text-cyan-300">Time</span>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent" aria-label={`${timer} seconds elapsed`}>
            {formatTime(timer)}
          </div>
        </div>
      </div>
    </div>
  );
};