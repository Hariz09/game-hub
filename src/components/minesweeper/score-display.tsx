import React from 'react';
import { Icon } from '@iconify/react';
import { UserBestScore } from '@/hooks/games/use-game-score';

interface ScoreDisplayProps {
  currentProgress: {
    revealedCells: number;
    flaggedCells: number;
    progressPercentage: number;
    moves: number;
  };
  gameState: 'playing' | 'won' | 'lost';
  timer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isAuthenticated: boolean;
  userBestScore?: UserBestScore;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  currentProgress,
  gameState,
  difficulty,
  isAuthenticated,
  userBestScore
}) => {
  // Calculate estimated current score
  const calculateEstimatedScore = () => {
    if (gameState === 'lost') return 0;
    
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
    const safeProgressPercentage = Math.max(0, currentProgress.progressPercentage);
    const progressScore = Math.floor((safeProgressPercentage / 100) * 500 * difficultyMultiplier);
    const timeBonus = gameState === 'won' ? 500 : 0; // Simplified time bonus
    
    return progressScore + timeBonus;
  };

  const estimatedScore = calculateEstimatedScore();

  const getDifficultyConfig = (diff: string) => {
    switch (diff) {
      case 'easy': 
        return {
          gradient: 'from-emerald-500 to-green-600',
          icon: 'tabler:star',
          bgGradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
          borderColor: 'border-emerald-200/40 dark:border-green-700/40'
        };
      case 'medium': 
        return {
          gradient: 'from-amber-500 to-orange-600',
          icon: 'tabler:flame',
          bgGradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
          borderColor: 'border-amber-200/40 dark:border-orange-700/40'
        };
      case 'hard': 
        return {
          gradient: 'from-rose-500 to-red-600',
          icon: 'tabler:skull',
          bgGradient: 'from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20',
          borderColor: 'border-rose-200/40 dark:border-red-700/40'
        };
      default: 
        return {
          gradient: 'from-purple-500 to-cyan-500',
          icon: 'tabler:diamond',
          bgGradient: 'from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20',
          borderColor: 'border-purple-200/40 dark:border-cyan-700/40'
        };
    }
  };

  // Safe values for display
  const safeProgressPercentage = Math.max(0, currentProgress.progressPercentage);
  const safeMoves = Math.max(0, currentProgress.moves);
  const safeRevealedCells = Math.max(0, currentProgress.revealedCells);
  const safeFlaggedCells = Math.max(0, currentProgress.flaggedCells);

  const getScoreStatusConfig = () => {
    if (gameState === 'won') return {
      gradient: 'from-green-500 to-emerald-600',
      icon: 'tabler:trophy',
      bgGradient: 'from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20',
      borderColor: 'border-green-200/40 dark:border-emerald-700/40',
      textColor: 'text-green-700 dark:text-emerald-300'
    };
    if (gameState === 'lost') return {
      gradient: 'from-red-500 to-rose-600',
      icon: 'tabler:x',
      bgGradient: 'from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20',
      borderColor: 'border-red-200/40 dark:border-rose-700/40',
      textColor: 'text-red-700 dark:text-rose-300'
    };
    return {
      gradient: 'from-indigo-500 to-violet-600',
      icon: 'tabler:target',
      bgGradient: 'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20',
      borderColor: 'border-indigo-200/40 dark:border-violet-700/40',
      textColor: 'text-indigo-700 dark:text-violet-300'
    };
  };

  const difficultyConfig = getDifficultyConfig(difficulty);
  const scoreConfig = getScoreStatusConfig();

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      
      {/* Current Score - Hero Display */}
      <div className={`backdrop-blur-xl bg-gradient-to-br ${scoreConfig.bgGradient} rounded-2xl p-6 border ${scoreConfig.borderColor} shadow-xl shadow-purple-500/10 text-center`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${scoreConfig.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Icon icon={scoreConfig.icon} className="w-6 h-6 text-white" />
          </div>
          <span className={`text-lg font-bold ${scoreConfig.textColor}`}>
            {gameState === 'won' ? 'Victory!' : gameState === 'lost' ? 'Game Over' : 'Current Score'}
          </span>
        </div>
        <div className={`text-5xl font-black bg-gradient-to-r ${scoreConfig.gradient} bg-clip-text text-transparent mb-2`}>
          {Math.max(0, estimatedScore).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {gameState === 'won' ? 'Final Score' : 'Points Earned'}
        </div>
      </div>

      {/* Stats Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-3">
        {/* Progress */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-2xl p-4 border border-blue-200/40 dark:border-cyan-700/40 shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="tabler:progress" className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-blue-700 dark:text-cyan-300">Progress</span>
          </div>
          <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-3">
            {Math.round(safeProgressPercentage)}%
          </div>
          <div className="relative w-full bg-blue-100/60 dark:bg-blue-900/30 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700 ease-out rounded-full shadow-sm"
              style={{ width: `${safeProgressPercentage}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Moves */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-2xl p-4 border border-purple-200/40 dark:border-pink-700/40 shadow-lg shadow-purple-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="tabler:click" className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-purple-700 dark:text-pink-300">Moves</span>
          </div>
          <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
            {safeMoves}
          </div>
          <div className="text-xs text-purple-600 dark:text-pink-400 font-medium">
            {safeRevealedCells} cells revealed
          </div>
        </div>

        {/* Flags */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20 rounded-2xl p-4 border border-rose-200/40 dark:border-red-700/40 shadow-lg shadow-rose-500/5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-red-500 rounded-xl flex items-center justify-center shadow-md">
              <Icon icon="tabler:flag" className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-rose-700 dark:text-red-300">Flags</span>
          </div>
          <div className="text-2xl font-black bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent mb-1">
            {safeFlaggedCells}
          </div>
          <div className="text-xs text-rose-600 dark:text-red-400 font-medium">
            mines marked
          </div>
        </div>

        {/* Difficulty */}
        <div className={`backdrop-blur-xl bg-gradient-to-br ${difficultyConfig.bgGradient} rounded-2xl p-4 border ${difficultyConfig.borderColor} shadow-lg shadow-purple-500/5`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 bg-gradient-to-br ${difficultyConfig.gradient} rounded-xl flex items-center justify-center shadow-md`}>
              <Icon icon={difficultyConfig.icon} className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-bold ${
              difficulty === 'easy' ? 'text-emerald-700 dark:text-green-300' :
              difficulty === 'medium' ? 'text-amber-700 dark:text-orange-300' :
              'text-rose-700 dark:text-red-300'
            }`}>Difficulty</span>
          </div>
          <div className={`text-2xl font-black bg-gradient-to-r ${difficultyConfig.gradient} bg-clip-text text-transparent mb-1`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
          <div className={`text-xs font-medium ${
            difficulty === 'easy' ? 'text-emerald-600 dark:text-green-400' :
            difficulty === 'medium' ? 'text-amber-600 dark:text-orange-400' :
            'text-rose-600 dark:text-red-400'
          }`}>
            mode active
          </div>
        </div>
      </div>

      {/* Personal Best */}
      {isAuthenticated && userBestScore && (
        <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 rounded-2xl p-4 border border-violet-200/40 dark:border-purple-700/40 shadow-lg shadow-violet-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Icon icon="tabler:crown" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-violet-700 dark:text-purple-300">Personal Best</h4>
                <p className="text-xs text-violet-600 dark:text-purple-400">{difficulty} difficulty</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-black bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                {Math.max(0, userBestScore.score || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          {gameState === 'won' && estimatedScore > (userBestScore.score || 0) && (
            <div className="mt-4 p-4 backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 dark:from-yellow-500/30 dark:to-amber-500/30 border border-yellow-300/60 dark:border-amber-700/60 rounded-2xl text-center shadow-lg shadow-yellow-500/10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Icon icon="tabler:confetti" className="w-6 h-6 text-yellow-600 dark:text-yellow-400 animate-bounce" />
                <div className="text-lg font-black text-yellow-700 dark:text-yellow-300">New Record!</div>
                <Icon icon="tabler:trophy" className="w-6 h-6 text-yellow-600 dark:text-yellow-400 animate-bounce" />
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                You beat your previous best by {(estimatedScore - (userBestScore.score || 0)).toLocaleString()} points!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};