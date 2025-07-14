// Types
export interface Tile {
  id: string
  value: number
  row: number
  col: number
  isNew?: boolean
  isMerged?: boolean
}

export interface GameState {
  tiles: Tile[]
  score: number
  gameOver: boolean
  gameWon: boolean
  moves: number
}