// utils/uno.ts
import { Card, CardColor, CardValue, Player, GameState } from '@/types/uno';

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  const numbers: CardValue[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const actionCards: CardValue[] = ['skip', 'reverse', 'draw-two'];

  // Add number cards (0 has one card per color, 1-9 have two cards per color)
  colors.forEach(color => {
    numbers.forEach(number => {
      const count = number === '0' ? 1 : 2;
      for (let i = 0; i < count; i++) {
        deck.push({
          id: `${color}-${number}-${i}`,
          color,
          value: number
        });
      }
    });

    // Add action cards (two per color)
    actionCards.forEach(action => {
      for (let i = 0; i < 2; i++) {
        deck.push({
          id: `${color}-${action}-${i}`,
          color,
          value: action
        });
      }
    });
  });

  // Add wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-${i}`,
      color: 'wild',
      value: 'wild'
    });
  }

  // Add wild draw four cards
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `wild-draw-four-${i}`,
      color: 'wild',
      value: 'wild-draw-four'
    });
  }

  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const canPlayCard = (card: Card, topCard: Card, currentColor: CardColor): boolean => {
  if (card.value === 'wild' || card.value === 'wild-draw-four') {
    return true;
  }
  
  return card.color === currentColor || 
         card.value === topCard.value || 
         card.color === topCard.color;
};

export const getNextPlayerIndex = (currentIndex: number, playerCount: number, direction: number): number => {
  const nextIndex = currentIndex + direction;
  if (nextIndex >= playerCount) return 0;
  if (nextIndex < 0) return playerCount - 1;
  return nextIndex;
};

export const getCardColor = (card: Card, currentColor: CardColor): CardColor => {
  if (card.color === 'wild') {
    return currentColor;
  }
  return card.color;
};

export const botPlayCard = (bot: Player, topCard: Card, currentColor: CardColor): Card | null => {
  // Find playable cards
  const playableCards = bot.cards.filter(card => canPlayCard(card, topCard, currentColor));
  
  if (playableCards.length === 0) {
    return null;
  }

  // Bot strategy: prioritize action cards, then wild cards, then number cards
  const actionCards = playableCards.filter(card => 
    ['skip', 'reverse', 'draw-two'].includes(card.value)
  );
  
  const wildCards = playableCards.filter(card => 
    card.value === 'wild' || card.value === 'wild-draw-four'
  );
  
  const numberCards = playableCards.filter(card => 
    !['skip', 'reverse', 'draw-two', 'wild', 'wild-draw-four'].includes(card.value)
  );

  if (actionCards.length > 0) {
    return actionCards[Math.floor(Math.random() * actionCards.length)];
  }
  
  if (numberCards.length > 0) {
    return numberCards[Math.floor(Math.random() * numberCards.length)];
  }
  
  return wildCards[Math.floor(Math.random() * wildCards.length)];
};

export const botChooseColor = (bot: Player): CardColor => {
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  const colorCounts = colors.map(color => ({
    color,
    count: bot.cards.filter(card => card.color === color).length
  }));
  
  // Choose color with most cards
  const bestColor = colorCounts.reduce((best, current) => 
    current.count > best.count ? current : best
  );
  
  return bestColor.color;
};

export const drawCards = (deck: Card[], count: number): { drawnCards: Card[], remainingDeck: Card[] } => {
  const drawnCards = deck.slice(0, count);
  const remainingDeck = deck.slice(count);
  
  return { drawnCards, remainingDeck };
};

export const getCardDisplayValue = (card: Card): string => {
  switch (card.value) {
    case 'skip': return 'Skip';
    case 'reverse': return 'Reverse';
    case 'draw-two': return '+2';
    case 'wild': return 'Wild';
    case 'wild-draw-four': return '+4';
    default: return card.value;
  }
};