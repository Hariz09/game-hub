import React from 'react';
import { Icon } from '@iconify/react';

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

  const getRankConfig = (index: number) => {
    switch (index) {
      case 0: return { 
        bg: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        border: 'border-yellow-200/40 dark:border-amber-700/40',
        glow: 'shadow-yellow-500/20',
        textColor: 'text-white'
      };
      case 1: return { 
        bg: 'bg-gradient-to-br from-slate-400 to-slate-600',
        border: 'border-slate-200/40 dark:border-slate-700/40',
        glow: 'shadow-slate-500/20',
        textColor: 'text-white'
      };
      case 2: return { 
        bg: 'bg-gradient-to-br from-amber-600 to-orange-700',
        border: 'border-amber-200/40 dark:border-orange-700/40',
        glow: 'shadow-amber-500/20',
        textColor: 'text-white'
      };
      default: return { 
        bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        border: 'border-indigo-200/40 dark:border-purple-700/40',
        glow: 'shadow-indigo-500/15',
        textColor: 'text-white'
      };
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-6 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 backdrop-blur-xl rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 flex items-center justify-center shadow-lg shadow-indigo-500/5">
              <Icon icon="tabler:trophy" className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Leaderboard
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Top Players</p>
            </div>
          </div>
        </div>
        
        {/* Auth Required State */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 p-8 text-center shadow-xl shadow-purple-500/10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon="tabler:lock" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-indigo-700 dark:text-purple-300 mb-2">
            Join the Competition
          </h3>
          <p className="text-indigo-600 dark:text-purple-400 text-sm">
            Sign in to see global rankings and compete for the top spot
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 backdrop-blur-xl rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 flex items-center justify-center shadow-lg shadow-indigo-500/5">
            <Icon icon="tabler:trophy" className="w-6 h-6 text-indigo-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">Top Players</p>
          </div>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="group p-3 backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 hover:from-indigo-500/20 hover:to-purple-600/20 dark:hover:from-indigo-500/30 dark:hover:to-purple-600/30 border border-indigo-200/40 dark:border-purple-700/40 hover:border-indigo-300/60 dark:hover:border-purple-600/60 rounded-2xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-indigo-500/5"
          title="Refresh leaderboard"
        >
          <Icon 
            icon="tabler:refresh" 
            className={`w-4 h-4 transition-all duration-500 ${
              isLoading 
                ? 'animate-spin text-indigo-600 dark:text-purple-400' 
                : 'group-hover:rotate-180 text-indigo-700 dark:text-purple-300 group-hover:text-indigo-800 dark:group-hover:text-purple-200'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 p-12 text-center shadow-xl shadow-purple-500/10">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-indigo-600 dark:text-purple-400 text-sm font-medium">Loading rankings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 p-12 text-center shadow-xl shadow-purple-500/10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Icon icon="tabler:bolt" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-indigo-700 dark:text-purple-300 mb-2">
            No Rankings Yet
          </h3>
          <p className="text-indigo-600 dark:text-purple-400 text-sm">
            Be the first to complete a game and claim the top spot!
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <style jsx>{`
            /* Custom scrollbar */
            .scrollbar-custom::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: rgba(99, 102, 241, 0.1);
              border-radius: 10px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, rgba(99, 102, 241, 0.5), rgba(147, 51, 234, 0.5));
              border-radius: 10px;
              backdrop-filter: blur(10px);
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, rgba(99, 102, 241, 0.7), rgba(147, 51, 234, 0.7));
            }
          `}</style>
          <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-custom">
          {leaderboard.map((entry, index) => {
            const rank = getRankConfig(index);
            const isTopThree = index < 3;
            
            return (
              <div
                key={`${entry.rank}-${entry.username}-${entry.created_at}`}
                className={`group relative overflow-hidden backdrop-blur-xl rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 shadow-lg ${
                  isTopThree 
                    ? `bg-gradient-to-br from-white/15 to-white/10 dark:from-white/10 dark:to-white/5 ${rank.border} ${rank.glow}` 
                    : 'bg-gradient-to-br from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20 border-gray-200/40 dark:border-slate-700/40 hover:from-gray-500/15 hover:to-slate-500/15 dark:hover:from-gray-500/25 dark:hover:to-slate-500/25 hover:border-gray-300/60 dark:hover:border-slate-600/60'
                } shadow-purple-500/5`}
              >
                <div className="p-4">
                  {/* Top Section */}
                  <div className="flex items-center gap-3 mb-3">
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 ${rank.bg} rounded-2xl flex items-center justify-center ${rank.textColor} shadow-lg border border-white/20 flex-shrink-0`}>
                      <span className="text-lg font-black">
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate text-base">
                          {entry.username || 'Anonymous'}
                        </h3>
                        <div className="text-right">
                          <div className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            {(entry.score || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">points</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Time */}
                      <div className="flex items-center gap-1.5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-blue-200/40 dark:border-cyan-700/40 shadow-lg shadow-blue-500/5">
                        <Icon icon="tabler:clock" className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                        <span className="text-xs font-bold text-blue-700 dark:text-cyan-300">
                          {formatTime(entry.duration_seconds || 0)}
                        </span>
                      </div>
                      
                      {/* Moves */}
                      <div className="flex items-center gap-1.5 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-purple-200/40 dark:border-pink-700/40 shadow-lg shadow-purple-500/5">
                        <Icon icon="tabler:click" className="w-3 h-3 text-purple-600 dark:text-pink-400" />
                        <span className="text-xs font-bold text-purple-700 dark:text-pink-300">
                          {entry.moves || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status & Date */}
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold backdrop-blur-xl border shadow-lg ${
                        entry.status === 'won' 
                          ? 'bg-gradient-to-br from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 border-emerald-200/40 dark:border-green-700/40 text-emerald-700 dark:text-green-300 shadow-emerald-500/5' 
                          : 'bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 border-red-200/40 dark:border-rose-700/40 text-red-700 dark:text-rose-300 shadow-red-500/5'
                      }`}>
                        <span>{entry.status === 'won' ? 'Won' : 'Lost'}</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center pt-4 border-t border-gray-200/40 dark:border-gray-700/40">
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 backdrop-blur-xl rounded-2xl border border-indigo-200/40 dark:border-purple-700/40 shadow-lg shadow-indigo-500/5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
          <span className="text-xs font-bold text-indigo-700 dark:text-purple-300">
            Live • Top {Math.min(leaderboard.length, 10)}
          </span>
        </div>
      </div>
    </div>
  );
};