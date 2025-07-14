'use client'

import React from 'react'
import { Piece } from '@/types/tetris'

interface NextPieceProps {
  piece: Piece | null
}

export function NextPiece({ piece }: NextPieceProps) {
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

  if (!piece) {
    return <div className="w-16 h-16 bg-gray-900 border border-gray-600" />
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 border border-gray-600 p-2">
      {piece.shape.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-4 h-4 border border-gray-700 ${cell ? getCellColor(piece.color) : 'bg-gray-900'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
