'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Shield, Sword, Heart, Users, Zap, Star, Target, SkipForward, Trash2, ArrowUp } from 'lucide-react';
import { GameCard, Player, GamePhase, AbilityType } from '@/types/medieval';
import { createEnhancedDeck } from '@/data/medieval';
import Sidebar from '@/components/sidebar/Sidebar';

const EnhancedCardComponent: React.FC<{
  card: GameCard;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showLoyalty?: boolean;
  canAfford?: boolean;
}> = ({ card, isSelected, onClick, disabled, showLoyalty = true, canAfford = true }) => {
  const getTypeIcon = () => {
    switch (card.type) {
      case 'nobility': return <Crown className="w-4 h-4" />;
      case 'support': return <Shield className="w-4 h-4" />;
      case 'commoner': return <Users className="w-4 h-4" />;
      case 'legendary': return <Star className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (card.type) {
      case 'nobility': return 'bg-yellow-100 text-yellow-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'commoner': return 'bg-green-100 text-green-800';
      case 'legendary': return 'bg-purple-100 text-purple-800';
    }
  };

  const getRarityBorder = () => {
    switch (card.rarity) {
      case 'legendary': return 'border-purple-400 border-2';
      case 'rare': return 'border-blue-400 border-2';
      default: return 'border-gray-200';
    }
  };

  const getAbilityIcon = () => {
    switch (card.abilityType) {
      case 'heal': return <Heart className="w-3 h-3 text-green-500" />;
      case 'boost': return <Zap className="w-3 h-3 text-yellow-500" />;
      case 'direct_damage': return <Target className="w-3 h-3 text-red-500" />;
      case 'shield': return <Shield className="w-3 h-3 text-blue-500" />;
      case 'rally': return <Users className="w-3 h-3 text-orange-500" />;
      case 'assassinate': return <Sword className="w-3 h-3 text-black" />;
      default: return null;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${getRarityBorder()} ${isSelected ? 'ring-2 ring-blue-500' : ''
        } ${disabled || !canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled || !canAfford ? undefined : onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor()}>
            {getTypeIcon()}
            <span className="ml-1 text-xs">{card.type}</span>
          </Badge>
          <div className="flex items-center space-x-2">
            {card.cost !== undefined && (
              <div className="flex items-center bg-amber-100 px-1 rounded">
                <span className="text-xs font-bold text-amber-800">{card.cost}</span>
              </div>
            )}
            {card.strength > 0 && (
              <div className="flex items-center">
                <Sword className="w-4 h-4 text-red-500 mr-1" />
                <span className="font-bold">{card.strength}</span>
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-sm">{card.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {card.loyalty !== undefined && showLoyalty && (
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-pink-500 mr-1" />
            <span className="text-sm">Loyalty: {card.loyalty}</span>
          </div>
        )}
        {card.ability && (
          <div className="flex items-start">
            {getAbilityIcon()}
            <p className="text-xs text-gray-600 italic ml-1">{card.ability}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EnhancedMedievalCardBattle: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('playerTurn');
  const [player, setPlayer] = useState<Player>({
    id: 'player',
    name: 'Player',
    hp: 60,
    maxHp: 60,
    resources: 5,
    deck: [],
    hand: [],
    playedCards: [],
    king: null,
    support: null,
    shield: 0,
    effects: []
  });

  const [enemy, setEnemy] = useState<Player>({
    id: 'enemy',
    name: 'Enemy',
    hp: 60,
    maxHp: 60,
    resources: 5,
    deck: [],
    hand: [],
    playedCards: [],
    king: null,
    support: null,
    shield: 0,
    effects: []
  });

  const [selectedCards, setSelectedCards] = useState<GameCard[]>([]);
  const [selectedKing, setSelectedKing] = useState<GameCard | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<GameCard | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [turn, setTurn] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [playerEnergyBonus, setPlayerEnergyBonus] = useState(0);
  const [enemyEnergyBonus, setEnemyEnergyBonus] = useState(0);
  const [enemySelectedCards, setEnemySelectedCards] = useState<{
    normalCards: GameCard[];
    kingCard: GameCard | null;
    supportCard: GameCard | null;
  }>({ normalCards: [], kingCard: null, supportCard: null });
  const [showEnemySelection, setShowEnemySelection] = useState(false);

  // Initialize game
  useEffect(() => {
    if (!isInitialized) {
      const playerDeck = createEnhancedDeck('player');
      const enemyDeck = createEnhancedDeck('enemy');

      setPlayer(prev => ({ ...prev, deck: playerDeck }));
      setEnemy(prev => ({ ...prev, deck: enemyDeck }));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    if (isInitialized && player.deck.length > 0 && enemy.deck.length > 0 && player.hand.length === 0) {
      drawCards(4, 'player');
      drawCards(4, 'enemy');
    }
  }, [isInitialized, player.deck, enemy.deck, player.hand.length]);

  const isCardDeployed = (card: GameCard, targetPlayer: Player) => {
    const deployedCardIds = [
      ...targetPlayer.playedCards.map(c => c.id),
      ...(targetPlayer.king ? [targetPlayer.king.id] : []),
      ...(targetPlayer.support ? [targetPlayer.support.id] : [])
    ];
    return deployedCardIds.includes(card.id);
  };

  const getAvailableHandCards = (targetPlayer: Player) => {
    return targetPlayer.hand.filter(card => !isCardDeployed(card, targetPlayer));
  };

  const drawCards = (count: number, playerId: string) => {
    const targetPlayer = playerId === 'player' ? player : enemy;
    const setTargetPlayer = playerId === 'player' ? setPlayer : setEnemy;

    const availableCards = targetPlayer.deck.filter(card =>
      !targetPlayer.hand.some(handCard => handCard.id === card.id)
    );

    const cardsToDraw = availableCards.slice(0, count);

    setTargetPlayer(prev => ({
      ...prev,
      hand: [...prev.hand, ...cardsToDraw]
    }));
  };

  const canPlayCard = (card: GameCard, targetPlayer: Player) => {
    return (card.cost || 0) <= targetPlayer.resources;
  };

  const canPlayAsKing = (card: GameCard) => card.type === 'nobility' || card.type === 'legendary';
  const canPlayAsSupport = (card: GameCard) => card.type === 'support' || card.type === 'legendary';
  const canPlayAsNormal = (card: GameCard) => card.type !== 'support';

  const calculateResourceCost = () => {
    let totalCost = 0;
    selectedCards.forEach(card => totalCost += card.cost || 0);
    if (selectedKing) totalCost += selectedKing.cost || 0;
    if (selectedSupport) totalCost += selectedSupport.cost || 0;
    return totalCost;
  };

  const handleCardSelect = (card: GameCard, role: 'normal' | 'king' | 'support') => {
    if (!canPlayCard(card, player)) return;

    if (role === 'king' && canPlayAsKing(card) && !player.king && !selectedKing) {
      setSelectedKing(card);
    } else if (role === 'support' && canPlayAsSupport(card) && !player.support && !selectedSupport) {
      setSelectedSupport(card);
    } else if (role === 'normal' && canPlayAsNormal(card)) {
      if (selectedCards.includes(card)) {
        setSelectedCards(selectedCards.filter(c => c.id !== card.id));
      } else if (selectedCards.length + player.playedCards.length < 4) {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  const discardCard = (card: GameCard) => {
    setPlayer(prev => ({
      ...prev,
      hand: prev.hand.filter(c => c.id !== card.id),
      deck: [...prev.deck, card]
    }));
    setBattleLog(prev => [...prev, `Player discards ${card.name}`]);
  };

  const applyCardAbilities = (card: GameCard, caster: Player, setCaster: React.Dispatch<React.SetStateAction<Player>>, target: Player, setTarget: React.Dispatch<React.SetStateAction<Player>>) => {
    const newLog: string[] = [];

    switch (card.abilityType) {
      case 'heal':
        const healAmount = card.name.includes('3') ? 3 : 2;
        setCaster(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + healAmount)
        }));
        newLog.push(`${card.name} heals ${caster.name} for ${healAmount} HP`);
        break;

      case 'direct_damage':
        const damageAmount = 5;
        setTarget(prev => ({
          ...prev,
          hp: Math.max(0, prev.hp - Math.max(0, damageAmount - prev.shield)),
          shield: Math.max(0, prev.shield - damageAmount)
        }));
        newLog.push(`${card.name} deals ${damageAmount} direct damage to ${target.name}`);
        break;

      case 'shield':
        const shieldAmount = 3;
        setCaster(prev => ({
          ...prev,
          shield: prev.shield + shieldAmount
        }));
        newLog.push(`${card.name} grants ${shieldAmount} shield to ${caster.name}`);
        break;

      case 'assassinate':
        if (target.playedCards.length > 0) {
          const weakestCard = target.playedCards.reduce((weakest, current) =>
            current.strength < weakest.strength ? current : weakest
          );
          setTarget(prev => ({
            ...prev,
            playedCards: prev.playedCards.filter(c => c.id !== weakestCard.id)
          }));
          newLog.push(`${card.name} assassinates ${weakestCard.name}!`);
        }
        break;
    }

    return newLog;
  };

  const skipTurn = () => {
    if (gamePhase === 'playerTurn') {
      setBattleLog(prev => [...prev, `Player skips their turn`]);
      setGamePhase('enemyTurn');
    }
  };

  const confirmSelection = () => {
    if (gamePhase === 'playerTurn') {
      const totalCost = calculateResourceCost();
      if (totalCost > player.resources) return;

      // Apply card abilities and check for energy bonus
      let abilityLog: string[] = [];
      let energyBonusIncrease = 0;

      [...selectedCards, selectedKing, selectedSupport].forEach(card => {
        if (card && card.abilityType) {
          const log = applyCardAbilities(card, player, setPlayer, enemy, setEnemy);
          abilityLog = [...abilityLog, ...log];
        }

        // Check for energy bonus ability (assuming cards with "Merchant" or "Economist" in name give energy bonus)
        if (card && (card.name.toLowerCase().includes('merchant') || card.name.toLowerCase().includes('economist'))) {
          energyBonusIncrease += 1;
          abilityLog.push(`${card.name} provides +1 energy per turn!`);
        }
      });

      setPlayerEnergyBonus(prev => prev + energyBonusIncrease);

      setPlayer(prev => ({
        ...prev,
        playedCards: [...prev.playedCards, ...selectedCards],
        king: selectedKing || prev.king,
        support: selectedSupport || prev.support,
        resources: prev.resources - totalCost
      }));

      setBattleLog(prev => [...prev, ...abilityLog]);
      setSelectedCards([]);
      setSelectedKing(null);
      setSelectedSupport(null);
      setGamePhase('enemyTurn');
    }
  };

  // Retrieve King from battlefield back to hand
  const retrieveKing = () => {
    if (!player.king) return;

    const kingCard = player.king;
    
    setPlayer(prev => {
      // Remove any existing instance of this card from hand first
      const filteredHand = prev.hand.filter(handCard => handCard.id !== kingCard.id);
      
      return {
        ...prev,
        king: null,
        hand: [...filteredHand, kingCard]
      };
    });

    setBattleLog(prev => [...prev, `Player retrieves King ${kingCard.name} back to hand`]);
  };

  // Retrieve Support from battlefield back to hand
  const retrieveSupport = () => {
    if (!player.support) return;

    const supportCard = player.support;
    
    setPlayer(prev => {
      // Remove any existing instance of this card from hand first
      const filteredHand = prev.hand.filter(handCard => handCard.id !== supportCard.id);
      
      return {
        ...prev,
        support: null,
        hand: [...filteredHand, supportCard]
      };
    });

    setBattleLog(prev => [...prev, `Player retrieves Support ${supportCard.name} back to hand`]);
  };

  // Generate unique key for cards to avoid React key conflicts
  const generateCardKey = (card: GameCard, prefix: string, index?: number) => {
    const indexSuffix = index !== undefined ? `-${index}` : '';
    const loyaltySuffix = card.loyalty !== undefined ? `-loyalty-${card.loyalty}` : '';
    return `${prefix}-${card.id}${indexSuffix}${loyaltySuffix}-${Date.now()}`;
  };

  // Retrieve card from army back to hand
  const retrieveFromArmy = (card: GameCard, index: number) => {
    setPlayer(prev => ({
      ...prev,
      playedCards: prev.playedCards.filter((_, i) => i !== index),
      hand: [...prev.hand, card]
    }));

    setBattleLog(prev => [...prev, `Player retrieves ${card.name} from army back to hand`]);
  };

  const enemyAI = () => {
    const availableCards = getAvailableHandCards(enemy).filter(card => canPlayCard(card, enemy));

    // Simple AI: prioritize high-value cards within resource limit
    const sortedCards = availableCards.sort((a, b) => (b.strength + (b.cost || 0)) - (a.strength + (a.cost || 0)));

    let remainingResources = enemy.resources;
    const selectedNormalCards: GameCard[] = [];
    let selectedKingCard: GameCard | null = null;
    let selectedSupportCard: GameCard | null = null;

    // Try to select cards within resource limit
    for (const card of sortedCards) {
      const cost = card.cost || 0;
      if (cost <= remainingResources) {
        if (!selectedKingCard && canPlayAsKing(card) && !enemy.king) {
          selectedKingCard = card;
          remainingResources -= cost;
        } else if (!selectedSupportCard && canPlayAsSupport(card) && !enemy.support) {
          selectedSupportCard = card;
          remainingResources -= cost;
        } else if (canPlayAsNormal(card) && selectedNormalCards.length < 4) {
          selectedNormalCards.push(card);
          remainingResources -= cost;
        }
      }
    }

    return { selectedNormalCards, selectedKingCard, selectedSupportCard, remainingResources };
  };

  const processEnemyTurn = () => {
    const enemySelections = enemyAI();
    setEnemySelectedCards({
      normalCards: enemySelections.selectedNormalCards,
      kingCard: enemySelections.selectedKingCard,
      supportCard: enemySelections.selectedSupportCard
    });
    setShowEnemySelection(true);

    setBattleLog(prev => [
      ...prev,
      `Turn ${turn}: Enemy selects ${enemySelections.selectedNormalCards.length + (enemySelections.selectedKingCard ? 1 : 0) + (enemySelections.selectedSupportCard ? 1 : 0)} cards`
    ]);

    // Apply abilities and check for energy bonus
    let energyBonusIncrease = 0;
    [...enemySelections.selectedNormalCards, enemySelections.selectedKingCard, enemySelections.selectedSupportCard].forEach(card => {
      if (card && card.abilityType) {
        applyCardAbilities(card, enemy, setEnemy, player, setPlayer);
      }

      if (card && (card.name.toLowerCase().includes('merchant') || card.name.toLowerCase().includes('economist'))) {
        energyBonusIncrease += 1;
      }
    });

    setEnemyEnergyBonus(prev => prev + energyBonusIncrease);

    setEnemy(prev => ({
      ...prev,
      playedCards: [...prev.playedCards, ...enemySelections.selectedNormalCards],
      king: enemySelections.selectedKingCard || prev.king,
      support: enemySelections.selectedSupportCard || prev.support,
      resources: enemySelections.remainingResources
    }));

    // Show enemy selection for 2 seconds, then go to battle
    setTimeout(() => {
      setShowEnemySelection(false);
      setGamePhase('battle');
    }, 2000);
  };

  const processBattle = () => {
    let newBattleLog: string[] = [];

    // Calculate total strength with bonuses
    const calculateStrength = (targetPlayer: Player) => {
      let totalStrength = 0;

      // Add played cards strength
      targetPlayer.playedCards.forEach(card => {
        let strength = card.strength;

        // Apply various boosts
        if (targetPlayer.support?.abilityType === 'boost') {
          strength += targetPlayer.support.name.includes('3') ? 3 : 2;
        }
        if (targetPlayer.king?.abilityType === 'rally') {
          strength += 1;
        }

        totalStrength += strength;
      });

      // Add king strength
      if (targetPlayer.king) {
        totalStrength += targetPlayer.king.strength;
      }

      return totalStrength;
    };

    const playerStrength = calculateStrength(player);
    const enemyStrength = calculateStrength(enemy);

    // Apply damage with shield consideration
    const playerDamage = Math.max(0, enemyStrength - player.shield);
    const enemyDamage = Math.max(0, playerStrength - enemy.shield);

    newBattleLog.push(`Player army deals ${playerStrength} damage (${enemyDamage} after shield)`);
    newBattleLog.push(`Enemy army deals ${enemyStrength} damage (${playerDamage} after shield)`);

    // Update HP and shields
    setPlayer(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - playerDamage),
      shield: Math.max(0, prev.shield - enemyStrength)
    }));

    setEnemy(prev => ({
      ...prev,
      hp: Math.max(0, prev.hp - enemyDamage),
      shield: Math.max(0, prev.shield - playerStrength)
    }));

    // Apply support healing
    if (player.support?.abilityType === 'heal') {
      const healAmount = player.support.name.includes('3') ? 3 : 2;
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount)
      }));
      newBattleLog.push(`${player.support.name} heals player for ${healAmount} HP`);
    }

    if (enemy.support?.abilityType === 'heal') {
      const healAmount = enemy.support.name.includes('3') ? 3 : 2;
      setEnemy(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount)
      }));
      newBattleLog.push(`${enemy.support.name} heals enemy for ${healAmount} HP`);
    }

    // Process loyalty
    const processLoyalty = (currentPlayer: Player, setCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>, opponent: Player, setOpponent: React.Dispatch<React.SetStateAction<Player>>) => {
      const updatedPlayedCards: GameCard[] = [];
      const cardsToTransfer: GameCard[] = [];

      currentPlayer.playedCards.forEach(card => {
        if (card.loyalty !== undefined) {
          const newLoyalty = card.loyalty - 1;
          if (newLoyalty <= 0) {
            cardsToTransfer.push(card);
            newBattleLog.push(`${card.name} betrays ${currentPlayer.name}!`);
          } else {
            updatedPlayedCards.push({ ...card, loyalty: newLoyalty });
          }
        } else {
          updatedPlayedCards.push(card);
        }
      });

      let updatedKing = currentPlayer.king;
      if (updatedKing && updatedKing.loyalty !== undefined) {
        const newLoyalty = updatedKing.loyalty - 1;
        if (newLoyalty <= 0) {
          cardsToTransfer.push(updatedKing);
          newBattleLog.push(`King ${updatedKing.name} betrays ${currentPlayer.name}!`);
          updatedKing = null;
        } else {
          updatedKing = { ...updatedKing, loyalty: newLoyalty };
        }
      }

      setCurrentPlayer(prev => ({
        ...prev,
        playedCards: updatedPlayedCards,
        king: updatedKing
      }));

      if (cardsToTransfer.length > 0) {
        setOpponent(prev => ({
          ...prev,
          deck: [...prev.deck, ...cardsToTransfer]
        }));
      }
    };

    processLoyalty(player, setPlayer, enemy, setEnemy);
    processLoyalty(enemy, setEnemy, player, setPlayer);

    setBattleLog(prev => [...prev, ...newBattleLog]);

    // Check win condition and prepare next turn
    setTimeout(() => {
      if (player.hp <= 0) {
        setGamePhase('gameOver');
        setBattleLog(prev => [...prev, 'Enemy wins!']);
      } else if (enemy.hp <= 0) {
        setGamePhase('gameOver');
        setBattleLog(prev => [...prev, 'Player wins!']);
      } else {
        setTurn(prev => prev + 1);

        // Restore resources (3 base + bonus)
        setPlayer(prev => ({
          ...prev,
          resources: Math.min(10, prev.resources + 3 + playerEnergyBonus)
        }));
        setEnemy(prev => ({
          ...prev,
          resources: Math.min(10, prev.resources + 3 + enemyEnergyBonus)
        }));

        const playerHandSize = getAvailableHandCards(player).length;
        const enemyHandSize = getAvailableHandCards(enemy).length;

        if (playerHandSize < 5) drawCards(Math.min(2, 5 - playerHandSize), 'player');
        if (enemyHandSize < 5) drawCards(Math.min(2, 5 - enemyHandSize), 'enemy');

        setGamePhase('playerTurn');
      }
    }, 3000);
  };

  useEffect(() => {
    if (gamePhase === 'enemyTurn') {
      setTimeout(processEnemyTurn, 1000);
    } else if (gamePhase === 'battle') {
      setTimeout(processBattle, 1000);
    }
  }, [gamePhase]);

  const resetGame = () => {
    const playerDeck = createEnhancedDeck('player');
    const enemyDeck = createEnhancedDeck('enemy');

    setPlayer({
      id: 'player',
      name: 'Player',
      hp: 60,
      maxHp: 60,
      resources: 5,
      deck: playerDeck,
      hand: [],
      playedCards: [],
      king: null,
      support: null,
      shield: 0,
      effects: []
    });

    setEnemy({
      id: 'enemy',
      name: 'Enemy',
      hp: 60,
      maxHp: 60,
      resources: 5,
      deck: enemyDeck,
      hand: [],
      playedCards: [],
      king: null,
      support: null,
      shield: 0,
      effects: []
    });

    setSelectedCards([]);
    setSelectedKing(null);
    setSelectedSupport(null);
    setBattleLog([]);
    setTurn(1);
    setPlayerEnergyBonus(0);
    setEnemyEnergyBonus(0);
    setEnemySelectedCards({ normalCards: [], kingCard: null, supportCard: null });
    setShowEnemySelection(false);
    setGamePhase('playerTurn');

    setTimeout(() => {
      drawCards(4, 'player');
      drawCards(4, 'enemy');
    }, 100);
  };

  const currentResourceCost = calculateResourceCost();
  const canAffordSelection = currentResourceCost <= player.resources;
  const availableHandCards = getAvailableHandCards(player);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 flex items-center justify-center">
        <div className="text-amber-800">Loading Enhanced Medieval Card Battle...</div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
    <div className="max-w-7xl mx-auto">
      <Sidebar />
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-amber-800 mb-2">Enhanced Medieval Card Battle</h1>
        <div className="flex justify-center items-center space-x-4 text-amber-700">
          <span>Turn {turn}</span>
          <Badge variant="outline" className="capitalize">
            {gamePhase.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </Badge>
          {gamePhase === 'playerTurn' && (
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className={`font-bold ${canAffordSelection ? 'text-green-600' : 'text-red-600'}`}>
                Resources: {currentResourceCost}/{player.resources}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Player and Enemy Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Player Status */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-blue-800">
              <span>{player.name}</span>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{player.hp}/{player.maxHp}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={(player.hp / player.maxHp) * 100} className="w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Resources: {player.resources}/10</span>
                  {playerEnergyBonus > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800">+{playerEnergyBonus}/turn</Badge>
                  )}
                </div>
                {player.shield > 0 && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>{player.shield}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Hand: {availableHandCards.length} | Deck: {player.deck.length - player.hand.length}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enemy Status */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-red-800">
              <span>{enemy.name}</span>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{enemy.hp}/{enemy.maxHp}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="w-full" />
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Resources: {enemy.resources}/10</span>
                  {enemyEnergyBonus > 0 && (
                    <Badge className="bg-yellow-100 text-yellow-800">+{enemyEnergyBonus}/turn</Badge>
                  )}
                </div>
                {enemy.shield > 0 && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span>{player.shield}</span>
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600">
                Hand: {getAvailableHandCards(enemy).length} | Deck: {enemy.deck.length - enemy.hand.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battlefield - Kings and Support */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Player Battlefield */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Player's Court</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Crown className="w-4 h-4 mr-1" />
                  King
                </h4>
                {selectedKing ? (
                  <div className="space-y-2">
                    <EnhancedCardComponent 
                      card={selectedKing} 
                      isSelected={true}
                      onClick={() => setSelectedKing(null)}
                    />
                    <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
                  </div>
                ) : player.king ? (
                  <div className="space-y-2">
                    <EnhancedCardComponent card={player.king} />
                    {gamePhase === 'playerTurn' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => retrieveKing()}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Retrieve to Hand
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-blue-300 rounded text-center text-blue-500">
                    No King
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Support
                </h4>
                {selectedSupport ? (
                  <div className="space-y-2">
                    <EnhancedCardComponent 
                      card={selectedSupport} 
                      isSelected={true}
                      onClick={() => setSelectedSupport(null)}
                    />
                    <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
                  </div>
                ) : player.support ? (
                  <div className="space-y-2">
                    <EnhancedCardComponent card={player.support} />
                    {gamePhase === 'playerTurn' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => retrieveSupport()}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Retrieve to Hand
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-blue-300 rounded text-center text-blue-500">
                    No Support
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enemy Battlefield */}
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Enemy's Court</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Crown className="w-4 h-4 mr-1" />
                  King
                </h4>
                {enemy.king ? (
                  <EnhancedCardComponent card={enemy.king} />
                ) : (
                  <div className="p-4 border-2 border-dashed border-red-300 rounded text-center text-red-500">
                    No King
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Support
                </h4>
                {enemy.support ? (
                  <EnhancedCardComponent card={enemy.support} />
                ) : (
                  <div className="p-4 border-2 border-dashed border-red-300 rounded text-center text-red-500">
                    No Support
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Armies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Player Army */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Player's Army ({player.playedCards.length + selectedCards.length}/4)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Currently deployed cards */}
              {player.playedCards.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-blue-700 mb-2">Deployed Units</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {player.playedCards.map((card, index) => (
                      <div key={generateCardKey(card, 'deployed', index)} className="space-y-2">
                        <EnhancedCardComponent card={card} />
                        {gamePhase === 'playerTurn' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            onClick={() => retrieveFromArmy(card, index)}
                          >
                            <ArrowUp className="w-3 h-3 mr-1" />
                            Retrieve to Hand
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected cards for deployment */}
              {selectedCards.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-blue-700 mb-2">Selected for Deployment</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCards.map((card, index) => (
                      <div key={`selected-${card.id}-${index}`} className="space-y-2">
                        <EnhancedCardComponent 
                          card={card} 
                          isSelected={true}
                          onClick={() => handleCardSelect(card, 'normal')}
                        />
                        <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Empty state */}
              {player.playedCards.length === 0 && selectedCards.length === 0 && (
                <div className="p-4 text-center text-blue-500">No units deployed or selected</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enemy Army */}
        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Enemy's Army ({enemy.playedCards.length}/4)</CardTitle>
          </CardHeader>
          <CardContent>
            {enemy.playedCards.length === 0 ? (
              <div className="p-4 text-center text-red-500">No units deployed</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enemy.playedCards.map((card, index) => (
                  <EnhancedCardComponent key={`enemy-${card.id}-${index}`} card={card} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enemy Selection Display */}
      {showEnemySelection && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">Enemy's Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Enemy Normal Cards */}
              <div>
                <h4 className="font-semibold mb-2">Normal Cards</h4>
                <div className="space-y-2">
                  {enemySelectedCards.normalCards.map((card, index) => (
                    <EnhancedCardComponent key={`enemy-selected-${card.id}-${index}`} card={card} />
                  ))}
                  {enemySelectedCards.normalCards.length === 0 && (
                    <div className="p-2 text-center text-gray-500 text-sm">None</div>
                  )}
                </div>
              </div>
              
              {/* Enemy King */}
              <div>
                <h4 className="font-semibold mb-2">King</h4>
                {enemySelectedCards.kingCard ? (
                  <EnhancedCardComponent card={enemySelectedCards.kingCard} />
                ) : (
                  <div className="p-2 text-center text-gray-500 text-sm">None</div>
                )}
              </div>
              
              {/* Enemy Support */}
              <div>
                <h4 className="font-semibold mb-2">Support</h4>
                {enemySelectedCards.supportCard ? (
                  <EnhancedCardComponent card={enemySelectedCards.supportCard} />
                ) : (
                  <div className="p-2 text-center text-gray-500 text-sm">None</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Hand and Actions */}
      {gamePhase === 'playerTurn' && (
        <div className="space-y-6">
          {/* Player Hand */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Hand ({availableHandCards.length})</span>
                <div className="flex space-x-2">
                  <Button onClick={skipTurn} variant="outline" size="sm">
                    <SkipForward className="w-4 h-4 mr-1" />
                    Skip Turn
                  </Button>
                  <Button 
                    onClick={confirmSelection}
                    disabled={!canAffordSelection || (selectedCards.length === 0 && !selectedKing && !selectedSupport)}
                    size="sm"
                  >
                    Confirm Selection
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {availableHandCards.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No cards in hand</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {availableHandCards.map((card) => {
                    const isSelected = selectedCards.includes(card) || selectedKing === card || selectedSupport === card;
                    const canAfford = canPlayCard(card, player);
                    
                    return (
                      <div key={card.id} className="space-y-2">
                        <EnhancedCardComponent
                          card={card}
                          isSelected={isSelected}
                          canAfford={canAfford}
                          onClick={() => handleCardSelect(card, 'normal')}
                        />
                        <div className="flex space-x-1">
                          {canPlayAsKing(card) && !player.king && !selectedKing && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1"
                              onClick={() => handleCardSelect(card, 'king')}
                              disabled={!canAfford}
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              King
                            </Button>
                          )}
                          {canPlayAsSupport(card) && !player.support && !selectedSupport && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1"
                              onClick={() => handleCardSelect(card, 'support')}
                              disabled={!canAfford}
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Support
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs px-2 py-1"
                            onClick={() => discardCard(card)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Game Over Screen */}
      {gamePhase === 'gameOver' && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-center text-amber-800">Game Over</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-lg font-semibold">
              {player.hp > 0 ? 'Victory!' : 'Defeat!'}
            </div>
            <Button onClick={resetGame} className="w-full">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Battle Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Battle Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-40 overflow-y-auto space-y-1">
            {battleLog.length === 0 ? (
              <div className="text-gray-500 text-center">No events yet</div>
            ) : (
              battleLog.slice(-10).map((log, index) => (
                <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
};

export default EnhancedMedievalCardBattle;