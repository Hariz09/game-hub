// types/uno.ts
export type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
export type CardValue =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | 'skip' | 'reverse' | 'draw-two' | 'wild' | 'wild-draw-four';

export interface Card {
  id: string;
  color: CardColor;
  value: CardValue;
}

export interface Player {
  id: string;
  name: string;
  cards: Card[];
  isBot: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  discardPile: Card[];
  direction: 1 | -1;
  gameStarted: boolean;
  gameOver: boolean;
  winner: string | null;
  currentColor: CardColor;
  mustDrawCards: number;
  hasDrawnThisTurn: boolean;
}

// --- Specific Payload Interfaces ---
export interface PlayCardPayload {
  playerId: string;
  cardId: string;
}

export interface DrawCardPayload {
  playerId: string;
}

export interface ChooseColorPayload {
  color: CardColor;
}

// --- Union Type for GameAction ---
// This defines all possible action types and their associated payloads (or lack thereof)
export type GameAction =
  | { type: 'START_GAME' } // No payload for START_GAME
  | { type: 'RESET_GAME' } // No payload for RESET_GAME
  | { type: 'NEXT_TURN' }  // No payload for NEXT_TURN
  | { type: 'PLAY_CARD'; payload: PlayCardPayload }
  | { type: 'DRAW_CARD'; payload: DrawCardPayload }
  | { type: 'CHOOSE_COLOR'; payload: ChooseColorPayload };