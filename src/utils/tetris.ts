import { Board, Piece, Position } from '@/types/tetris'
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/lib/constants/tetris'

export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
}

export function getRandomPiece(): Piece {
  const pieces = [
    // I piece
    { shape: [[1, 1, 1, 1]], color: 1 },
    // J piece
    { shape: [[2, 0, 0], [2, 2, 2]], color: 2 },
    // L piece
    { shape: [[0, 0, 3], [3, 3, 3]], color: 3 },
    // O piece
    { shape: [[4, 4], [4, 4]], color: 4 },
    // S piece
    { shape: [[0, 5, 5], [5, 5, 0]], color: 5 },
    // T piece
    { shape: [[0, 6, 0], [6, 6, 6]], color: 6 },
    // Z piece
    { shape: [[7, 7, 0], [0, 7, 7]], color: 7 }
  ]

  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
  return {
    ...randomPiece,
    position: { x: 3, y: 0 }
  }
}

export function isValidMove(board: Board, piece: Piece, position: Position): boolean {
  return piece.shape.every((row, y) =>
    row.every((cell, x) => {
      if (!cell) return true
      
      const newX = position.x + x
      const newY = position.y + y
      
      return (
        newX >= 0 &&
        newX < BOARD_WIDTH &&
        newY >= 0 &&
        newY < BOARD_HEIGHT &&
        board[newY][newX] === 0
      )
    })
  )
}

export function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row])
  
  piece.shape.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell) {
        const boardY = piece.position.y + y
        const boardX = piece.position.x + x
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color
        }
      }
    })
  })
  
  return newBoard
}

export function clearLines(board: Board): { clearedBoard: Board; linesCleared: number } {
  const clearedBoard = board.filter(row => row.some(cell => cell === 0))
  const linesCleared = BOARD_HEIGHT - clearedBoard.length
  
  while (clearedBoard.length < BOARD_HEIGHT) {
    clearedBoard.unshift(Array(BOARD_WIDTH).fill(0))
  }
  
  return { clearedBoard, linesCleared }
}