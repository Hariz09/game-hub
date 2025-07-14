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
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row])

    // Add current piece to display board
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
