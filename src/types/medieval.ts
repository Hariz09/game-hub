// Enhanced Types
export type CardType = 'nobility' | 'support' | 'commoner' | 'legendary';
export type AbilityType = 'heal' | 'boost' | 'direct_damage' | 'shield' | 'rally' | 'assassinate';

export interface GameCard {
  id: string;
  name: string;
  strength: number;
  loyalty?: number;
  type: CardType;
  ability?: string;
  abilityType?: AbilityType;
  cost?: number; // Resource cost to play
  rarity?: 'common' | 'rare' | 'legendary';
}

export interface Player {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  resources: number; // For playing cards
  deck: GameCard[];
  hand: GameCard[];
  playedCards: GameCard[];
  king: GameCard | null;
  support: GameCard | null;
  shield: number; // Temporary protection
  effects: string[]; // Active status effects
}

export type GamePhase = 'playerTurn' | 'enemyTurn' | 'battle' | 'gameOver';