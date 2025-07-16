import React from 'react'
import { Card } from '@/components/ui/card'
import { Crown, Trophy, Medal, Award } from 'lucide-react'

interface LeaderboardEntry {
  username: string
  score: number
  moves: number
  rank: number
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[]
  isAuthenticated: boolean
  className?: string
  maxEntries?: number
}

function LeaderboardCard({ 
  leaderboard, 
  isAuthenticated, 
  className = "",
  maxEntries = 5
}: LeaderboardProps) {
  if (!isAuthenticated || leaderboard.length === 0) {
    return null
  }

  const displayedEntries = leaderboard.slice(0, maxEntries)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
      case 2:
        return <Trophy className="w-5 h-5 text-slate-300 drop-shadow-lg" />
      case 3:
        return <Medal className="w-5 h-5 text-amber-500 drop-shadow-lg" />
      default:
        return <Award className="w-5 h-5 text-slate-400 drop-shadow-lg" />
    }
  }

  const getRankTextColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400'
      case 2:
        return 'text-slate-300'
      case 3:
        return 'text-amber-500'
      default:
        return 'text-slate-600 dark:text-slate-400'
    }
  }

  const getEntryBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-500/15 dark:to-yellow-400/10 border-yellow-300 dark:border-yellow-400/30 shadow-lg'
      case 2:
        return 'bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-400/15 dark:to-slate-300/10 border-slate-300 dark:border-slate-300/30 shadow-lg'
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-500/15 dark:to-amber-400/10 border-amber-300 dark:border-amber-400/30 shadow-lg'
      default:
        return 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-600/40 shadow-md'
    }
  }

  return (
    <Card className={`p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-slate-200/60 dark:border-slate-700/60 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-purple-500/40 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-xl backdrop-blur-sm">
          <Crown className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">Leaderboard</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Top {maxEntries} Scores</p>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {displayedEntries.map((entry, index) => (
          <div
            key={`${entry.username}-${entry.score}-${index}`}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${getEntryBackground(entry.rank)}`}
          >
            {/* Left side - Rank and Username */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <span className={`text-sm font-bold ${getRankTextColor(entry.rank)}`}>
                  #{entry.rank}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-slate-900 dark:text-white text-sm font-semibold truncate block">
                  {entry.username}
                </span>
              </div>
            </div>

            {/* Right side - Score and Moves */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-slate-900 dark:text-white font-bold text-lg">
                    {entry.score.toLocaleString()}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs">
                    {entry.moves} moves
                  </div>
                </div>
                {entry.rank <= 3 && (
                  <div className="w-3 h-10 rounded-full bg-gradient-to-t from-transparent to-current opacity-30" 
                       style={{ 
                         color: entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#d1d5db' : '#f59e0b' 
                       }} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {leaderboard.length > maxEntries && (
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <p className="text-slate-600 dark:text-slate-300 text-xs text-center">
            Showing top {maxEntries} of {leaderboard.length} scores
          </p>
        </div>
      )}
    </Card>
  )
}

export default LeaderboardCard