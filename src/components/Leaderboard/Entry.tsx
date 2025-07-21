import React from 'react';
import { LeaderboardEntry as LeaderboardEntryType } from '@/hooks/games/use-leaderboard';
import { Trophy, GamepadIcon, Sparkles, Target, Crown, Star } from 'lucide-react';

interface LeaderboardEntryProps {
  player: LeaderboardEntryType;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ player }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { 
          emoji: '🥇', 
          gradient: 'from-yellow-400 to-amber-500',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          icon: Crown
        };
      case 2:
        return { 
          emoji: '🥈', 
          gradient: 'from-gray-300 to-gray-400',
          textColor: 'text-gray-800 dark:text-gray-200',
          icon: Star
        };
      case 3:
        return { 
          emoji: '🥉', 
          gradient: 'from-orange-400 to-amber-500',
          textColor: 'text-orange-800 dark:text-orange-200',
          icon: Trophy
        };
      default:
        return { 
          emoji: `#${rank}`, 
          gradient: 'from-purple-400 to-cyan-400',
          textColor: 'text-purple-800 dark:text-purple-200',
          icon: GamepadIcon
        };
    }
  };

  const getCardStyles = (rank: number) => {
    const baseStyles = 'transition-all duration-300 hover:shadow-lg hover:scale-[1.01] sm:hover:scale-[1.02]';
    const shineEffect = rank <= 3 ? 'relative overflow-hidden' : '';
    
    switch (rank) {
      case 1:
        return `${baseStyles} ${shineEffect} bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 border-yellow-300 shadow-yellow-200/50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/30 dark:border-yellow-600/50 dark:shadow-yellow-500/20`;
      case 2:
        return `${baseStyles} ${shineEffect} bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 border-gray-300 shadow-gray-200/50 dark:from-gray-800/40 dark:via-slate-800/40 dark:to-gray-800/50 dark:border-gray-600/50 dark:shadow-gray-400/20`;
      case 3:
        return `${baseStyles} ${shineEffect} bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border-orange-300 shadow-orange-200/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/30 dark:border-orange-600/50 dark:shadow-orange-500/20`;
      default:
        return `${baseStyles} bg-gradient-to-br from-purple-50 via-cyan-50 to-purple-100 border-purple-200 shadow-purple-200/30 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-purple-900/30 dark:border-purple-600/50 dark:shadow-purple-500/20`;
    }
  };

  const getShineEffect = (rank: number) => {
    if (rank > 3) return null;
    
    const shineColors = {
      1: 'from-transparent via-yellow-200/60 to-transparent dark:via-yellow-400/30',
      2: 'from-transparent via-gray-200/60 to-transparent dark:via-gray-300/30',
      3: 'from-transparent via-orange-200/60 to-transparent dark:via-orange-400/30'
    };

    return (
      <div className="absolute inset-0 -top-2 -bottom-2 pointer-events-none">
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${shineColors[rank as keyof typeof shineColors]} transform -skew-x-12 animate-pulse`}
          style={{
            animation: 'shine 3s ease-in-out infinite',
            transform: 'translateX(-100%) skewX(-12deg)'
          }}
        />
        <style jsx>{`
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-12deg); }
            100% { transform: translateX(200%) skewX(-12deg); }
          }
        `}</style>
      </div>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(1) + 'T';
    }
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const rankBadge = getRankBadge(player.rank);

  return (
    <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 ${getCardStyles(player.rank)}`}>
      {/* Shining effect for top 3 */}
      {getShineEffect(player.rank)}
      
      {/* Mobile Layout - Stacked */}
      <div className="block sm:hidden relative z-10">
        {/* Top Row: Rank + Name + Champion badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`text-lg font-bold w-8 h-8 rounded-full bg-gradient-to-r ${rankBadge.gradient} flex items-center justify-center text-white shadow-lg text-xs`}>
              {player.rank <= 3 ? rankBadge.emoji : player.rank}
            </div>
            <h3 className={`text-sm font-bold ${rankBadge.textColor} truncate`}>
              {player.username}
            </h3>
          </div>
          {player.rank === 1 && (
            <div className="flex items-center gap-1 animate-pulse shrink-0">
              <Sparkles className="h-3 w-3 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                Champion
              </span>
            </div>
          )}
        </div>
        
        {/* Stats Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex flex-col space-y-0.5">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Total Score</span>
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
              <Trophy className="h-3 w-3 text-yellow-500 shrink-0" />
              <span className="font-semibold">{formatNumber(player.total_score)}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Best Score</span>
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
              <Target className="h-3 w-3 text-green-500 shrink-0" />
              <span className="font-medium">{formatNumber(player.best_single_score)}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Games</span>
            <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-200">
              <GamepadIcon className="h-3 w-3 text-blue-500 shrink-0" />
              <span>{player.games_played}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Original Horizontal */}
      <div className="hidden sm:flex items-center justify-between relative z-10">
        {/* Player Info */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          <div className={`text-xl lg:text-2xl font-bold w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r ${rankBadge.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
            {player.rank <= 3 ? rankBadge.emoji : `#${player.rank}`}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-base lg:text-lg font-bold ${rankBadge.textColor} truncate`}>
                {player.username}
              </h3>
              {player.rank === 1 && (
                <div className="flex items-center gap-1 animate-pulse shrink-0">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Champion
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-1 shrink-0">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="font-semibold">{player.total_score.toLocaleString()}</span>
                <span className="hidden lg:inline">pts</span>
              </span>
              <span className="flex items-center space-x-1 shrink-0">
                <GamepadIcon className="h-3 w-3 text-blue-500" />
                <span>{player.games_played}</span>
                <span className="hidden lg:inline">games</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center space-x-3 lg:space-x-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400 shrink-0">
          <span className="flex items-center space-x-1">
            <Target className="h-3 w-3 text-green-500" />
            <span className="font-medium">{formatNumber(player.best_single_score)}</span>
            <span className="hidden lg:inline text-xs">best</span>
          </span>
        </div>
      </div>
    </div>
  );
};