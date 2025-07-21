import React from 'react';
import { Icon } from '@iconify/react';
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

  const getStatusIcon = () => {
    switch (gameState) {
      case 'won': return 'mdi:trophy';
      case 'lost': return 'mdi:bomb';
      default: return 'mdi:gamepad-variant';
    }
  };

  const getStatusText = () => {
    switch (gameState) {
      case 'won': return 'Victory!';
      case 'lost': return 'Game Over';
      default: return 'Playing';
    }
  };

  const getStatusColor = () => {
    switch (gameState) {
      case 'won': return 'from-emerald-500 to-green-500';
      case 'lost': return 'from-red-500 to-rose-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-5">
      {/* Status and Reset Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor()} rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20`}>
            <Icon icon={getStatusIcon()} className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>

        <button
          onClick={onResetGame}
          className="px-5 py-2.5 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 hover:from-blue-600/90 hover:to-cyan-600/90 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
          aria-label="Start new game"
        >
          <span className="flex items-center gap-2">
            <Icon icon="mdi:refresh" className="w-4 h-4" />
            New Game
          </span>
        </button>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gradient-to-br from-red-500/10 via-red-500/5 to-rose-500/10 dark:from-red-500/15 dark:via-red-500/10 dark:to-rose-500/15 backdrop-blur-sm rounded-xl p-4 border border-red-200/20 dark:border-red-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 bg-gradient-to-r from-red-500/80 to-rose-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Icon icon="mdi:bomb" className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Mines</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent" aria-label={`${remainingMines} mines remaining`}>
            {remainingMines}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-cyan-500/10 dark:from-blue-500/15 dark:via-blue-500/10 dark:to-cyan-500/15 backdrop-blur-sm rounded-xl p-4 border border-blue-200/20 dark:border-cyan-500/20 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Icon icon="mdi:timer" className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-blue-700 dark:text-cyan-300">Time</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent" aria-label={`${timer} seconds elapsed`}>
            {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm"></div>
          Difficulty
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              key: 'easy' as Difficulty,
              label: 'Easy',
              size: '9×9',
              gradient: 'from-emerald-500/80 to-green-500/80',
              hoverGradient: 'hover:from-emerald-600/90 hover:to-green-600/90',
              mines: '10 mines',
              icon: 'mdi:leaf'
            },
            {
              key: 'medium' as Difficulty,
              label: 'Medium',
              size: '16×16',
              gradient: 'from-amber-500/80 to-orange-500/80',
              hoverGradient: 'hover:from-amber-600/90 hover:to-orange-600/90',
              mines: '40 mines',
              icon: 'mdi:fire'
            }
          ].map(({ key, label, size, gradient, hoverGradient, mines, icon }) => (
            <button
              key={key}
              onClick={() => onDifficultyChange(key)}
              className={`p-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-sm border ${difficulty === key
                  ? `bg-gradient-to-br ${gradient} ${hoverGradient} text-white shadow-lg hover:shadow-xl ring-1 ring-white/30 border-white/30`
                  : 'bg-white/10 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-white/10 border-white/20 dark:border-white/10 hover:border-white/30 dark:hover:border-white/20'
                }`}
              aria-pressed={difficulty === key}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Icon icon={icon} className="w-4 h-4" />
                <div className="text-sm font-bold">{label}</div>
              </div>
              <div className="text-xs opacity-90">{size}</div>
              <div className="text-xs opacity-75 mt-0.5">{mines}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};