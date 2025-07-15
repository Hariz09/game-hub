'use client'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, RotateCcw, Gamepad2 } from 'lucide-react'

interface GameActionsProps {
  onEndGame: () => void
  onReset: () => void
  isGameActive: boolean
  isAuthenticated: boolean
  className?: string
}

function GameActionsCard({ 
  onEndGame, 
  onReset, 
  isGameActive,
  isAuthenticated,
  className = ""
}: GameActionsProps) {
  return (
    <Card className={`p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-slate-200/60 dark:border-slate-700/60 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:border-purple-500/40 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-purple-500/20 rounded-xl backdrop-blur-sm">
          <Gamepad2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Game Actions</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">Control your game</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button
          onClick={onEndGame}
          disabled={!isGameActive}
          className={`w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
            !isGameActive ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <Save className="w-5 h-5 mr-2" />
          End Game & Save
        </Button>
        
        <Button
          onClick={onReset}
          disabled={!isGameActive}
          variant="outline"
          className={`w-full h-12 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white disabled:border-slate-200 dark:disabled:border-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
            !isGameActive ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset Game
        </Button>
        
        {!isAuthenticated && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <p className="text-sm text-center text-amber-700 dark:text-amber-300">
              🔐 Sign in to save your game progress
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default GameActionsCard