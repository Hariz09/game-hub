import type { PlayerProgress, GameCard } from "@/types/medieval"
import { STARTER_CARDS, createDeckFromCards } from "@/data/medieval-cards"

const STORAGE_KEY = "medieval-battle-progress"

export const getPlayerProgress = (): PlayerProgress => {
  if (typeof window === "undefined") {
    return {
      ownedCards: createDeckFromCards(STARTER_CARDS, "player"),
      completedStages: [],
      currentStage: 1,
    }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Failed to parse player progress:", e)
    }
  }

  // Default starting progress
  const defaultProgress: PlayerProgress = {
    ownedCards: createDeckFromCards(STARTER_CARDS, "player"),
    completedStages: [],
    currentStage: 1,
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
