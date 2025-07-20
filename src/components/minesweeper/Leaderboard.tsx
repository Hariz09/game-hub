import React from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  duration_seconds: number;
  moves: number;
  status: string;
  created_at: string;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  isAuthenticated: boolean;
  onRefresh: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  isLoading,
  isAuthenticated,
  onRefresh
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return { icon: '🥇', bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600' };
      case 1: return { icon: '🥈', bg: 'bg-gradient-to-br from-gray-400 to-gray-600' };
      case 2: return { icon: '🥉', bg: 'bg-gradient-to-br from-amber-600 to-amber-800' };
      default: return { icon: index + 1, bg: 'bg-gradient-to-br from-purple-500 to-cyan-600' };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-sm mx-auto">
        {/* Compact Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🏆</span>
          </div>
          <h3 className="font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Leaderboard
          </h3>
        </div>
        
        <div className="text-center py-12 bg-white/10 dark:bg-gray-800/20 rounded-xl border border-white/20 dark:border-gray-600/20">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-cyan-200 dark:from-purple-800/30 dark:to-cyan-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Sign In Required
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
            Join to compete globally!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🏆</span>
          </div>
          <div>
            <h3 className="font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Leaderboard
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">Top Players</p>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500/20 hover:to-cyan-500/20 border border-purple-300/30 dark:border-purple-700/30 rounded-lg transition-all duration-300 disabled:opacity-50"
          title="Refresh"
        >
          <span className={`text-sm transition-transform duration-500 ${
            isLoading ? 'animate-spin' : 'hover:rotate-180'
          }`}>
            🔄
          </span>
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-12 bg-white/10 dark:bg-gray-800/20 rounded-xl border border-white/20 dark:border-gray-600/20">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-xl animate-spin">⚡</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Loading...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-white/10 dark:bg-gray-800/20 rounded-xl border border-white/20 dark:border-gray-600/20">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl">🎯</span>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Be First!
          </h4>
          <p className="text-gray-600 dark:text-gray-400 text-sm px-4">
            Start playing to claim the top spot!
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300/50 dark:scrollbar-thumb-purple-700/50 scrollbar-track-transparent">
          {leaderboard.map((entry, index) => {
            const rank = getRankIcon(index);
            const isTopThree = index < 3;
            
            return (
              <div
                key={entry.rank}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                  isTopThree 
                    ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300/50 dark:border-yellow-700/50 shadow-md shadow-yellow-500/20' 
                    : 'bg-white/20 dark:bg-gray-800/20 border-white/30 dark:border-gray-600/30 hover:bg-white/30 dark:hover:bg-gray-700/30'
                }`}
              >
                <div className="p-3">
                  {/* Top Row: Rank + Username + Score */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Compact Rank Badge */}
                      <div className={`w-7 h-7 ${rank.bg} rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}>
                        {rank.icon}
                      </div>
                      
                      {/* Username */}
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {entry.username || 'Anonymous'}
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      {(entry.score || 0).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Bottom Row: Stats + Status */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Time */}
                      <div className="flex items-center gap-1 bg-blue-100/60 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                        <span>⏱️</span>
                        <span className="font-medium">{formatTime(entry.duration_seconds || 0)}</span>
                      </div>
                      
                      {/* Moves */}
                      <div className="flex items-center gap-1 bg-purple-100/60 dark:bg-purple-900/40 px-2 py-0.5 rounded-md">
                        <span>🎯</span>
                        <span className="font-medium">{entry.moves || 0}</span>
                      </div>
                    </div>
                    
                    {/* Status + Date */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        entry.status === 'won' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {entry.status === 'won' ? '✅' : '❌'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Top 3 Shimmer Effect */}
                {isTopThree && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-pink-400/10 pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Footer */}
      <div className="pt-3 border-t border-white/20 dark:border-gray-600/30 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gradient-to-r from-purple-100/30 to-cyan-100/30 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-md px-2 py-1 border border-purple-200/30 dark:border-purple-700/30">
          🚀 Live • Top 10
        </p>
      </div>
    </div>
  );
};