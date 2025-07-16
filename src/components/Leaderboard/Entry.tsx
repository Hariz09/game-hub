import React from 'react';
import { LeaderboardEntry as LeaderboardEntryType } from '@/hooks/useLeaderboard';
import { Badge } from '@/components/ui/badge';
import { Trophy, GamepadIcon, Sparkles, Target, Clock, TrendingUp, Crown, Star } from 'lucide-react';

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

  const getWinRate = (won: number, played: number) => {
    return played > 0 ? ((won / played) * 100).toFixed(1) : '0.0';
  };

  const rankBadge = getRankBadge(player.rank);
  const winRate = parseFloat(getWinRate(player.games_won, player.games_played));

  return (
    <div className={`p-6 rounded-2xl border-2 ${getCardStyles(player.rank)}`}>
      {/* Shining effect for top 3 */}
      {getShineEffect(player.rank)}
      
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0 relative z-10">
        {/* Player Info */}
        <div className="flex items-center space-x-6">
          <div className={`text-3xl font-bold w-16 h-16 rounded-full bg-gradient-to-r ${rankBadge.gradient} flex items-center justify-center text-white shadow-lg`}>
            {player.rank <= 3 ? rankBadge.emoji : `#${player.rank}`}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-xl font-bold ${rankBadge.textColor}`}>
                {player.username}
              </h3>
              {player.rank === 1 && (
                <div className="flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 uppercase tracking-wide">
                    Champion
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{player.total_score.toLocaleString()}</span>
                <span>pts</span>
              </span>
              <span className="flex items-center space-x-1">
                <GamepadIcon className="h-4 w-4 text-blue-500" />
                <span>{player.games_played}</span>
                <span>games</span>
              </span>
              <span className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-green-500" />
                <span>{player.best_single_score.toLocaleString()}</span>
                <span>best</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {winRate}%
            </span>
            <Badge variant={winRate >= 70 ? "default" : winRate >= 50 ? "secondary" : "destructive"} className="text-xs">
              {winRate >= 70 ? "Elite" : winRate >= 50 ? "Good" : "Learning"}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{player.total_moves.toLocaleString()}</span>
              <span>moves</span>
            </span>
            <span className="flex items-center space-x-1">
              <Trophy className="h-4 w-4" />
              <span>{player.games_won}</span>
              <span>wins</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};