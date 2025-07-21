import { GameCard } from "@/types/medieval";

// Enhanced card deck with more variety
export const createEnhancedDeck = (playerId: string): GameCard[] => {
  const baseCards: Omit<GameCard, 'id'>[] = [
    // Nobility
    { name: 'Noble Knight', strength: 8, loyalty: 3, type: 'nobility', cost: 4, rarity: 'rare', ability: 'Rallies nearby troops (+1 strength to all)', abilityType: 'rally' },
    { name: 'Royal Guard', strength: 6, loyalty: 2, type: 'nobility', cost: 3, rarity: 'common', ability: 'Protects with shield (+3)', abilityType: 'shield' },
    { name: 'Lord Commander', strength: 10, loyalty: 4, type: 'nobility', cost: 5, rarity: 'legendary', ability: 'Boosts army strength (+3)', abilityType: 'boost' },
    
    // Support
    { name: 'Court Healer', strength: 2, type: 'support', cost: 2, rarity: 'common', ability: 'Heals 2 HP each turn', abilityType: 'heal' },
    { name: 'Master Healer', strength: 3, type: 'support', cost: 3, rarity: 'rare', ability: 'Heals 3 HP each turn', abilityType: 'heal' },
    { name: 'War Strategist', strength: 1, type: 'support', cost: 2, rarity: 'common', ability: 'Boosts army strength (+2)', abilityType: 'boost' },
    { name: 'Grand Strategist', strength: 2, type: 'support', cost: 3, rarity: 'rare', ability: 'Boosts army strength (+3)', abilityType: 'boost' },
    { name: 'Royal Treasurer', strength: 1, type: 'support', cost: 2, rarity: 'rare', ability: 'Boosts army strength (+2)', abilityType: 'boost' },
    { name: 'Master Economist', strength: 2, type: 'support', cost: 4, rarity: 'legendary', ability: 'Boosts army strength (+2)', abilityType: 'boost' },
    
    // Commoners
    { name: 'Peasant Militia', strength: 3, loyalty: 1, type: 'commoner', cost: 1, rarity: 'common' },
    { name: 'Town Guard', strength: 4, loyalty: 2, type: 'commoner', cost: 2, rarity: 'common' },
    { name: 'Veteran Soldier', strength: 5, loyalty: 3, type: 'commoner', cost: 3, rarity: 'common' },
    { name: 'Elite Warrior', strength: 6, loyalty: 2, type: 'commoner', cost: 3, rarity: 'rare' },
    { name: 'Archer Squad', strength: 4, type: 'commoner', cost: 2, rarity: 'common', ability: 'Direct damage (5)', abilityType: 'direct_damage' },
    { name: 'Assassin', strength: 2, loyalty: 1, type: 'commoner', cost: 3, rarity: 'rare', ability: 'Eliminates weakest enemy', abilityType: 'assassinate' },
    
    // Legendary
    { name: 'Ancient Dragon', strength: 15, loyalty: 1, type: 'legendary', cost: 8, rarity: 'legendary', ability: 'Devastating attack (5 direct damage)', abilityType: 'direct_damage' },
    { name: 'Legendary Hero', strength: 12, loyalty: 5, type: 'legendary', cost: 6, rarity: 'legendary', ability: 'Inspires all (+2 to army)', abilityType: 'rally' }
  ];

  return baseCards.map((card, index) => ({
    ...card,
    id: `${playerId}-${index}-${Date.now()}`
  }));
};

