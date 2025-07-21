import type { PlayerProgress, GameCard } from "@/types/medieval"
import { STARTER_CARDS, createDeckFromCards } from "@/data/medieval-cards"

const STORAGE_KEY = "medieval-battle-progress"

export const getPlayerProgress = (): PlayerProgress => {
  if (typeof window === "undefined") {
    return {
      ownedCards: createDeckFromCards(STARTER_CARDS, "player"),
      completedStages: [],
      currentStage: 1,
      gold: 900, // Increased starting gold
      completedDungeons: [],
      bannerProgress: {},
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      // Ensure all new fields exist for existing saves
      if (parsed.gold === undefined) {
        parsed.gold = 900 // Increased default gold for existing saves
      }
      if (parsed.completedDungeons === undefined) {
        parsed.completedDungeons = []
      }
      if (parsed.bannerProgress === undefined) {
        parsed.bannerProgress = {}
      }
      return parsed
    } catch (e) {
      console.error("Failed to parse player progress:", e)
    }
  }

  // Default starting progress
  const defaultProgress: PlayerProgress = {
    ownedCards: createDeckFromCards(STARTER_CARDS, "player"),
    completedStages: [],
    currentStage: 1,
    gold: 900, // Increased starting gold
    completedDungeons: [],
    bannerProgress: {},
  }

  savePlayerProgress(defaultProgress)
  return defaultProgress
}

export const savePlayerProgress = (progress: PlayerProgress) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }
}

export const addCardsToCollection = (newCards: GameCard[]) => {
  const progress = getPlayerProgress()

  // Filter out cards that are already owned (by name)
  const uniqueNewCards = newCards.filter(
    (newCard) => !progress.ownedCards.some((ownedCard) => ownedCard.name === newCard.name),
  )

  if (uniqueNewCards.length > 0) {
    progress.ownedCards = [...progress.ownedCards, ...uniqueNewCards]
    savePlayerProgress(progress)
  }
}

export const addCardToBannerProgress = (bannerId: string, cardName: string) => {
  const progress = getPlayerProgress()
  if (!progress.bannerProgress[bannerId]) {
    progress.bannerProgress[bannerId] = []
  }
  if (!progress.bannerProgress[bannerId].includes(cardName)) {
    progress.bannerProgress[bannerId].push(cardName)
    savePlayerProgress(progress)
  }
}

export const getBannerProgress = (bannerId: string): string[] => {
  const progress = getPlayerProgress()
  return progress.bannerProgress[bannerId] || []
}

export const completeStage = (stageId: string) => {
  const progress = getPlayerProgress()
  if (!progress.completedStages.includes(stageId)) {
    progress.completedStages.push(stageId)
    progress.currentStage = Math.max(progress.currentStage, Number.parseInt(stageId) + 1)
    savePlayerProgress(progress)
  }
}

export const resetProgress = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export const addGold = (amount: number) => {
  const progress = getPlayerProgress()
  progress.gold += amount
  savePlayerProgress(progress)
}

export const spendGold = (amount: number): boolean => {
  const progress = getPlayerProgress()
  if (progress.gold >= amount) {
    progress.gold -= amount
    savePlayerProgress(progress)
    return true
  }
  return false
}

export const completeDungeon = (dungeonId: string, goldReward: number) => {
  const progress = getPlayerProgress()
  if (!progress.completedDungeons.includes(dungeonId)) {
    progress.completedDungeons.push(dungeonId)
    progress.gold += goldReward
    savePlayerProgress(progress)
  }
}
