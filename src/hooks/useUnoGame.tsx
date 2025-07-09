// hooks/useUnoGame.ts
import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Player, Card, CardColor } from '@/types/uno';
import { 
  createDeck, 
  shuffleDeck, 
  canPlayCard, 
  getNextPlayerIndex, 
  getCardColor,
  drawCards
} from '@/utils/uno';

const initialState: GameState = {
  players: [
    { id: 'player', name: 'You', cards: [], isBot: false },
    { id: 'bot1', name: 'Bot 1', cards: [], isBot: true },
    { id: 'bot2', name: 'Bot 2', cards: [], isBot: true },
    { id: 'bot3', name: 'Bot 3', cards: [], isBot: true }
  ],
  currentPlayerIndex: 0,
  deck: [],
  discardPile: [],
  direction: 1,
  gameStarted: false,
  gameOver: false,
  winner: null,
  currentColor: 'red',
  mustDrawCards: 0,
  hasDrawnThisTurn: false
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const deck = createDeck();
      const players = state.players.map(player => ({
        ...player,
        cards: []
      }));

      // Deal 7 cards to each player
      let currentDeck = [...deck];
      for (let i = 0; i < 7; i++) {
        players.forEach(player => {
          const { drawnCards, remainingDeck } = drawCards(currentDeck, 1);
            (player.cards as Card[]).push(...drawnCards);
          currentDeck = remainingDeck;
        });
      }

      // Find first non-wild card for initial discard
      let firstCard: Card;
      let firstCardIndex = currentDeck.findIndex(card => card.value !== 'wild' && card.value !== 'wild-draw-four');
      if (firstCardIndex === -1) {
        firstCard = currentDeck[0];
        firstCardIndex = 0;
      } else {
        firstCard = currentDeck[firstCardIndex];
      }

      currentDeck.splice(firstCardIndex, 1);

      return {
        ...state,
        players,
        deck: currentDeck,
        discardPile: [firstCard],
        currentColor: firstCard.color,
        gameStarted: true,
        gameOver: false,
        winner: null,
        currentPlayerIndex: 0,
        direction: 1,
        mustDrawCards: 0,
        hasDrawnThisTurn: false
      };
    }

    case 'PLAY_CARD': {
      const { playerId, cardId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      const card = player?.cards.find(c => c.id === cardId);
      
      if (!player || !card) return state;

      const topCard = state.discardPile[state.discardPile.length - 1];
      if (!canPlayCard(card, topCard, state.currentColor)) {
        return state;
      }

      // Remove card from player's hand
      const updatedPlayer = {
        ...player,
        cards: player.cards.filter(c => c.id !== cardId)
      };

      const updatedPlayers = state.players.map(p => 
        p.id === playerId ? updatedPlayer : p
      );

      // Check for winner
      if (updatedPlayer.cards.length === 0) {
        return {
          ...state,
          players: updatedPlayers,
          discardPile: [...state.discardPile, card],
          gameOver: true,
          winner: player.name
        };
      }

      let nextState = {
        ...state,
        players: updatedPlayers,
        discardPile: [...state.discardPile, card],
        currentColor: getCardColor(card, state.currentColor),
        hasDrawnThisTurn: false
      };

      // Handle special cards
      let skipNext = false;
      let drawCards = 0;

      switch (card.value) {
        case 'skip':
          skipNext = true;
          break;
        case 'reverse':
          nextState.direction = nextState.direction * -1 as 1 | -1;
          break;
        case 'draw-two':
          drawCards = 2;
          skipNext = true;
          break;
        case 'wild-draw-four':
          drawCards = 4;
          skipNext = true;
          break;
      }

      // Move to next player
      let nextPlayerIndex = getNextPlayerIndex(
        state.currentPlayerIndex, 
        state.players.length, 
        nextState.direction
      );

      if (skipNext) {
        nextPlayerIndex = getNextPlayerIndex(
          nextPlayerIndex, 
          state.players.length, 
          nextState.direction
        );
      }

      nextState.currentPlayerIndex = nextPlayerIndex;
      nextState.mustDrawCards = drawCards;

      return nextState;
    }

    case 'DRAW_CARD': {
      const { playerId } = action.payload;
      const player = state.players.find(p => p.id === playerId);
      if (!player) return state;

      const drawCount = Math.max(1, state.mustDrawCards);
      const { drawnCards, remainingDeck } = drawCards(state.deck, drawCount);

      // If deck is empty, shuffle discard pile (except top card)
      let finalDeck = remainingDeck;
      let finalDrawnCards = drawnCards;

      if (drawnCards.length < drawCount && state.discardPile.length > 1) {
        const topCard = state.discardPile[state.discardPile.length - 1];
        const reshuffledDeck = shuffleDeck(state.discardPile.slice(0, -1));
        finalDeck = [...remainingDeck, ...reshuffledDeck];
        
        const additionalDraw = drawCards(finalDeck, drawCount - drawnCards.length);
        finalDrawnCards = [...drawnCards, ...additionalDraw.drawnCards];
        finalDeck = additionalDraw.remainingDeck;
      }

      const updatedPlayer = {
        ...player,
        cards: [...player.cards, ...finalDrawnCards]
      };

      const updatedPlayers = state.players.map(p => 
        p.id === playerId ? updatedPlayer : p
      );

      return {
        ...state,
        players: updatedPlayers,
        deck: finalDeck,
        mustDrawCards: 0,
        hasDrawnThisTurn: true
      };
    }

    case 'NEXT_TURN': {
      const nextPlayerIndex = getNextPlayerIndex(
        state.currentPlayerIndex, 
        state.players.length, 
        state.direction
      );

      return {
        ...state,
        currentPlayerIndex: nextPlayerIndex,
        hasDrawnThisTurn: false
      };
    }

    case 'CHOOSE_COLOR': {
      const { color } = action.payload;
      return {
        ...state,
        currentColor: color
      };
    }

    case 'RESET_GAME': {
      return {
        ...initialState,
        players: state.players.map(p => ({ ...p, cards: [] }))
      };
    }

    default:
      return state;
  }
};

export const useUnoGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const playCard = useCallback((playerId: string, cardId: string) => {
    dispatch({ type: 'PLAY_CARD', payload: { playerId, cardId } });
  }, []);

  const drawCard = useCallback((playerId: string) => {
    dispatch({ type: 'DRAW_CARD', payload: { playerId } });
  }, []);

  const nextTurn = useCallback(() => {
    dispatch({ type: 'NEXT_TURN' });
  }, []);

  const chooseColor = useCallback((color: CardColor) => {
    dispatch({ type: 'CHOOSE_COLOR', payload: { color } });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  return {
    state,
    actions: {
      startGame,
      playCard,
      drawCard,
      nextTurn,
      chooseColor,
      resetGame
    }
  };
};