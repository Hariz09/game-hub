'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { User } from 'lucide-react'

interface UserBestScoreType {
  score: number
  moves: number
  duration_seconds?: number
}

interface UserBestScoreProps {
  userBestScore: UserBestScoreType | null
  isAuthenticated: boolean
  className?: string
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function UserBestScoreCard({ 
  userBestScore, 
  isAuthenticated, 
  className = ""
}: UserBestScoreProps) {
  if (!isAuthenticated || !userBestScore) {
    return null
  }

  return (
    <Card className={`p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-slate-200/60 dark:border-slate-700/60 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-purple-500/40 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-xl backdrop-blur-sm">
          <User className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Your Best</h3>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-300 text-sm">Score:</span>
          <span className="text-slate-900 dark:text-white font-bold text-lg">{userBestScore.score.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-slate-600 dark:text-slate-300 text-sm">Moves:</span>
          <span className="text-slate-900 dark:text-white font-semibold">{userBestScore.moves}</span>
        </div>
        
        {userBestScore.duration_seconds && (
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-300 text-sm">Time:</span>
            <span className="text-slate-900 dark:text-white font-semibold font-mono">
              {formatDuration(userBestScore.duration_seconds)}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default UserBestScoreCard