import type { GachaBanner } from "@/types/medieval"
import { GRAND_TOURNAMENT_CARDS } from "./medieval-cards"

export const GACHA_BANNERS: GachaBanner[] = [
  {
    id: "grand_tournament",
    name: "The Grand Tournament of Aethelgard",
    description:
      "Witness a clash of champions as the greatest warriors and mages from across the realm vie for glory and honor in the Royal Arena.",
    theme: "tournament",
    cards: GRAND_TOURNAMENT_CARDS,
    baseRates: {
      legendary: 5, // 5% base rate
      epic: 10, // 10% base rate
      rare: 30, // 30% base rate
      common: 55, // 55% base rate
    },
    isActive: true,
    singlePullCost: 50,
    multiPullCost: 450, // 10% discount for 10 pulls
    totalCards: 20,
    rarityDistribution: {
      legendary: 1,
      epic: 2,
      rare: 6,
      common: 11,
    },
  },
]
