"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Player, GamePhase, GameCard, EnemySelection } from "@/types/medieval"
import { createEnhancedDeck } from "@/data/medieval-cards"
import { getAvailableHandCards, canPlayCard, calculateStrength } from "@/utils/medieval"

export const useMedievalGame = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>("enemySelection")
  const [player, setPlayer] = useState<Player>({
    id: "player",
    name: "Player",
    hp: 60,
    maxHp: 60,
    resources: 5,
    deck: [],
    hand: [],
    playedCards: [],
    king: null,
    support: null,
    shield: 0,
    effects: [],
  })

  const [enemy, setEnemy] = useState<Player>({
    id: "enemy",
    name: "Enemy",
    hp: 60,
    maxHp: 60,
    resources: 5,
    deck: [],
    hand: [],
    playedCards: [],
    king: null,
    support: null,
    shield: 0,
    effects: [],
  })

  const [selectedCards, setSelectedCards] = useState<GameCard[]>([])
  const [selectedKing, setSelectedKing] = useState<GameCard | null>(null)
  const [selectedSupport, setSelectedSupport] = useState<GameCard | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [turn, setTurn] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  const [playerEnergyBonus, setPlayerEnergyBonus] = useState(0)
  const [enemyEnergyBonus, setEnemyEnergyBonus] = useState(0)
  const [enemySelectedCards, setEnemySelectedCards] = useState<EnemySelection>({
    normalCards: [],
    kingCard: null,
    supportCard: null,
  })
  const [showEnemySelection, setShowEnemySelection] = useState(false)

  // Initialize game
  useEffect(() => {
    if (!isInitialized) {
      const playerDeck = createEnhancedDeck("player")
      const enemyDeck = createEnhancedDeck("enemy")

      setPlayer((prev) => ({ ...prev, deck: playerDeck }))
      setEnemy((prev) => ({ ...prev, deck: enemyDeck }))
      setIsInitialized(true)
    }
  }, [isInitialized])

  useEffect(() => {
    if (isInitialized && player.deck.length > 0 && enemy.deck.length > 0 && player.hand.length === 0) {
      drawCards(4, "player")
      drawCards(4, "enemy")
    }
  }, [isInitialized, player.deck, enemy.deck, player.hand.length])

  const drawCards = (count: number, playerId: string) => {
    const targetPlayer = playerId === "player" ? player : enemy
    const setTargetPlayer = playerId === "player" ? setPlayer : setEnemy

    const availableCards = targetPlayer.deck.filter(
      (card) => !targetPlayer.hand.some((handCard) => handCard.id === card.id),
    )

    const cardsToDraw = availableCards.slice(0, count)

    setTargetPlayer((prev) => ({
      ...prev,
      hand: [...prev.hand, ...cardsToDraw],
    }))
  }

  const calculateResourceCost = () => {
    let totalCost = 0
    selectedCards.forEach((card) => (totalCost += card.cost || 0))
    if (selectedKing) totalCost += selectedKing.cost || 0
    if (selectedSupport) totalCost += selectedSupport.cost || 0
    return totalCost
  }

  const applyCardAbilities = (
    card: GameCard,
    caster: Player,
    setCaster: React.Dispatch<React.SetStateAction<Player>>,
    target: Player,
    setTarget: React.Dispatch<React.SetStateAction<Player>>,
  ) => {
    const newLog: string[] = []

    switch (card.abilityType) {
      case "heal":
        const healAmount = card.name.includes("5") ? 5 : card.name.includes("3") ? 3 : 2
        setCaster((prev) => ({
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + healAmount),
        }))
        newLog.push(`${card.name} heals ${caster.name} for ${healAmount} HP`)
        break

      case "direct_damage":
        const damageAmount = card.name.includes("5") ? 5 : card.name.includes("4") ? 4 : 3
        setTarget((prev) => ({
          ...prev,
          hp: Math.max(0, prev.hp - Math.max(0, damageAmount - prev.shield)),
          shield: Math.max(0, prev.shield - damageAmount),
        }))
        newLog.push(`${card.name} deals ${damageAmount} direct damage to ${target.name}`)
        break

      case "shield":
        const shieldAmount = card.name.includes("3") ? 3 : card.name.includes("2") ? 2 : 1
        setCaster((prev) => ({
          ...prev,
          shield: prev.shield + shieldAmount,
        }))
        newLog.push(`${card.name} grants ${shieldAmount} shield to ${caster.name}`)
        break

      case "resource_gain":
        const resourceAmount = card.name.includes("3") ? 3 : card.name.includes("2") ? 2 : 1
        setCaster((prev) => ({
          ...prev,
          resources: Math.min(10, prev.resources + resourceAmount),
        }))
        newLog.push(`${card.name} grants ${resourceAmount} resources to ${caster.name}`)
        break

      case "assassinate":
        if (target.playedCards.length > 0) {
          const weakestCard = target.playedCards.reduce((weakest, current) =>
            current.strength < weakest.strength ? current : weakest,
          )
          setTarget((prev) => ({
            ...prev,
            playedCards: prev.playedCards.filter((c) => c.id !== weakestCard.id),
          }))
          newLog.push(`${card.name} assassinates ${weakestCard.name}!`)
        }
        break
    }

    return newLog
  }

  const enemyAI = () => {
    const availableCards = getAvailableHandCards(enemy).filter((card) => canPlayCard(card, enemy))
    const sortedCards = availableCards.sort((a, b) => b.strength + (b.cost || 0) - (a.strength + (a.cost || 0)))

    let remainingResources = enemy.resources
    const selectedNormalCards: GameCard[] = []
    let selectedKingCard: GameCard | null = null
    let selectedSupportCard: GameCard | null = null

    for (const card of sortedCards) {
      const cost = card.cost || 0
      if (cost <= remainingResources) {
        if (!selectedKingCard && (card.type === "nobility" || card.type === "legendary") && !enemy.king) {
          selectedKingCard = card
          remainingResources -= cost
        } else if (!selectedSupportCard && (card.type === "support" || card.type === "legendary") && !enemy.support) {
          selectedSupportCard = card
          remainingResources -= cost
        } else if (card.type !== "support" && selectedNormalCards.length < 4) {
          selectedNormalCards.push(card)
          remainingResources -= cost
        }
      }
    }

    return { selectedNormalCards, selectedKingCard, selectedSupportCard, remainingResources }
  }

  const processLoyalty = (
    currentPlayer: Player,
    setCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>,
    opponent: Player,
    setOpponent: React.Dispatch<React.SetStateAction<Player>>,
  ) => {
    const newLog: string[] = []
    const updatedPlayedCards: GameCard[] = []
    const cardsToTransfer: GameCard[] = []

    // Process loyalty for played cards (not kings)
    currentPlayer.playedCards.forEach((card) => {
      const newLoyalty = card.loyalty - 1
      if (newLoyalty <= 0) {
        cardsToTransfer.push(card)
        newLog.push(`${card.name} betrays ${currentPlayer.name}!`)
      } else {
        updatedPlayedCards.push({ ...card, loyalty: newLoyalty })
      }
    })

    // Kings don't lose loyalty - they remain loyal
    const updatedKing = currentPlayer.king
    if (updatedKing) {
      newLog.push(`King ${updatedKing.name} remains loyal to ${currentPlayer.name}`)
    }

    // Support cards lose loyalty normally
    let updatedSupport = currentPlayer.support
    if (updatedSupport) {
      const newLoyalty = updatedSupport.loyalty - 1
      if (newLoyalty <= 0) {
        cardsToTransfer.push(updatedSupport)
        newLog.push(`Support ${updatedSupport.name} betrays ${currentPlayer.name}!`)
        updatedSupport = null
      } else {
        updatedSupport = { ...updatedSupport, loyalty: newLoyalty }
      }
    }

    setCurrentPlayer((prev) => ({
      ...prev,
      playedCards: updatedPlayedCards,
      king: updatedKing,
      support: updatedSupport,
    }))

    if (cardsToTransfer.length > 0) {
      setOpponent((prev) => ({
        ...prev,
        deck: [...prev.deck, ...cardsToTransfer],
      }))
    }

    return newLog
  }

  return {
    // State
    gamePhase,
    setGamePhase,
    player,
    setPlayer,
    enemy,
    setEnemy,
    selectedCards,
    setSelectedCards,
    selectedKing,
    setSelectedKing,
    selectedSupport,
    setSelectedSupport,
    battleLog,
    setBattleLog,
    turn,
    setTurn,
    isInitialized,
    playerEnergyBonus,
    setPlayerEnergyBonus,
    enemyEnergyBonus,
    setEnemyEnergyBonus,
    enemySelectedCards,
    setEnemySelectedCards,
    showEnemySelection,
    setShowEnemySelection,

    // Functions
    drawCards,
    calculateResourceCost,
    applyCardAbilities,
    enemyAI,
    processLoyalty,
    calculateStrength,
  }
}
