'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Board, Piece } from '@/types/tetris'
import { INITIAL_FALL_SPEED } from '@/lib/constants/tetris'
import { createEmptyBoard, getRandomPiece, isValidMove, placePiece, clearLines } from '@/utils/tetris'

export function useGameLogic() {
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null)
  const [nextPiece, setNextPiece] = useState<Piece | null>(null)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [fallSpeed, setFallSpeed] = useState(INITIAL_FALL_SPEED)
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  const initGame = useCallback(() => {
    const newBoard = createEmptyBoard()
    const firstPiece = getRandomPiece()
    const nextPiece = getRandomPiece()
    
    setBoard(newBoard)
    setCurrentPiece(firstPiece)
    setNextPiece(nextPiece)
    setScore(0)
    setLevel(1)
    setLines(0)
    setGameOver(false)
    setPaused(false)
    setFallSpeed(INITIAL_FALL_SPEED)
  }, [])

  const spawnNewPiece = useCallback(() => {
    if (!nextPiece) return

    const newPiece = { ...nextPiece, position: { x: 3, y: 0 } }
    
    if (!isValidMove(board, newPiece, newPiece.position)) {
      setGameOver(true)
      return
    }

    setCurrentPiece(newPiece)
    setNextPiece(getRandomPiece())
  }, [board, nextPiece])

  const movePiece = useCallback((dx: number, dy: number) => {
    if (!currentPiece || gameOver || paused) return

    const newPosition = {
      x: currentPiece.position.x + dx,
      y: currentPiece.position.y + dy
    }

    if (isValidMove(board, currentPiece, newPosition)) {
      setCurrentPiece(prev => prev ? { ...prev, position: newPosition } : null)
      return true
    }
    return false
  }, [board, currentPiece, gameOver, paused])

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return

    const rotatedShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    )

    const rotatedPiece = { ...currentPiece, shape: rotatedShape }

    if (isValidMove(board, rotatedPiece, currentPiece.position)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [board, currentPiece, gameOver, paused])

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || paused) return

    let newY = currentPiece.position.y
    while (isValidMove(board, currentPiece, { x: currentPiece.position.x, y: newY + 1 })) {
      newY++
    }

    setCurrentPiece(prev => prev ? { ...prev, position: { ...prev.position, y: newY } } : null)
  }, [board, currentPiece, gameOver, paused])

  const lockPiece = useCallback(() => {
    if (!currentPiece) return

    const newBoard = placePiece(board, currentPiece)
    const { clearedBoard, linesCleared } = clearLines(newBoard)
    
    setBoard(clearedBoard)
    setLines(prev => prev + linesCleared)
    setScore(prev => prev + (linesCleared * 100 * level))
    
    const newLevel = Math.floor(lines / 10) + 1
    if (newLevel > level) {
      setLevel(newLevel)
      setFallSpeed(prev => Math.max(50, prev - 50))
    }

    spawnNewPiece()
  }, [board, currentPiece, level, lines, spawnNewPiece])

  const gameLoop = useCallback(() => {
    if (gameOver || paused) return

    const moved = movePiece(0, 1)
    if (!moved) {
      lockPiece()
    }
  }, [gameOver, paused, movePiece, lockPiece])

  const togglePause = useCallback(() => {
    setPaused(prev => !prev)
  }, [])

  const resetGame = useCallback(() => {
    initGame()
  }, [initGame])

  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current)
    }

    if (!gameOver && !paused) {
      gameLoopRef.current = setInterval(gameLoop, fallSpeed)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameLoop, fallSpeed, gameOver, paused])

  return {
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
  }
}
