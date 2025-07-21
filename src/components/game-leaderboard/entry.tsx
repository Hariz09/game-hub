import React from 'react';
import { GameLeaderboardEntry as GameLeaderboardEntryType } from '@/hooks/games/use-game-leaderboard';

interface GameLeaderboardEntryProps {
  player: GameLeaderboardEntryType;
}

export const GameLeaderboardEntry: React.FC<GameLeaderboardEntryProps> = ({ player }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { emoji: '🥇', gradient: 'from-yellow-400 to-amber-500' };
      case 2:
        return { emoji: '🥈', gradient: 'from-gray-300 to-gray-400' };
      case 3:
        return { emoji: '🥉', gradient: 'from-orange-400 to-amber-500' };
      default:
        return { emoji: `#${rank}`, gradient: 'from-purple-400 to-cyan-400' };
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600';
      case 'lost':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-600';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const rankBadge = getRankBadge(player.rank);

  return (
    <div
      className={`p-6 rounded-2xl border-2 ${getCardStyles(player.rank)}`}
    >
      {/* Shining effect for top 3 */}
      {getShineEffect(player.rank)}
      
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between space-y-4 xl:space-y-0 relative z-10">
        {/* Player Info */}
        <div className="flex items-center space-x-6">
          <div className={`text-3xl font-bold w-16 h-16 rounded-full bg-gradient-to-r ${rankBadge.gradient} flex items-center justify-center text-white shadow-lg`}>
            {player.rank <= 3 ? rankBadge.emoji : `#${player.rank}`}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {player.username}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center space-x-1">
                <span className="text-lg">🏆</span>
                <span className="font-semibold">{player.score.toLocaleString()}</span>
                <span>pts</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-lg">🎯</span>
                <span>{player.moves}</span>
                <span>moves</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-lg">⏱️</span>
                <span>{formatDuration(player.duration_seconds)}</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(player.status)}`}>
            {player.status}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(player.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
};