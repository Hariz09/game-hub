export type Board = number[][]

export interface Position {
  x: number
  y: number
}

export interface Piece {
  shape: number[][]
  color: number
  position: Position
}
