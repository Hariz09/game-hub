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

export interface GameAction {
  type: 'PLAY_CARD' | 'DRAW_CARD' | 'NEXT_TURN' | 'CHOOSE_COLOR' | 'START_GAME' | 'RESET_GAME';
  payload?: any;
}