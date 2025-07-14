'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GameBoard } from './GameBoard'
import { NextPiece } from './NextPiece'
import { useGameLogic } from '@/hooks/useTetrisLogic'

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

  // Touch handling state
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Constants for touch sensitivity
  const SWIPE_THRESHOLD = 50
  const TAP_MAX_DURATION = 200
  const TAP_MAX_DISTANCE = 10

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        movePiece(-1, 0)
        break
      case 'ArrowRight':
        e.preventDefault()
        movePiece(1, 0)
        break
      case 'ArrowDown':
        e.preventDefault()
        movePiece(0, 1)
        break
      case 'ArrowUp':
        e.preventDefault()
        rotatePiece()
        break
      case ' ':
        e.preventDefault()
        dropPiece()
        break
      case 'p':
      case 'P':
        e.preventDefault()
        togglePause()
        break
    }
  }, [gameOver, movePiece, rotatePiece, dropPiece, togglePause])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (gameOver) return

    const touch = e.touches[0]
    setTouchStartX(touch.clientX)
    setTouchStartY(touch.clientY)
    setTouchStartTime(Date.now())
    
    // Prevent default to avoid scrolling
    e.preventDefault()
  }, [gameOver])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Prevent scrolling while touching the game area
    e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (gameOver || touchStartX === null || touchStartY === null || touchStartTime === null) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartX
    const deltaY = touch.clientY - touchStartY
    const duration = Date.now() - touchStartTime
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Reset touch state
    setTouchStartX(null)
    setTouchStartY(null)
    setTouchStartTime(null)

    // Handle tap (short touch with minimal movement)
    if (duration < TAP_MAX_DURATION && distance < TAP_MAX_DISTANCE) {
      rotatePiece()
      return
    }

    // Handle swipes
    if (distance > SWIPE_THRESHOLD) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          movePiece(1, 0) // Right
        } else {
          movePiece(-1, 0) // Left
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          dropPiece() // Down - hard drop
        } else {
          rotatePiece() // Up - rotate
        }
      }
    }

    e.preventDefault()
  }, [gameOver, touchStartX, touchStartY, touchStartTime, movePiece, rotatePiece, dropPiece])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    initGame()
  }, [initGame])

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-center">Tetris</CardTitle>
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
            <div className="text-white text-sm">
              <div>Score: {score}</div>
              <div>Level: {level}</div>
              <div>Lines: {lines}</div>
            </div>
          </CardContent>
        </Card>

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
              <Button
                onClick={resetGame}
                className="w-full"
                variant="destructive"
              >
                New Game
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
    </div>
  )
}