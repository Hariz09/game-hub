export type CardType = "soldier" | "minister" | "royalty" | "champion"
export type CardRarity = "common" | "rare" | "epic" | "legendary"
export type AbilityType = "heal" | "boost" | "direct_damage" | "shield" | "rally" | "assassinate" | "resource_gain"
export type GamePhase = "enemySelection" | "playerTurn" | "battle" | "gameOver"

export interface GameCard {
  id: string
  name: string
  type: CardType
  rarity: CardRarity
  strength: number
  cost?: number
  loyalty: number
  ability: string
  abilityType: AbilityType
}

export interface Player {
  id: string
  name: string
  hp: number
  maxHp: number
  resources: number
  deck: GameCard[]
  hand: GameCard[]
  playedCards: GameCard[]
  king: GameCard | null
  support: GameCard | null
  shield: number
  effects: string[]
}

export interface EnemySelection {
  normalCards: GameCard[]
  kingCard: GameCard | null
  supportCard: GameCard | null
}

export interface StageConfig {
  id: string
  name: string
  description: string
  enemyName: string
  enemyDeck: GameCard[]
  difficulty: "easy" | "medium" | "hard"
  rewards: GameCard[]
  unlocked: boolean
  completed: boolean
}

export interface PlayerProgress {
  ownedCards: GameCard[]
  completedStages: string[]
  currentStage: number
  gold: number
  completedDungeons: string[]
  bannerProgress: { [bannerId: string]: string[] } // Track obtained cards per banner
}

export interface GachaBanner {
  id: string
  name: string
  description: string
  theme: string
  cards: GameCard[]
  baseRates: {
    legendary: number
    epic: number
    rare: number
    common: number
  }
  isActive: boolean
  singlePullCost: number
  multiPullCost: number
  totalCards: number
  rarityDistribution: {
    legendary: number
    epic: number
    rare: number
    common: number
  }
}

export interface DungeonStage {
  id: string
  name: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  goldReward: number
  enemyDeck: GameCard[]
  unlocked: boolean
  completed: boolean
}

export interface GachaPull {
  card: GameCard
  isNew: boolean
}

export interface BannerRates {
  legendary: number
  epic: number
  rare: number
  common: number
}
