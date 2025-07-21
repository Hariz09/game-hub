import type { GameCard, Player } from "@/types/medieval"

export const generateCardKey = (card: GameCard, prefix: string, index?: number): string => {
  const indexSuffix = index !== undefined ? `-${index}` : ""
  const loyaltySuffix = card.loyalty !== undefined ? `-loyalty-${card.loyalty}` : ""
  return `${prefix}-${card.id}${indexSuffix}${loyaltySuffix}-${Date.now()}`
}

export const isCardDeployed = (card: GameCard, targetPlayer: Player): boolean => {
  const deployedCardIds = [
    ...targetPlayer.playedCards.map((c) => c.id),
    ...(targetPlayer.king ? [targetPlayer.king.id] : []),
    ...(targetPlayer.support ? [targetPlayer.support.id] : []),
  ]
  return deployedCardIds.includes(card.id)
}

export const getAvailableHandCards = (targetPlayer: Player): GameCard[] => {
  return targetPlayer.hand.filter((card) => !isCardDeployed(card, targetPlayer))
}

export const canPlayCard = (card: GameCard, targetPlayer: Player): boolean => {
  return (card.cost || 0) <= targetPlayer.resources
}

export const canPlayAsKing = (card: GameCard): boolean => card.type === "nobility" || card.type === "legendary"

export const canPlayAsSupport = (card: GameCard): boolean => card.type === "support" || card.type === "legendary"

export const canPlayAsNormal = (card: GameCard): boolean => card.type !== "support"

export const calculateStrength = (targetPlayer: Player): number => {
  let totalStrength = 0

  // Add played cards strength
  targetPlayer.playedCards.forEach((card) => {
    let strength = card.strength

    // Apply various boosts
    if (targetPlayer.support?.abilityType === "boost") {
      strength += targetPlayer.support.name.includes("3") ? 3 : 2
    }
    if (targetPlayer.king?.abilityType === "rally") {
      strength += 1
    }

    totalStrength += strength
  })

  // Add king strength
  if (targetPlayer.king) {
    totalStrength += targetPlayer.king.strength
  }

  return totalStrength
}
