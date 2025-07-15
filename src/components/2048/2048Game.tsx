'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RotateCcw, Trophy, Zap, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, User } from 'lucide-react'
import { initializeGame, moveTilesInDirection, getGridPositions, getValueColor, addRandomTile, canMove } from '@/utils/2048'
import { GameState } from '@/types/2048'
import { TARGET_NUMBER } from '@/lib/constants/2048'
import { GameScoreService, LeaderboardEntry, UserBestScore } from '@/hooks/useGameScore'
import UserBestScoreCard from '@/components/GameCards/UserBestScore'
import LeaderboardCard from '@/components/GameCards/Leaderboard'
import GameActionsCard from '@/components/GameCards/ActionsCard'

const GAME_NAME = '2048'

export default function SquareMergeGame() {
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    score: 0,
    gameOver: false,
    gameWon: false,
    moves: 0,
  });

  // Score service and related state
  const [gameScoreService] = useState(() => new GameScoreService())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userBestScore, setUserBestScore] = useState<UserBestScore | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now())
  const [isMounted, setIsMounted] = useState(false)
  const [isScoreSaved, setIsScoreSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user profile and scores
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      // Load user's best score
      const bestScore = await gameScoreService.getUserBestScore(GAME_NAME)
      setUserBestScore(bestScore)

      // Load leaderboard
      const leaderboardData = await gameScoreService.getLeaderboard(GAME_NAME, 10)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }, [isAuthenticated, gameScoreService])

  // Initialize game and load scores
  useEffect(() => {
    const initializeGameAndScores = async () => {
      try {
        setIsLoading(true)

        // Initialize game
        const newGameState = initializeGame()
        setGameState(newGameState)
        setGameStartTime(Date.now())
        setIsScoreSaved(false)

        // Check authentication
        const authenticated = await gameScoreService.isUserAuthenticated()
        setIsAuthenticated(authenticated)

        // Load user data if authenticated
        if (authenticated) {
          await loadUserData()
        }
      } catch (error) {
        console.error('Error initializing game:', error)
      } finally {
        setIsLoading(false)
        setIsMounted(true)
      }
    }

    initializeGameAndScores()
  }, [gameScoreService, loadUserData])

  // Save score when game ends
  const saveScoreRef = useRef(false)
  const gameSessionRef = useRef(0)

  const resetGame = useCallback(() => {
    gameSessionRef.current += 1 // Increment session ID
    setGameState(initializeGame())
    setGameStartTime(Date.now())
    setIsScoreSaved(false)
    saveScoreRef.current = false
  }, [])

  // New function to end game and save score
  const endGameAndSave = useCallback(async () => {
    if (!isAuthenticated || !isMounted) {
      // If not authenticated, just reset the game
      resetGame()
      return
    }

    // Don't save if game hasn't started (no moves)
    if (gameState.moves === 0) {
      resetGame()
      return
    }

    // Don't save if already saved
    if (saveScoreRef.current) {
      resetGame()
      return
    }

    try {
      saveScoreRef.current = true
      const durationSeconds = Math.floor((Date.now() - gameStartTime) / 1000)
      const status = gameState.gameWon ? 'won' : 'game_over'
      const highestTile = gameState.tiles.length > 0 ? Math.max(...gameState.tiles.map(t => t.value)) : 0

      const result = await gameScoreService.saveScore(
        GAME_NAME,
        gameState.score,
        gameState.moves,
        status,
        durationSeconds,
        {
          finalTiles: gameState.tiles,
          targetReached: gameState.gameWon,
          highestTile,
          endedEarly: !gameState.gameOver && !gameState.gameWon
        }
      )

      if (result.success) {
        setIsScoreSaved(true)
        await loadUserData()
        console.log('Score saved successfully')
      } else {
        console.error('Failed to save score:', result.error)
        saveScoreRef.current = false
      }
    } catch (error) {
      console.error('Error saving score:', error)
      saveScoreRef.current = false
    }

    // Reset the game after saving
    resetGame()
  }, [isAuthenticated, isMounted, gameState, gameStartTime, gameScoreService, loadUserData, resetGame])

  // Updated useEffect with session tracking
  useEffect(() => {
    const currentSession = gameSessionRef.current

    const saveGameScore = async () => {
      if (!isAuthenticated || !isMounted) return

      const isGameEnded = gameState.gameOver || gameState.gameWon
      if (!isGameEnded || gameState.moves === 0) return

      // Check if this is still the same game session
      if (currentSession !== gameSessionRef.current) return

      // Use ref to prevent duplicate saves
      if (saveScoreRef.current) return
      saveScoreRef.current = true

      try {
        const durationSeconds = Math.floor((Date.now() - gameStartTime) / 1000)
        const status = gameState.gameWon ? 'won' : 'game_over'
        const highestTile = gameState.tiles.length > 0 ? Math.max(...gameState.tiles.map(t => t.value)) : 0

        const result = await gameScoreService.saveScore(
          GAME_NAME,
          gameState.score,
          gameState.moves,
          status,
          durationSeconds,
          {
            finalTiles: gameState.tiles,
            targetReached: gameState.gameWon,
            highestTile
          }
        )

        if (result.success) {
          setIsScoreSaved(true)
          await loadUserData()
          console.log('Score saved successfully')
        } else {
          console.error('Failed to save score:', result.error)
          saveScoreRef.current = false
        }
      } catch (error) {
        console.error('Error saving score:', error)
        saveScoreRef.current = false
      }
    }

    saveGameScore()
  }, [gameState.gameOver, gameState.gameWon, isAuthenticated, isMounted, gameState.moves, gameState.score, gameState.tiles, gameStartTime, gameScoreService, loadUserData])

  // Initialize game session ref
  useEffect(() => {
    gameSessionRef.current = 0
  }, [])

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.gameOver) return

    const { newTiles, scoreIncrease, moved } = moveTilesInDirection(gameState.tiles, direction)

    if (!moved) return

    const tilesWithNew = addRandomTile(newTiles)
    const newScore = gameState.score + scoreIncrease
    const gameWon = newTiles.some(tile => tile.value >= TARGET_NUMBER)
    const gameOver = !canMove(tilesWithNew)

    setGameState(prev => ({
      tiles: tilesWithNew,
      score: newScore,
      gameOver,
      gameWon: gameWon || prev.gameWon,
      moves: prev.moves + 1
    }))
  }, [gameState.tiles, gameState.score, gameState.gameOver])

  // Touch and keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          handleMove('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          handleMove('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleMove('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          handleMove('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.gameOver, handleMove])

  // Touch gesture handling
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameState.gameOver) return
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }, [gameState.gameOver])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (gameState.gameOver) return
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }, [gameState.gameOver])

  const handleTouchEnd = useCallback(() => {
    if (gameState.gameOver || !touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const minSwipeDistance = 50

    const isLeftSwipe = deltaX > minSwipeDistance
    const isRightSwipe = deltaX < -minSwipeDistance
    const isUpSwipe = deltaY > minSwipeDistance
    const isDownSwipe = deltaY < -minSwipeDistance

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (isLeftSwipe) {
        handleMove('left')
      } else if (isRightSwipe) {
        handleMove('right')
      }
    } else {
      if (isUpSwipe) {
        handleMove('up')
      } else if (isDownSwipe) {
        handleMove('down')
      }
    }
  }, [gameState.gameOver, touchStart, touchEnd, handleMove])

  // Clear animation flags after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        tiles: prev.tiles.map(tile => ({
          ...tile,
          isNew: false,
          isMerged: false
        }))
      }))
    }, 300)

    return () => clearTimeout(timer)
  }, [gameState.tiles])

  const renderSquareTile = (row: number, col: number) => {
    const tile = gameState.tiles.find(t => t.row === row && t.col === col)

    return (
      <div
        key={`${row}-${col}`}
        className={`
          w-16 h-16 rounded-lg border-2 flex items-center justify-center
          transition-all duration-200 font-bold text-lg
          ${tile ? getValueColor(tile.value) + ' border-slate-600' : 'bg-slate-700/50 border-slate-600'}
          ${tile?.isNew ? 'animate-pulse' : ''}
          ${tile?.isMerged ? 'animate-bounce' : ''}
        `}
      >
        {tile && (
          <span className="text-sm font-bold">
            {tile.value}
          </span>
        )}
      </div>
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getCurrentGameDuration = () => {
    return Math.floor((Date.now() - gameStartTime) / 1000)
  }

  // Check if game is active (has moves and not ended)
  const isGameActive = gameState.moves > 0 && !gameState.gameOver

  if (isLoading || !isMounted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-slate-400 text-sm">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-slate-400 text-sm">Moves</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 hover:bg-slate-700"
              disabled
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
            <p className="text-slate-300 text-sm mb-2">
              Loading game...
            </p>
          </div>
          <div className="relative bg-slate-900 rounded-lg p-4 touch-none select-none">
            <div className="grid grid-cols-4 gap-2 w-fit mx-auto">
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-lg border-2 flex items-center justify-center bg-slate-700/50 border-slate-600"
                ></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Game */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-slate-800/90 backdrop-blur-sm border-slate-700">
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{gameState.score}</div>
                  <div className="text-slate-400 text-sm">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{gameState.moves}</div>
                  <div className="text-slate-400 text-sm">Moves</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatDuration(getCurrentGameDuration())}</div>
                  <div className="text-slate-400 text-sm">Time</div>
                </div>
              </div>
              <Button
                onClick={resetGame}
                variant="outline"
                size="sm"
                className="border-slate-600 hover:bg-slate-700"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Game Status */}
            {gameState.gameWon && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-green-400">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Congratulations! You reached {TARGET_NUMBER}!</span>
                </div>
                {isAuthenticated && isScoreSaved && (
                  <p className="text-green-300 text-sm mt-2">Score saved successfully!</p>
                )}
                {!isAuthenticated && (
                  <p className="text-green-300 text-sm mt-2">Sign in to save your score!</p>
                )}
              </div>
            )}

            {gameState.gameOver && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-400">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Game Over! No more moves possible.</span>
                </div>
                {isAuthenticated && isScoreSaved && (
                  <p className="text-red-300 text-sm mt-2">Score saved successfully!</p>
                )}
                {!isAuthenticated && (
                  <p className="text-red-300 text-sm mt-2">Sign in to save your score!</p>
                )}
                <Button
                  onClick={resetGame}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white"
                >
                  Start Over
                </Button>
              </div>
            )}

            {/* Square Grid */}
            <div
              className="relative bg-slate-900 rounded-lg p-4 touch-none select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="grid grid-cols-4 gap-2 w-fit mx-auto">
                {getGridPositions().map(({ row, col }) => renderSquareTile(row, col))}
              </div>
            </div>

            {/* Instructions */}
            <div className="pb-4 bg-slate-700/50 rounded-lg">
              {/* Control Buttons */}
              <div className="flex justify-center gap-2 mt-4">
                <div className="grid grid-cols-3 gap-1">
                  <div></div>
                  <Button
                    onClick={() => handleMove('up')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 touch-none"
                    disabled={gameState.gameOver}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleMove('left')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 touch-none"
                    disabled={gameState.gameOver}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleMove('right')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 touch-none"
                    disabled={gameState.gameOver}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button
                    onClick={() => handleMove('down')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 hover:bg-slate-700 touch-none"
                    disabled={gameState.gameOver}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <div></div>
                </div>
              </div>
              <p className="text-slate-300 text-sm my-2">
                Use arrow keys, swipe gestures, or buttons to move tiles. When two tiles with the same number touch, they merge! Reach {TARGET_NUMBER} to win!
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar with Stats */}
        <div className="space-y-6">
          {/* Game Actions Card */}
          <GameActionsCard
            onEndGame={endGameAndSave}
            onReset={resetGame}
            isGameActive={isGameActive}
            isAuthenticated={isAuthenticated}
          />

          {/* User Best Score Component */}
          <UserBestScoreCard
            userBestScore={userBestScore}
            isAuthenticated={isAuthenticated}
          />

          {/* Leaderboard Component */}
          <LeaderboardCard
            leaderboard={leaderboard}
            isAuthenticated={isAuthenticated}
            maxEntries={5}
          />

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <Card className="p-4 bg-slate-800/90 backdrop-blur-sm border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-white">Sign In</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Sign in to save your scores and compete on the leaderboard!
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}