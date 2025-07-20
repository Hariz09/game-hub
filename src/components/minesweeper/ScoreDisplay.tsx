import React from 'react';

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
  userBestScore: any;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  currentProgress,
  gameState,
  timer,
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
    const timeBonus = gameState === 'won' ? Math.max(0, 1000 - (timer * 2)) : 0;
    
    return progressScore + timeBonus;
  };

  const estimatedScore = calculateEstimatedScore();

  const formatTime = (seconds: number) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyGradient = (diff: string) => {
    switch (diff) {
      case 'easy': return 'from-emerald-500 to-green-600';
      case 'medium': return 'from-amber-500 to-orange-600';
      case 'hard': return 'from-rose-500 to-red-600';
      default: return 'from-purple-500 to-cyan-500';
    }
  };

  // Safe values for display
  const safeProgressPercentage = Math.max(0, currentProgress.progressPercentage);
  const safeMoves = Math.max(0, currentProgress.moves);
  const safeRevealedCells = Math.max(0, currentProgress.revealedCells);
  const safeFlaggedCells = Math.max(0, currentProgress.flaggedCells);
  const safeTimer = Math.max(0, timer);

  const getScoreStatusColor = () => {
    if (gameState === 'won') return 'from-green-500 to-emerald-600';
    if (gameState === 'lost') return 'from-red-500 to-rose-600';
    return 'from-purple-500 to-cyan-600';
  };

  return (
    <div className="space-y-3 max-w-sm mx-auto">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-200/30 dark:border-cyan-700/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm">📊</span>
          </div>
          <div>
            <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Game Stats
            </h3>
          </div>
        </div>
        <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium bg-gradient-to-r ${getDifficultyGradient(difficulty)} text-white shadow-sm`}>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
      </div>
      
      {/* Current Score - Prominent Display */}
      <div className={`bg-gradient-to-br ${
        gameState === 'won' ? 'from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20' :
        gameState === 'lost' ? 'from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20' :
        'from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20'
      } backdrop-blur-sm rounded-xl p-4 border ${
        gameState === 'won' ? 'border-green-200/30 dark:border-emerald-700/30' :
        gameState === 'lost' ? 'border-red-200/30 dark:border-rose-700/30' :
        'border-indigo-200/30 dark:border-violet-700/30'
      } shadow-lg text-center`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-6 h-6 bg-gradient-to-r ${getScoreStatusColor()} rounded-lg flex items-center justify-center`}>
            <span className="text-white text-xs">
              {gameState === 'won' ? '🏆' : gameState === 'lost' ? '💀' : '⭐'}
            </span>
          </div>
          <span className={`text-sm font-semibold ${
            gameState === 'won' ? 'text-green-700 dark:text-emerald-300' :
            gameState === 'lost' ? 'text-red-700 dark:text-rose-300' :
            'text-indigo-700 dark:text-violet-300'
          }`}>
            {gameState === 'won' ? 'Final Score' : gameState === 'lost' ? 'Game Over' : 'Current Score'}
          </span>
        </div>
        <div className={`text-4xl font-bold bg-gradient-to-r ${getScoreStatusColor()} ${
          gameState === 'won' ? 'dark:from-green-400 dark:to-emerald-400' :
          gameState === 'lost' ? 'dark:from-red-400 dark:to-rose-400' :
          'dark:from-indigo-400 dark:to-violet-400'
        } bg-clip-text text-transparent`}>
          {Math.max(0, estimatedScore).toLocaleString()}
        </div>
      </div>

      {/* Compact Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-2">
        {/* Progress */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-200/30 dark:border-cyan-700/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎯</span>
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-cyan-300">Progress</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            {Math.round(safeProgressPercentage)}%
          </div>
          <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${safeProgressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm rounded-xl p-3 border border-amber-200/30 dark:border-orange-700/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">⏱️</span>
            </div>
            <span className="text-xs font-semibold text-amber-700 dark:text-orange-300">Time</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            {formatTime(safeTimer)}
          </div>
          <div className="text-xs text-amber-600 dark:text-orange-400 opacity-75">
            {safeTimer}s elapsed
          </div>
        </div>

        {/* Moves */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🎮</span>
            </div>
            <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Moves</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {safeMoves}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 opacity-75">
            {safeRevealedCells} cells
          </div>
        </div>

        {/* Flags */}
        <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-rose-200/30 dark:border-red-700/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-gradient-to-r from-rose-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">🚩</span>
            </div>
            <span className="text-xs font-semibold text-rose-700 dark:text-red-300">Flags</span>
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent">
            {safeFlaggedCells}
          </div>
          <div className="text-xs text-rose-600 dark:text-red-400 opacity-75">
            flagged
          </div>
        </div>
      </div>

      {/* Personal Best - Compact */}
      {isAuthenticated && userBestScore && (
        <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20 backdrop-blur-sm rounded-xl p-4 border border-violet-200/30 dark:border-purple-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">👑</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-violet-700 dark:text-purple-300">Personal Best</h4>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                {Math.max(0, userBestScore.score || 0).toLocaleString()}
              </div>
            </div>
          </div>
          
          {gameState === 'won' && estimatedScore > (userBestScore.score || 0) && (
            <div className="mt-3 p-3 bg-gradient-to-r from-yellow-100/80 to-amber-100/80 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-300/50 dark:border-amber-700/50 rounded-lg backdrop-blur-sm text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg animate-bounce">🎉</span>
                <div>
                  <div className="text-sm font-bold text-yellow-800 dark:text-yellow-300">New Record!</div>
                </div>
                <span className="text-lg animate-bounce">🏆</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Authentication Prompt - Compact */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-br from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-slate-700/30 text-center">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-slate-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">🔐</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Save Your Progress
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
            Sign in to track scores and compete globally!
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Tracking
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Leaderboard
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              Achievements
            </div>
          </div>
        </div>
      )}
    </div>
  );
}