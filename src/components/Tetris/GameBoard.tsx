'use client'

import React from 'react'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/lib/constants/tetris'
import { Board, Piece } from '@/types/tetris'

interface GameBoardProps {
  board: Board
  currentPiece: Piece | null
  gameOver: boolean
  paused: boolean
}

export function GameBoard({ board, currentPiece, gameOver, paused }: GameBoardProps) {
  // Helper function to check if a piece can be placed at a specific position
  const canPlacePiece = (piece: Piece, testX: number, testY: number): boolean => {
    return piece.shape.every((row, y) =>
      row.every((cell, x) => {
        if (!cell) return true
        const boardX = testX + x
        const boardY = testY + y
        return (
          boardX >= 0 &&
          boardX < BOARD_WIDTH &&
          boardY < BOARD_HEIGHT &&
          (boardY < 0 || board[boardY][boardX] === 0)
        )
      })
    )
  }

  // Calculate ghost piece position (where current piece would land)
  const getGhostPiecePosition = (piece: Piece): { x: number; y: number } | null => {
    if (!piece) return null
    
    let ghostY = piece.position.y
    
    // Move the ghost piece down until it can't move anymore
    while (canPlacePiece(piece, piece.position.x, ghostY + 1)) {
      ghostY++
    }
    
    return { x: piece.position.x, y: ghostY }
  }

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])
    const ghostPosition = currentPiece ? getGhostPiecePosition(currentPiece) : null

    // Add ghost piece to display board (only if it's different from current piece position)
    if (currentPiece && ghostPosition && ghostPosition.y !== currentPiece.position.y) {
      const { shape, color } = currentPiece
      shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = ghostPosition.y + y
            const boardX = ghostPosition.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              // Only add ghost if the cell is empty (don't override current piece or placed pieces)
              if (displayBoard[boardY][boardX] === 0) {
                displayBoard[boardY][boardX] = -color // Negative value to indicate ghost piece
              }
            }
          }
        })
      })
    }

    // Add current piece to display board (this will override ghost piece cells)
    if (currentPiece) {
      const { shape, position, color } = currentPiece
      shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const boardY = position.y + y
            const boardX = position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = color
            }
          }
        })
      })
    }

    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className={`w-6 h-6 border border-gray-600 ${getCellColor(cell)}`}
          />
        ))}
      </div>
    ))
  }

  const getCellColor = (cell: number) => {
    // Handle ghost pieces (negative values)
    if (cell < 0) {
      const ghostColor = Math.abs(cell)
      switch (ghostColor) {
        case 1: return 'bg-cyan-200 border-cyan-400 opacity-30'
        case 2: return 'bg-blue-200 border-blue-400 opacity-30'
        case 3: return 'bg-orange-200 border-orange-400 opacity-30'
        case 4: return 'bg-yellow-200 border-yellow-400 opacity-30'
        case 5: return 'bg-green-200 border-green-400 opacity-30'
        case 6: return 'bg-purple-200 border-purple-400 opacity-30'
        case 7: return 'bg-red-200 border-red-400 opacity-30'
        default: return 'bg-gray-900'
      }
    }
    
    // Handle regular pieces
    switch (cell) {
      case 1: return 'bg-cyan-500'
      case 2: return 'bg-blue-500'
      case 3: return 'bg-orange-500'
      case 4: return 'bg-yellow-500'
      case 5: return 'bg-green-500'
      case 6: return 'bg-purple-500'
      case 7: return 'bg-red-500'
      default: return 'bg-gray-900'
    }
  }

  return (
    <div className="relative">
      <div className="inline-block border-2 border-gray-600 bg-gray-900 overflow-hidden">
        {renderBoard()}
      </div>
      {(gameOver || paused) && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-xl font-bold">
            {gameOver ? 'GAME OVER' : 'PAUSED'}
          </div>
        </div>
      )}
    </div>
  )
}