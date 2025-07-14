import { GRID_SIZE } from "@/lib/constants/2048"
import { Tile, GameState } from "@/types/2048"
// Helper functions
export const getGridPositions = (): Array<{ row: number, col: number }> => {
  const positions = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      positions.push({ row, col })
    }
  }
  return positions
}

const getRandomEmptyPosition = (tiles: Tile[]): { row: number, col: number } | null => {
  const positions = getGridPositions()
  const occupiedPositions = new Set(tiles.map(tile => `${tile.row}-${tile.col}`))
  const emptyPositions = positions.filter(pos => !occupiedPositions.has(`${pos.row}-${pos.col}`))

  if (emptyPositions.length === 0) return null

  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

export const addRandomTile = (tiles: Tile[]): Tile[] => {
  const emptyPos = getRandomEmptyPosition(tiles)
  if (!emptyPos) return tiles

  const newTile: Tile = {
    id: Date.now().toString() + Math.random(),
    value: Math.random() < 0.9 ? 2 : 4,
    row: emptyPos.row,
    col: emptyPos.col,
    isNew: true
  }

  return [...tiles, newTile]
}

export const initializeGame = (): GameState => {
  let tiles: Tile[] = []
  tiles = addRandomTile(tiles)
  tiles = addRandomTile(tiles)

  return {
    tiles,
    score: 0,
    gameOver: false,
    gameWon: false,
    moves: 0
  }
}

export const getValueColor = (value: number): string => {
  const colors: { [key: number]: string } = {
    2: 'bg-slate-200 text-slate-800',
    4: 'bg-slate-300 text-slate-800',
    8: 'bg-orange-300 text-white',
    16: 'bg-orange-400 text-white',
    32: 'bg-orange-500 text-white',
    64: 'bg-red-400 text-white',
    128: 'bg-red-500 text-white',
    256: 'bg-red-600 text-white',
    512: 'bg-yellow-400 text-white',
    1024: 'bg-yellow-500 text-white',
    2048: 'bg-green-500 text-white'
  }
  return colors[value] || 'bg-purple-500 text-white'
}

export const moveTilesInDirection = (tiles: Tile[], direction: 'up' | 'down' | 'left' | 'right'): { newTiles: Tile[], scoreIncrease: number, moved: boolean } => {
  // Create a grid representation
  const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  tiles.forEach(tile => {
    grid[tile.row][tile.col] = tile
  })

  let scoreIncrease = 0
  let moved = false
  const newGrid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))

  // Process each row/column based on direction
  for (let i = 0; i < GRID_SIZE; i++) {
    let line: (Tile | null)[] = []

    // Extract line based on direction
    if (direction === 'left' || direction === 'right') {
      line = grid[i].slice()
      if (direction === 'right') line.reverse()
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        line.push(grid[j][i])
      }
      if (direction === 'down') line.reverse()
    }

    // Process the line
    const processedLine = processLine(line)
    scoreIncrease += processedLine.scoreIncrease
    if (processedLine.moved) moved = true

    // Put the processed line back
    const finalLine = processedLine.tiles
    if ((direction === 'right') || (direction === 'down')) {
      finalLine.reverse()
    }

    if (direction === 'left' || direction === 'right') {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (finalLine[j]) {
          newGrid[i][j] = {
            ...finalLine[j]!,
            row: i,
            col: j
          }
        }
      }
    } else {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (finalLine[j]) {
          newGrid[j][i] = {
            ...finalLine[j]!,
            row: j,
            col: i
          }
        }
      }
    }
  }

  // Convert grid back to tiles array
  const newTiles: Tile[] = []
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tile = newGrid[row][col]
      if (tile) {
        newTiles.push(tile)
      }
    }
  }

  return { newTiles, scoreIncrease, moved }
}

export const processLine = (line: (Tile | null)[]): { tiles: (Tile | null)[], scoreIncrease: number, moved: boolean } => {
  // Remove nulls and compact
  const compacted = line.filter(tile => tile !== null) as Tile[]
  let scoreIncrease = 0
  let moved = false

  // Check if compaction moved anything
  let originalIndex = 0
  for (let i = 0; i < line.length; i++) {
    if (line[i] !== null) {
      if (i !== originalIndex) {
        moved = true
        break
      }
      originalIndex++
    }
  }

  // Merge tiles
  const merged: Tile[] = []
  let i = 0
  while (i < compacted.length) {
    if (i < compacted.length - 1 && compacted[i].value === compacted[i + 1].value) {
      // Merge tiles
      const mergedTile: Tile = {
        id: Date.now().toString() + Math.random(),
        value: compacted[i].value * 2,
        row: compacted[i].row,
        col: compacted[i].col,
        isMerged: true
      }
      merged.push(mergedTile)
      scoreIncrease += mergedTile.value
      moved = true
      i += 2 // Skip both merged tiles
    } else {
      merged.push(compacted[i])
      i++
    }
  }

  // Fill with nulls
  const result: (Tile | null)[] = [...merged]
  while (result.length < GRID_SIZE) {
    result.push(null)
  }

  return { tiles: result, scoreIncrease, moved }
}

export const canMove = (tiles: Tile[]): boolean => {
  // Check if grid is full
  if (tiles.length < GRID_SIZE * GRID_SIZE) return true

  // Create grid representation
  const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  tiles.forEach(tile => {
    grid[tile.row][tile.col] = tile
  })

  // Check each direction to see if any move is possible
  const directions: ('up' | 'down' | 'left' | 'right')[] = ['up', 'down', 'left', 'right']

  for (const direction of directions) {
    const result = moveTilesInDirection(tiles, direction)
    if (result.moved) {
      return true
    }
  }

  return false
}