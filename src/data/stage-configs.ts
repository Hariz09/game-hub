import type { StageConfig } from "@/types/medieval"
import { ALL_CARDS, createDeckFromCards } from "./medieval-cards"

export const STAGE_CONFIGS: StageConfig[] = [
  {
    id: "1",
    name: "The Bandit Leader",
    description:
      "Face off against a ruthless bandit leader who has been terrorizing local villages. A good introduction to combat.",
    enemyName: "Gareth the Ruthless",
    difficulty: "easy",
    unlocked: true,
    completed: false,
    enemyDeck: createDeckFromCards(
      [
        // Weaker deck for first stage
        ALL_CARDS.find((c) => c.name === "Foot Soldier")!,
        ALL_CARDS.find((c) => c.name === "Foot Soldier")!,
        ALL_CARDS.find((c) => c.name === "Militia")!,
        ALL_CARDS.find((c) => c.name === "Militia")!,
        ALL_CARDS.find((c) => c.name === "Peasant Levy")!,
        ALL_CARDS.find((c) => c.name === "Peasant Levy")!,
        ALL_CARDS.find((c) => c.name === "Village Blacksmith")!,
        ALL_CARDS.find((c) => c.name === "Crossbow Squad")!,
        ALL_CARDS.find((c) => c.name === "Heavy Cavalry")!,
        ALL_CARDS.find((c) => c.name === "Royal Guard")!,
        ALL_CARDS.find((c) => c.name === "Battle Strategist")!,
        ALL_CARDS.find((c) => c.name === "Earl of Warwick")!,
        ALL_CARDS.find((c) => c.name === "Baron of York")!,
        ALL_CARDS.find((c) => c.name === "Castle Priest")!,
        ALL_CARDS.find((c) => c.name === "Royal Merchant")!,
      ],
      "enemy",
    ),
    rewards: createDeckFromCards(
      [ALL_CARDS.find((c) => c.name === "Elite Archer")!, ALL_CARDS.find((c) => c.name === "Royal Healer")!],
      "reward",
    ),
  },
  {
    id: "2",
    name: "The Rival Noble",
    description:
      "Challenge a rival noble house in a battle of honor and strategy. They have better trained forces and support.",
    enemyName: "Lord Blackwood",
    difficulty: "medium",
    unlocked: false,
    completed: false,
    enemyDeck: createDeckFromCards(
      [
        // Medium difficulty deck
        ALL_CARDS.find((c) => c.name === "Knight Templar")!,
        ALL_CARDS.find((c) => c.name === "Elite Archer")!,
        ALL_CARDS.find((c) => c.name === "Heavy Cavalry")!,
        ALL_CARDS.find((c) => c.name === "Heavy Cavalry")!,
        ALL_CARDS.find((c) => c.name === "Crossbow Squad")!,
        ALL_CARDS.find((c) => c.name === "Foot Soldier")!,
        ALL_CARDS.find((c) => c.name === "Royal Guard")!,
        ALL_CARDS.find((c) => c.name === "Court Wizard")!,
        ALL_CARDS.find((c) => c.name === "Royal Healer")!,
        ALL_CARDS.find((c) => c.name === "Duke of Lancaster")!,
        ALL_CARDS.find((c) => c.name === "Earl of Warwick")!,
        ALL_CARDS.find((c) => c.name === "Prince of Wales")!,
        ALL_CARDS.find((c) => c.name === "Royal Treasurer")!,
        ALL_CARDS.find((c) => c.name === "Court Assassin")!,
        ALL_CARDS.find((c) => c.name === "Battle Cleric")!,
      ],
      "enemy",
    ),
    rewards: createDeckFromCards(
      [
        ALL_CARDS.find((c) => c.name === "Queen Guinevere")!,
        ALL_CARDS.find((c) => c.name === "Court Wizard")!,
        ALL_CARDS.find((c) => c.name === "Knight Templar")!,
      ],
      "reward",
    ),
  },
  {
    id: "3",
    name: "The Dark Sorcerer",
    description:
      "Face the ultimate challenge against a powerful dark sorcerer with legendary creatures and devastating magic.",
    enemyName: "Mordred the Fallen",
    difficulty: "hard",
    unlocked: false,
    completed: false,
    enemyDeck: createDeckFromCards(
      [
        // Hard difficulty deck with legendaries
        ALL_CARDS.find((c) => c.name === "The Black Knight")!,
        ALL_CARDS.find((c) => c.name === "Morgan le Fay")!,
        ALL_CARDS.find((c) => c.name === "Knight Templar")!,
        ALL_CARDS.find((c) => c.name === "Knight Templar")!,
        ALL_CARDS.find((c) => c.name === "Elite Archer")!,
        ALL_CARDS.find((c) => c.name === "Elite Archer")!,
        ALL_CARDS.find((c) => c.name === "Court Assassin")!,
        ALL_CARDS.find((c) => c.name === "Siege Engineer")!,
        ALL_CARDS.find((c) => c.name === "War Engineer")!,
        ALL_CARDS.find((c) => c.name === "Court Wizard")!,
        ALL_CARDS.find((c) => c.name === "Royal Healer")!,
        ALL_CARDS.find((c) => c.name === "Queen Guinevere")!,
        ALL_CARDS.find((c) => c.name === "Prince of Wales")!,
        ALL_CARDS.find((c) => c.name === "Master Economist")!,
        ALL_CARDS.find((c) => c.name === "Royal Diplomat")!,
      ],
      "enemy",
    ),
    rewards: createDeckFromCards(
      [
        ALL_CARDS.find((c) => c.name === "King Arthur")!,
        ALL_CARDS.find((c) => c.name === "Merlin the Wise")!,
        ALL_CARDS.find((c) => c.name === "Lancelot du Lac")!,
      ],
      "reward",
    ),
  },
]
