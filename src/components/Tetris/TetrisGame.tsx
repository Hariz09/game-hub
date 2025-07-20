'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Trophy, User } from 'lucide-react'
import { GameBoard } from './GameBoard'
import { NextPiece } from './NextPiece'
import { useGameLogic } from '@/hooks/useTetrisLogic'
import { GameScoreService, LeaderboardEntry, UserBestScore, UserProfile } from '@/hooks/useGameScore'

// Import the new game card components
import GameActionsCard from '@/components/GameCards/ActionsCard'
import LeaderboardCard from '@/components/GameCards/Leaderboard'
import UserBestScoreCard from '@/components/GameCards/UserBestScore'

interface GameStats {
  startTime: number
  moves: number
  linesCleared: number
}

export default function TetrisGame() {
  const {
    board,
    currentPiece,
    nextPiece,
    score,
    level,
    lines,
    gameOver,
    paused,
    initGame,
    movePiece,
    rotatePiece,
    dropPiece,
    togglePause,
    resetGame
  } = useGameLogic()

  // Game scoring integration
  const [gameScoreService] = useState(() => new GameScoreService())
  const [gameStats, setGameStats] = useState<GameStats>({
    startTime: Date.now(),
    moves: 0,
    linesCleared: 0
  })

  // User profile and authentication
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showUsernameDialog, setShowUsernameDialog] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Leaderboard and scores
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userBestScore, setUserBestScore] = useState<UserBestScore | null>(null)
  const [showScoreDialog, setShowScoreDialog] = useState(false)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)

  // Touch handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Constants for touch sensitivity
  const SWIPE_THRESHOLD = 50
  const TAP_MAX_DURATION = 200
  const TAP_MAX_DISTANCE = 10

  // Track game statistics
  const previousLinesRef = useRef(lines)
  const previousGameOverRef = useRef(gameOver)

  // Initialize authentication and profile
  useEffect(() => {
    const initAuth = async () => {
      const authenticated = await gameScoreService.isUserAuthenticated()
      setIsAuthenticated(authenticated)

      if (authenticated) {
        const profile = await gameScoreService.getUserProfile()
        setUserProfile(profile)

        if (!profile) {
          setShowUsernameDialog(true)
        }
      }
    }
    initAuth()
  }, [gameScoreService])

  // Load leaderboard and user best score
  useEffect(() => {
    const loadScoreData = async () => {
      const [leaderboardData, userBest] = await Promise.all([
        gameScoreService.getLeaderboard('tetris', 10),
        gameScoreService.getUserBestScore('tetris')
      ])

      setLeaderboard(leaderboardData)
      setUserBestScore(userBest)
    }

    if (isAuthenticated) {
      loadScoreData()
    }
  }, [gameScoreService, isAuthenticated, userProfile])

  // Track moves and lines cleared
  useEffect(() => {
    if (lines > previousLinesRef.current) {
      setGameStats(prev => ({
        ...prev,
        linesCleared: lines
      }))
    }
    previousLinesRef.current = lines
  }, [lines])

  // Handle game over and score submission
  useEffect(() => {
    if (gameOver && !previousGameOverRef.current && isAuthenticated && userProfile && !scoreSubmitted) {
      setShowScoreDialog(true)
    }
    previousGameOverRef.current = gameOver
  }, [gameOver, isAuthenticated, userProfile, gameStats.startTime, scoreSubmitted])

  // Reset game stats when new game starts
  useEffect(() => {
    if (!gameOver && previousGameOverRef.current) {
      setGameStats({
        startTime: Date.now(),
        moves: 0,
        linesCleared: 0
      })
      setScoreSubmitted(false)
    }
  }, [gameOver])

  const handleCreateProfile = async () => {
    if (!username.trim()) return

    setIsLoading(true)
    const result = await gameScoreService.createOrUpdateProfile(username.trim())

    if (result.success) {
      const profile = await gameScoreService.getUserProfile()
      setUserProfile(profile)
      setShowUsernameDialog(false)
      setUsername('')
    } else {
      alert(result.error || 'Failed to create profile')
    }
    setIsLoading(false)
  }

  const handleSubmitScore = async () => {
    if (!userProfile || scoreSubmitted) return

    setIsLoading(true)
    const gameEndTime = Date.now()
    const duration = Math.floor((gameEndTime - gameStats.startTime) / 1000)

    const result = await gameScoreService.saveScore(
      'tetris',
      score,
      gameStats.moves,
      'game_over',
      duration,
      {
        level,
        lines: gameStats.linesCleared,
        finalScore: score
      }
    )

    if (result.success) {
      setScoreSubmitted(true)
      setShowScoreDialog(false)

      // Refresh leaderboard and user best score
      const [leaderboardData, userBest] = await Promise.all([
        gameScoreService.getLeaderboard('tetris', 10),
        gameScoreService.getUserBestScore('tetris')
      ])

      setLeaderboard(leaderboardData)
      setUserBestScore(userBest)
    } else {
      alert(result.error || 'Failed to save score')
    }
    setIsLoading(false)
  }

  const incrementMoves = useCallback(() => {
    setGameStats(prev => ({
      ...prev,
      moves: prev.moves + 1
    }))
  }, [])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        movePiece(-1, 0)
        incrementMoves()
        break
      case 'ArrowRight':
        e.preventDefault()
        movePiece(1, 0)
        incrementMoves()
        break
      case 'ArrowDown':
        e.preventDefault()
        movePiece(0, 1)
        incrementMoves()
        break
      case 'ArrowUp':
        e.preventDefault()
        rotatePiece()
        incrementMoves()
        break
      case ' ':
        e.preventDefault()
        dropPiece()
        incrementMoves()
        break
      case 'p':
      case 'P':
        e.preventDefault()
        togglePause()
        break
    }
  }, [gameOver, movePiece, rotatePiece, dropPiece, togglePause, incrementMoves])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameOver) return

    const touch = e.touches[0]
    setTouchStartX(touch.clientX)
    setTouchStartY(touch.clientY)
    setTouchStartTime(Date.now())

    e.preventDefault()
  }, [gameOver])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (gameOver || touchStartX === null || touchStartY === null || touchStartTime === null) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY
    const duration = Date.now() - touchStartTime
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    setTouchStartX(null)
    setTouchStartY(null)
    setTouchStartTime(null)

    if (duration < TAP_MAX_DURATION && distance < TAP_MAX_DISTANCE) {
      rotatePiece()
      incrementMoves()
      return
    }

    if (distance > SWIPE_THRESHOLD) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          movePiece(1, 0)
        } else {
          movePiece(-1, 0)
        }
      } else {
        if (deltaY > 0) {
          dropPiece()
        } else {
          rotatePiece()
        }
      }
      incrementMoves()
    }

    e.preventDefault()
  }, [gameOver, touchStartX, touchStartY, touchStartTime, movePiece, rotatePiece, dropPiece, incrementMoves])

  // FIXED VERSION - Add game reset after saving
  const handleEndGame = async () => {
    if (!isAuthenticated || !userProfile || scoreSubmitted) return

    setIsLoading(true)
    const gameEndTime = Date.now()
    const duration = Math.floor((gameEndTime - gameStats.startTime) / 1000)

    const result = await gameScoreService.saveScore(
      'tetris',
      score,
      gameStats.moves,
      'game_over',
      duration,
      {
        level,
        lines: gameStats.linesCleared,
        finalScore: score
      }
    )

    if (result.success) {
      setScoreSubmitted(true)

      // Refresh leaderboard and user best score
      const [leaderboardData, userBest] = await Promise.all([
        gameScoreService.getLeaderboard('tetris', 10),
        gameScoreService.getUserBestScore('tetris')
      ])

      setLeaderboard(leaderboardData)
      setUserBestScore(userBest)

      // ADD THIS: Reset the game after saving
      resetGame() // This will trigger game over state
      setGameStats({
        startTime: Date.now(),
        moves: 0,
        linesCleared: 0
      })
    } else {
      alert(result.error || 'Failed to save score')
    }
    setIsLoading(false)
  }

  const handleNewGame = () => {
    resetGame()
    setGameStats({
      startTime: Date.now(),
      moves: 0,
      linesCleared: 0
    })
    setScoreSubmitted(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    initGame()
  }, [initGame])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            Tetris
            {isAuthenticated && userProfile && (
              <Badge variant="secondary" className="text-xs">
                {userProfile.username}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div
            ref={gameAreaRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="touch-none select-none"
          >
            <GameBoard
              board={board}
              currentPiece={currentPiece}
              gameOver={gameOver}
              paused={paused}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 min-w-[200px]">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Next Piece</CardTitle>
          </CardHeader>
          <CardContent>
            <NextPiece piece={nextPiece} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-white text-sm space-y-1">
              <div>Score: {score}</div>
              <div>Level: {level}</div>
              <div>Lines: {lines}</div>
              <div>Moves: {gameStats.moves}</div>
              <div>Time: {formatTime(Math.floor((Date.now() - gameStats.startTime) / 1000))}</div>
            </div>
          </CardContent>
        </Card>

        {/* New Game Actions Card */}
        <GameActionsCard
          onEndGame={handleEndGame}
          onReset={handleNewGame}
          isGameActive={!gameOver && !paused}
          isAuthenticated={isAuthenticated}
        />

        {/* New User Best Score Card */}
        <UserBestScoreCard
          userBestScore={userBestScore}
          isAuthenticated={isAuthenticated}
        />

        {/* New Leaderboard Card */}
        <LeaderboardCard
          leaderboard={leaderboard}
          isAuthenticated={isAuthenticated}
          maxEntries={5}
        />

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-white text-xs space-y-1">
              <div className="font-semibold">Keyboard:</div>
              <div>← → Move</div>
              <div>↓ Soft Drop</div>
              <div>↑ Rotate</div>
              <div>Space: Hard Drop</div>
              <div>P: Pause</div>
              <div className="font-semibold pt-2">Touch:</div>
              <div>Tap: Rotate</div>
              <div>Swipe ←→: Move</div>
              <div>Swipe ↓: Hard Drop</div>
              <div>Swipe ↑: Rotate</div>
            </div>
            <div className="space-y-2 pt-2">
              <Button
                onClick={togglePause}
                disabled={gameOver}
                className="w-full"
                variant="outline"
              >
                {paused ? 'Resume' : 'Pause'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile-friendly touch controls */}
        <Card className="bg-gray-800 border-gray-700 block sm:hidden">
          <CardHeader>
            <CardTitle className="text-white text-sm">Touch Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onTouchStart={(e) => {
                  e.preventDefault()
                  movePiece(-1, 0)
                  incrementMoves()
                }}
                className="h-12 text-lg"
                variant="outline"
                disabled={gameOver || paused}
              >
                ←
              </Button>
              <Button
                onTouchStart={(e) => {
                  e.preventDefault()
                  rotatePiece()
                  incrementMoves()
                }}
                className="h-12 text-lg"
                variant="outline"
                disabled={gameOver || paused}
              >
                ↻
              </Button>
              <Button
                onTouchStart={(e) => {
                  e.preventDefault()
                  movePiece(1, 0)
                  incrementMoves()
                }}
                className="h-12 text-lg"
                variant="outline"
                disabled={gameOver || paused}
              >
                →
              </Button>
              <Button
                onTouchStart={(e) => {
                  e.preventDefault()
                  movePiece(0, 1)
                  incrementMoves()
                }}
                className="h-12 text-lg col-span-1"
                variant="outline"
                disabled={gameOver || paused}
              >
                ↓
              </Button>
              <Button
                onTouchStart={(e) => {
                  e.preventDefault()
                  dropPiece()
                  incrementMoves()
                }}
                className="h-12 text-sm col-span-2"
                variant="outline"
                disabled={gameOver || paused}
              >
                DROP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Username Setup Dialog */}
      <Dialog open={showUsernameDialog} onOpenChange={setShowUsernameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Set Your Username
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProfile()}
              />
            </div>
            <Button
              onClick={handleCreateProfile}
              disabled={!username.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Score Submission Dialog */}
      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Game Over!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold">Final Score: {score}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Level: {level}</div>
                <div>Lines Cleared: {lines}</div>
                <div>Moves Made: {gameStats.moves}</div>
                <div>Time Played: {formatTime(Math.floor((Date.now() - gameStats.startTime) / 1000))}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitScore}
                disabled={isLoading || scoreSubmitted}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : 'Save Score'}
              </Button>
              <Button
                onClick={() => setShowScoreDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Skip
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}