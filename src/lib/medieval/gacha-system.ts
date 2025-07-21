import type { GachaBanner, GachaPull, BannerRates } from "@/types/medieval"
import {
  getPlayerProgress,
  addCardsToCollection,
  spendGold,
  getBannerProgress,
  addCardToBannerProgress,
} from "./player-progress"

export const calculateDynamicRates = (banner: GachaBanner, bannerId: string): BannerRates => {
  const obtainedCards = getBannerProgress(bannerId)
  const totalObtained = obtainedCards.length
  const remainingCards = banner.totalCards - totalObtained

  if (remainingCards <= 0) {
    return { legendary: 0, epic: 0, rare: 0, common: 0 }
  }

  // Count remaining cards by rarity
  const remainingByRarity = {
    legendary: 0,
    epic: 0,
    rare: 0,
    common: 0,
  }

  banner.cards.forEach((card) => {
    if (!obtainedCards.includes(card.name)) {
      remainingByRarity[card.rarity]++
    }
  })

  // Calculate new rates based on remaining cards
  const newRates = {
    legendary: (remainingByRarity.legendary / remainingCards) * 100,
    epic: (remainingByRarity.epic / remainingCards) * 100,
    rare: (remainingByRarity.rare / remainingCards) * 100,
    common: (remainingByRarity.common / remainingCards) * 100,
  }

  return newRates
}

export const performGachaPull = (banner: GachaBanner, pullCount = 1): GachaPull[] => {
  const progress = getPlayerProgress()
  const obtainedCards = getBannerProgress(banner.id)
  const results: GachaPull[] = []

  for (let i = 0; i < pullCount; i++) {
    // Get available cards (not yet obtained from this banner)
    const availableCards = banner.cards.filter((card) => !obtainedCards.includes(card.name))

    if (availableCards.length === 0) {
      // Banner completed, no more cards available
      break
    }

    // Calculate current dynamic rates
    const currentRates = calculateDynamicRates(banner, banner.id)

    const roll = Math.random() * 100
    let selectedRarity: string

    if (roll < currentRates.legendary) {
      selectedRarity = "legendary"
    } else if (roll < currentRates.legendary + currentRates.epic) {
      selectedRarity = "epic"
    } else if (roll < currentRates.legendary + currentRates.epic + currentRates.rare) {
      selectedRarity = "rare"
    } else {
      selectedRarity = "common"
    }

    // Filter available cards by selected rarity
    const availableCardsOfRarity = availableCards.filter((card) => card.rarity === selectedRarity)

    // If no cards of selected rarity available, pick from any available
    const cardsToPickFrom = availableCardsOfRarity.length > 0 ? availableCardsOfRarity : availableCards

    const randomCard = cardsToPickFrom[Math.floor(Math.random() * cardsToPickFrom.length)]

    // Check if card is new to player's collection
    const isNew = !progress.ownedCards.some((owned) => owned.name === randomCard.name)

    // Add to banner progress
    addCardToBannerProgress(banner.id, randomCard.name)
    obtainedCards.push(randomCard.name) // Update local tracking for this session

    results.push({
      card: { ...randomCard, id: `gacha_${randomCard.name.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}_${i}` },
      isNew,
    })
  }

  // Add new cards to collection
  const newCards = results.filter((result) => result.isNew).map((result) => result.card)
  if (newCards.length > 0) {
    addCardsToCollection(newCards)
  }

  return results
}

export const canAffordPull = (banner: GachaBanner, pullCount = 1): boolean => {
  const progress = getPlayerProgress()
  const cost = pullCount === 1 ? banner.singlePullCost : banner.multiPullCost
  return progress.gold >= cost
}

export const canPullFromBanner = (banner: GachaBanner): boolean => {
  const obtainedCards = getBannerProgress(banner.id)
  return obtainedCards.length < banner.totalCards
}

export const performPull = (banner: GachaBanner, pullCount = 1): GachaPull[] | null => {
  const cost = pullCount === 1 ? banner.singlePullCost : banner.multiPullCost

  if (!canAffordPull(banner, pullCount)) {
    return null
  }

  if (!canPullFromBanner(banner)) {
    return null
  }

  if (!spendGold(cost)) {
    return null
  }

  return performGachaPull(banner, pullCount)
}

export const getBannerCompletion = (banner: GachaBanner): { obtained: number; total: number; percentage: number } => {
  const obtainedCards = getBannerProgress(banner.id)
  const obtained = obtainedCards.length
  const total = banner.totalCards
  const percentage = Math.round((obtained / total) * 100)

  return { obtained, total, percentage }
}
