// components/uno/GameBoard.tsx
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { CardBack } from './Card';
import { ColorSelector } from './ColorSelector';
import { useUnoGame } from '@/hooks/useUnoGame';
import { botPlayCard, botChooseColor } from '@/utils/uno';
import { CardColor } from '@/types/uno';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card as UICard } from '@/components/ui/card';

export const GameBoard: React.FC = () => {
  const { state, actions } = useUnoGame();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState<string | null>(null);

  const currentPlayer = state.players[state.currentPlayerIndex];
  const topCard = state.discardPile[state.discardPile.length - 1];
  const humanPlayer = state.players.find(p => !p.isBot);

  // Handle bot turns
  useEffect(() => {
    if (!state.gameStarted || state.gameOver || !currentPlayer?.isBot) return;

    const timeout = setTimeout(() => {
      // Bot must draw cards if required
      if (state.mustDrawCards > 0) {
        actions.drawCard(currentPlayer.id);
        return;
      }

      // Bot tries to play a card
      const cardToPlay = botPlayCard(currentPlayer, topCard, state.currentColor);
      
      if (cardToPlay) {
        actions.playCard(currentPlayer.id, cardToPlay.id);
        
        // If bot played a wild card, choose color
        if (cardToPlay.value === 'wild' || cardToPlay.value === 'wild-draw-four') {
          setTimeout(() => {
            const chosenColor = botChooseColor(currentPlayer);
            actions.chooseColor(chosenColor);
          }, 500);
        }
      } else {
        // Bot draws a card
        actions.drawCard(currentPlayer.id);
        setTimeout(() => {
          actions.nextTurn();
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state.currentPlayerIndex, state.gameStarted, state.gameOver, currentPlayer, topCard, state.currentColor, state.mustDrawCards]);

  const handleCardClick = (cardId: string) => {
    if (!humanPlayer || currentPlayer.id !== humanPlayer.id || state.gameOver) return;
    
    const card = humanPlayer.cards.find(c => c.id === cardId);
    if (!card) return;

    // If player must draw cards, they can't play
    if (state.mustDrawCards > 0) return;

    // Check if card is playable
    if (!topCard) return;
    
    const canPlay = card.value === 'wild' || card.value === 'wild-draw-four' ||
                   card.color === state.currentColor || 
                   card.value === topCard.value || 
                   card.color === topCard.color;

    if (!canPlay) return;

    // Handle wild cards
    if (card.value === 'wild' || card.value === 'wild-draw-four') {
      setPendingWildCard(cardId);
      setShowColorSelector(true);
      return;
    }

    // Play normal card
    actions.playCard(humanPlayer.id, cardId);
    setSelectedCard(null);
  };

  const handleColorSelect = (color: CardColor) => {
    if (pendingWildCard && humanPlayer) {
      actions.playCard(humanPlayer.id, pendingWildCard);
      actions.chooseColor(color);
      setPendingWildCard(null);
    }
    setShowColorSelector(false);
  };

  const handleDrawCard = () => {
    if (!humanPlayer || currentPlayer.id !== humanPlayer.id || state.gameOver) return;
    
    actions.drawCard(humanPlayer.id);
    if (state.mustDrawCards === 0) {
      setTimeout(() => actions.nextTurn(), 500);
    }
  };

  const canPlayAnyCard = () => {
    if (!humanPlayer || !topCard) return false;
    return humanPlayer.cards.some(card => 
      card.value === 'wild' || card.value === 'wild-draw-four' ||
      card.color === state.currentColor || 
      card.value === topCard.value || 
      card.color === topCard.color
    );
  };

  const getPlayerPosition = (playerIndex: number) => {
    switch (playerIndex) {
      case 0: return 'bottom'; // Human player
      case 1: return 'left';
      case 2: return 'top';
      case 3: return 'right';
      default: return 'bottom';
    }
  };

  const renderPlayer = (player: any, index: number) => {
    const position = getPlayerPosition(index);
    const isCurrentPlayer = index === state.currentPlayerIndex;
    const isHuman = !player.isBot;
    
    const positionClasses = {
      bottom: 'flex-row justify-center',
      top: 'flex-row justify-center',
      left: 'flex-col items-center',
      right: 'flex-col items-center'
    };

    return (
      <div key={player.id} className={`absolute ${
        position === 'bottom' ? 'bottom-4 left-1/2 transform -translate-x-1/2' :
        position === 'top' ? 'top-4 left-1/2 transform -translate-x-1/2' :
        position === 'left' ? 'left-4 top-1/2 transform -translate-y-1/2' :
        'right-4 top-1/2 transform -translate-y-1/2'
      }`}>
        <div className="mb-2 text-center">
          <Badge variant={isCurrentPlayer ? "default" : "secondary"}>
            {player.name} ({player.cards.length})
          </Badge>
        </div>
        
        <div className={`flex gap-1 ${positionClasses[position]}`}>
          {isHuman ? (
            player.cards.map((card: any) => (
              <Card
                key={card.id}
                card={card}
                isPlayable={
                  isCurrentPlayer && 
                  state.mustDrawCards === 0 && 
                  (card.value === 'wild' || card.value === 'wild-draw-four' ||
                   card.color === state.currentColor || 
                   card.value === topCard?.value || 
                   card.color === topCard?.color)
                }
                isSelected={selectedCard === card.id}
                onClick={() => handleCardClick(card.id)}
                size="sm"
                currentColor={state.currentColor}
              />
            ))
          ) : (
            // Show card backs for bots
            Array.from({ length: Math.min(player.cards.length, 8) }, (_, i) => (
              <CardBack key={i} size="sm" />
            ))
          )}
        </div>
      </div>
    );
  };

  if (!state.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-800">
        <UICard className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">UNO Game</h1>
          <p className="text-lg mb-6">Play UNO against 3 bots!</p>
          <Button onClick={actions.startGame} size="lg">
            Start Game
          </Button>
        </UICard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-800 relative overflow-hidden">
      {/* Game Over Screen */}
      {state.gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <UICard className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
            <p className="text-xl mb-6">{state.winner} wins!</p>
            <Button onClick={actions.resetGame} size="lg">
              Play Again
            </Button>
          </UICard>
        </div>
      )}

      {/* Players */}
      {state.players.map((player, index) => renderPlayer(player, index))}

      {/* Center area with discard pile and deck */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
        {/* Deck */}
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <Badge variant="outline">Deck ({state.deck.length})</Badge>
          </div>
          <div onClick={handleDrawCard} className="cursor-pointer">
            <CardBack size="lg" />
          </div>
        </div>

        {/* Discard pile */}
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <Badge variant="outline">Current Color: {state.currentColor}</Badge>
          </div>
          {topCard && (
            <Card 
              card={topCard} 
              size="lg" 
              currentColor={state.currentColor}
            />
          )}
        </div>
      </div>

      {/* Game info */}
      <div className="absolute top-4 right-4">
        <div className="flex flex-col gap-2">
          <Badge variant="outline">Direction: {state.direction === 1 ? '→' : '←'}</Badge>
          {state.mustDrawCards > 0 && (
            <Badge variant="destructive">Draw {state.mustDrawCards} cards</Badge>
          )}
          {currentPlayer && (
            <Badge variant="default">{currentPlayer.name}'s turn</Badge>
          )}
        </div>
      </div>

      {/* Controls for human player */}
      {humanPlayer && currentPlayer.id === humanPlayer.id && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-4">
            {state.mustDrawCards > 0 ? (
              <Button onClick={handleDrawCard} variant="destructive">
                Draw {state.mustDrawCards} Cards
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleDrawCard}
                  variant="outline"
                  disabled={state.hasDrawnThisTurn}
                >
                  Draw Card
                </Button>
                {state.hasDrawnThisTurn && !canPlayAnyCard() && (
                  <Button onClick={actions.nextTurn} variant="default">
                    End Turn
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Color selector modal */}
      <ColorSelector
        isOpen={showColorSelector}
        onColorSelect={handleColorSelect}
      />
    </div>
  );
};