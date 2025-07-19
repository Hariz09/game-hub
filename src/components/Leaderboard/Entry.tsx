import React from 'react';
import { LeaderboardEntry as LeaderboardEntryType } from '@/hooks/useLeaderboard';
import { Trophy, GamepadIcon, Sparkles, Target, Clock, Crown, Star } from 'lucide-react';

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
    const baseStyles = 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02]';
    const shineEffect = rank <= 3 ? 'relative overflow-hidden' : '';
    
    switch (rank) {
      case 1:
        return `${baseStyles} ${shineEffect} bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-100 border-yellow-300 shadow-yellow-200/50 dark:from-yellow-900/20 dark:via-amber-900/20 dark:to-yellow-900/30 dark:border-yellow-600/50 dark:shadow-yellow-500/20`;
      case 2:
        return `${baseStyles} ${shineEffect} bg-gradient-to-r from-gray-50 via-slate-50 to-gray-100 border-gray-300 shadow-gray-200/50 dark:from-gray-800/40 dark:via-slate-800/40 dark:to-gray-800/50 dark:border-gray-600/50 dark:shadow-gray-400/20`;
      case 3:
        return `${baseStyles} ${shineEffect} bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100 border-orange-300 shadow-orange-200/50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-orange-900/30 dark:border-orange-600/50 dark:shadow-orange-500/20`;
      default:
        return `${baseStyles} bg-gradient-to-r from-purple-50 via-cyan-50 to-purple-100 border-purple-200 shadow-purple-200/30 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-purple-900/30 dark:border-purple-600/50 dark:shadow-purple-500/20`;
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
      <div className="absolute inset-0 -top-2 -bottom-2">
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

  const rankBadge = getRankBadge(player.rank);

  return (
    <div className={`p-4 rounded-xl border-2 ${getCardStyles(player.rank)}`}>
      {/* Shining effect for top 3 */}
      {getShineEffect(player.rank)}
      
      <div className="flex items-center justify-between relative z-10">
        {/* Player Info */}
        <div className="flex items-center space-x-4">
          <div className={`text-2xl font-bold w-12 h-12 rounded-full bg-gradient-to-r ${rankBadge.gradient} flex items-center justify-center text-white shadow-lg`}>
            {player.rank <= 3 ? rankBadge.emoji : `#${player.rank}`}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-lg font-bold ${rankBadge.textColor}`}>
                {player.username}
              </h3>
              {player.rank === 1 && (
                <div className="flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Champion
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-1">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="font-semibold">{player.total_score.toLocaleString()}</span>
                <span>pts</span>
              </span>
              <span className="flex items-center space-x-1">
                <GamepadIcon className="h-3 w-3 text-blue-500" />
                <span>{player.games_played}</span>
                <span>games played</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Compact Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center space-x-1">
            <Target className="h-3 w-3 text-green-500" />
            <span className="font-medium">{player.best_single_score.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{player.total_moves.toLocaleString()}</span>
          </span>
        </div>
      </div>
    </div>
  );
};