"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, ArrowLeft, Swords, HelpCircle, Eye } from "lucide-react"
import { useMedievalGame } from "@/hooks/games/medieval/use-medieval-game"
import { PlayerStatus } from "@/components/medieval/player-status"
import { Battlefield } from "@/components/medieval/battlefield"
import { ArmyDisplay } from "@/components/medieval/army-display"
import { PlayerHand } from "@/components/medieval/player-hand"
import { BattleLog } from "@/components/medieval/battle-log"
import { DeckViewer } from "@/components/medieval/deck-viewer"
import { HelpModal } from "@/components/medieval/help-modal"
import { DeckBuilder } from "@/components/medieval/deck-builder"
import { EnhancedCard } from "@/components/medieval/enhanced-card"
import {
  getAvailableHandCards,
  canPlayCard,
  canPlayAsKing,
  canPlayAsSupport,
  canPlayAsNormal,
} from "@/utils/medieval"
import { DUNGEON_STAGES } from "@/data/dungeon-stages"
import { getPlayerProgress, completeDungeon } from "@/lib/medieval/player-progress"
import type { DungeonStage, PlayerProgress, GameCard } from "@/types/medieval"
import Sidebar from "@/components/sidebar/sidebar"

export default function DungeonBattlePage() {
  const router = useRouter()
  const params = useParams()
  const dungeonId = params.id as string

  const [dungeon, setDungeon] = useState<DungeonStage | null>(null)
  const [progress, setProgress] = useState<PlayerProgress | null>(null)
  const [selectedDeck, setSelectedDeck] = useState<GameCard[]>([])
  const [showDeckBuilder, setShowDeckBuilder] = useState(false)
  const [showDeckViewer, setShowDeckViewer] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [battleStarted, setBattleStarted] = useState(false)
  const [battleWon, setBattleWon] = useState(false)

  const {
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
    playerEnergyBonus,
    setPlayerEnergyBonus,
    enemyEnergyBonus,
    setEnemyEnergyBonus,
    enemySelectedCards,
    setEnemySelectedCards,
    showEnemySelection,
    setShowEnemySelection,
    drawCards,
    calculateResourceCost,
    applyCardAbilities,
    enemyAI,
    processLoyalty,
    calculateStrength,
  } = useMedievalGame()

  useEffect(() => {
    const foundDungeon = DUNGEON_STAGES.find((d) => d.id === dungeonId)
    const playerProgress = getPlayerProgress()

    if (!foundDungeon) {
      router.push("/games/medieval-card-battle/dungeon")
      return
    }

    setDungeon(foundDungeon)
    setProgress(playerProgress)

    // Check if dungeon is unlocked
    const dungeonIndex = DUNGEON_STAGES.findIndex((d) => d.id === dungeonId)
    const isUnlocked =
      dungeonIndex === 0 || playerProgress.completedDungeons.includes(DUNGEON_STAGES[dungeonIndex - 1]?.id)

    if (!isUnlocked) {
      router.push("/games/medieval-card-battle/dungeon")
      return
    }
  }, [dungeonId, router])

  const handleStartBattle = () => {
    if (selectedDeck.length < 10) {
      alert("You need at least 10 unique cards in your deck!")
      return
    }

    // Initialize the game with selected deck and dungeon enemy deck
    setPlayer((prev) => ({
      ...prev,
      deck: selectedDeck,
      hand: [],
      playedCards: [],
      king: null,
      support: null,
      hp: 60,
      maxHp: 60,
      resources: 5,
      shield: 0,
    }))

    setEnemy((prev) => ({
      ...prev,
      deck: dungeon!.enemyDeck,
      hand: [],
      playedCards: [],
      king: null,
      support: null,
      hp: 60,
      maxHp: 60,
      resources: 5,
      shield: 0,
    }))

    setBattleStarted(true)
    setGamePhase("enemySelection")
    setTurn(1)
    setBattleLog([])
    setPlayerEnergyBonus(0)
    setEnemyEnergyBonus(0)

    // Draw initial hands
    setTimeout(() => {
      drawCards(4, "player")
      drawCards(4, "enemy")
    }, 100)
  }

  const handleBattleWin = () => {
    setBattleWon(true)

    // Add dungeon completion and gold reward
    if (progress && dungeon) {
      completeDungeon(dungeon.id, dungeon.goldReward)

      // Update local state
      const updatedProgress = getPlayerProgress()
      setProgress(updatedProgress)
    }
  }

  const handleReturnToDungeon = () => {
    router.push("/games/medieval-card-battle/dungeon")
  }

  // Game logic functions (same as stage battle)
  const handleCardSelect = (card: GameCard, role: "normal" | "king" | "support") => {
    if (!canPlayCard(card, player)) return

    if (role === "king" && canPlayAsKing(card) && !player.king && !selectedKing) {
      setSelectedKing(card)
    } else if (role === "support" && canPlayAsSupport(card) && !player.support && !selectedSupport) {
      setSelectedSupport(card)
    } else if (role === "normal" && canPlayAsNormal(card)) {
      if (selectedCards.includes(card)) {
        setSelectedCards(selectedCards.filter((c) => c.id !== card.id))
      } else if (selectedCards.length + player.playedCards.length < 4) {
        setSelectedCards([...selectedCards, card])
      }
    }
  }

  const discardCard = (card: GameCard) => {
    setPlayer((prev) => ({
      ...prev,
      hand: prev.hand.filter((c) => c.id !== card.id),
      deck: [...prev.deck, card],
    }))
    setBattleLog((prev) => [...prev, `Player discards ${card.name}`])
  }

  const skipTurn = () => {
    if (gamePhase === "playerTurn") {
      setBattleLog((prev) => [...prev, `Player skips their turn`])
      setGamePhase("battle")
    }
  }

  const confirmSelection = () => {
    if (gamePhase === "playerTurn") {
      const totalCost = calculateResourceCost()
      if (totalCost > player.resources) return

      let abilityLog: string[] = []
      let energyBonusIncrease = 0
      ;[...selectedCards, selectedKing, selectedSupport].forEach((card) => {
        if (card && card.abilityType) {
          const log = applyCardAbilities(card, player, setPlayer, enemy, setEnemy)
          abilityLog = [...abilityLog, ...log]
        }

        if (card && card.abilityType === "resource_gain") {
          const resourceAmount = card.name.includes("3") ? 3 : card.name.includes("2") ? 2 : 1
          energyBonusIncrease += resourceAmount
          abilityLog.push(`${card.name} provides +${resourceAmount} resources per turn!`)
        }
      })

      setPlayerEnergyBonus((prev) => prev + energyBonusIncrease)

      setPlayer((prev) => ({
        ...prev,
        playedCards: [...prev.playedCards, ...selectedCards],
        king: selectedKing || prev.king,
        support: selectedSupport || prev.support,
        resources: prev.resources - totalCost,
      }))

      setBattleLog((prev) => [...prev, ...abilityLog])
      setSelectedCards([])
      setSelectedKing(null)
      setSelectedSupport(null)
      setGamePhase("battle")
    }
  }

  const retrieveKing = () => {
    if (!player.king) return

    const kingCard = player.king

    setPlayer((prev) => {
      const filteredHand = prev.hand.filter((handCard) => handCard.id !== kingCard.id)

      return {
        ...prev,
        king: null,
        hand: [...filteredHand, kingCard],
      }
    })

    setBattleLog((prev) => [...prev, `Player retrieves King ${kingCard.name} back to hand`])
  }

  const retrieveSupport = () => {
    if (!player.support) return

    const supportCard = player.support

    setPlayer((prev) => {
      const filteredHand = prev.hand.filter((handCard) => handCard.id !== supportCard.id)

      return {
        ...prev,
        support: null,
        hand: [...filteredHand, supportCard],
      }
    })

    setBattleLog((prev) => [...prev, `Player retrieves Support ${supportCard.name} back to hand`])
  }

  const retrieveFromArmy = (card: GameCard, index: number) => {
    setPlayer((prev) => ({
      ...prev,
      playedCards: prev.playedCards.filter((_, i) => i !== index),
      hand: [...prev.hand, card],
    }))

    setBattleLog((prev) => [...prev, `Player retrieves ${card.name} from army back to hand`])
  }

  const processEnemyTurn = () => {
    const enemySelections = enemyAI()
    setEnemySelectedCards({
      normalCards: enemySelections.selectedNormalCards,
      kingCard: enemySelections.selectedKingCard,
      supportCard: enemySelections.selectedSupportCard,
    })
    setShowEnemySelection(true)

    setBattleLog((prev) => [
      ...prev,
      `Turn ${turn}: Enemy selects ${enemySelections.selectedNormalCards.length + (enemySelections.selectedKingCard ? 1 : 0) + (enemySelections.selectedSupportCard ? 1 : 0)} cards`,
    ])

    let energyBonusIncrease = 0
    ;[
      ...enemySelections.selectedNormalCards,
      enemySelections.selectedKingCard,
      enemySelections.selectedSupportCard,
    ].forEach((card) => {
      if (card && card.abilityType) {
        applyCardAbilities(card, enemy, setEnemy, player, setPlayer)
      }

      if (card && card.abilityType === "resource_gain") {
        const resourceAmount = card.name.includes("3") ? 3 : card.name.includes("2") ? 2 : 1
        energyBonusIncrease += resourceAmount
      }
    })

    setEnemyEnergyBonus((prev) => prev + energyBonusIncrease)

    setEnemy((prev) => ({
      ...prev,
      playedCards: [...prev.playedCards, ...enemySelections.selectedNormalCards],
      king: enemySelections.selectedKingCard || prev.king,
      support: enemySelections.selectedSupportCard || prev.support,
      resources: enemySelections.remainingResources,
    }))

    setTimeout(() => {
      setShowEnemySelection(false)
      setGamePhase("playerTurn")
    }, 2000)
  }

  const processBattle = () => {
    const newBattleLog: string[] = []

    // 1. FIRST: Trigger abilities (healing, boosts, etc.)
    newBattleLog.push(`--- Turn ${turn}: Abilities Phase ---`)

    // Player support abilities
    if (player.support?.abilityType === "heal") {
      const healAmount = player.support.name.includes("5") ? 5 : player.support.name.includes("3") ? 3 : 2
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
      }))
      newBattleLog.push(`${player.support.name} heals player for ${healAmount} HP`)
    }

    // Enemy support abilities
    if (enemy.support?.abilityType === "heal") {
      const healAmount = enemy.support.name.includes("5") ? 5 : enemy.support.name.includes("3") ? 3 : 2
      setEnemy((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
      }))
      newBattleLog.push(`${enemy.support.name} heals enemy for ${healAmount} HP`)
    }

    // 2. Calculate strengths after abilities have been applied
    const playerStrength = calculateStrength(player)
    const enemyStrength = calculateStrength(enemy)

    // 3. Player attacks enemy
    newBattleLog.push(`--- Attack Phase ---`)
    newBattleLog.push(`Player army deals ${playerStrength} damage to enemy`)

    const enemyDamage = Math.max(0, playerStrength - enemy.shield)
    if (enemy.shield > 0) {
      newBattleLog.push(`Enemy shield blocks ${Math.min(playerStrength, enemy.shield)} damage`)
    }
    newBattleLog.push(`Enemy takes ${enemyDamage} damage`)

    setEnemy((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - enemyDamage),
      shield: Math.max(0, prev.shield - playerStrength),
    }))

    // 4. Check if enemy is defeated
    if (enemy.hp - enemyDamage <= 0) {
      newBattleLog.push(`Enemy has been defeated!`)
      setBattleLog((prev) => [...prev, ...newBattleLog])

      setTimeout(() => {
        setGamePhase("gameOver")
        setBattleLog((prev) => [...prev, "Player wins!"])
        handleBattleWin()
      }, 1000)
      return
    }

    // 5. Enemy attacks player
    newBattleLog.push(`Enemy army deals ${enemyStrength} damage to player`)

    const playerDamage = Math.max(0, enemyStrength - player.shield)
    if (player.shield > 0) {
      newBattleLog.push(`Player shield blocks ${Math.min(enemyStrength, player.shield)} damage`)
    }
    newBattleLog.push(`Player takes ${playerDamage} damage`)

    setPlayer((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - playerDamage),
      shield: Math.max(0, prev.shield - enemyStrength),
    }))

    // 6. Check if player is defeated
    if (player.hp - playerDamage <= 0) {
      newBattleLog.push(`Player has been defeated!`)
      setBattleLog((prev) => [...prev, ...newBattleLog])

      setTimeout(() => {
        setGamePhase("gameOver")
        setBattleLog((prev) => [...prev, "Enemy wins!"])
      }, 1000)
      return
    }

    // 7. Process loyalty
    newBattleLog.push(`--- Loyalty Phase ---`)
    const playerLoyaltyLog = processLoyalty(player, setPlayer, enemy, setEnemy)
    const enemyLoyaltyLog = processLoyalty(enemy, setEnemy, player, setPlayer)

    setBattleLog((prev) => [...prev, ...newBattleLog, ...playerLoyaltyLog, ...enemyLoyaltyLog])

    // 8. Prepare for next turn
    setTimeout(() => {
      setTurn((prev) => prev + 1)

      setPlayer((prev) => ({
        ...prev,
        resources: Math.min(10, prev.resources + 3 + playerEnergyBonus),
      }))
      setEnemy((prev) => ({
        ...prev,
        resources: Math.min(10, prev.resources + 3 + enemyEnergyBonus),
      }))

      const playerHandSize = getAvailableHandCards(player).length
      const enemyHandSize = getAvailableHandCards(enemy).length

      if (playerHandSize < 5) drawCards(Math.min(2, 5 - playerHandSize), "player")
      if (enemyHandSize < 5) drawCards(Math.min(2, 5 - enemyHandSize), "enemy")

      setGamePhase("enemySelection")
    }, 3000)
  }

  useEffect(() => {
    if (battleStarted && gamePhase === "enemySelection") {
      setTimeout(processEnemyTurn, 1000)
    } else if (battleStarted && gamePhase === "battle") {
      setTimeout(processBattle, 1000)
    }
  }, [gamePhase, battleStarted])

  const currentResourceCost = calculateResourceCost()
  const canAffordSelection = currentResourceCost <= player.resources

  if (!dungeon || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4 flex items-center justify-center">
        <div className="text-gray-300">Loading dungeon...</div>
      </div>
    )
  }

  // Pre-battle setup screen
  if (!battleStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4">
        <Sidebar />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              onClick={handleReturnToDungeon}
              variant="outline"
              size="sm"
              className="mr-4 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dungeon
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">{dungeon.name}</h1>
              <p className="text-gray-300">Prepare to explore the depths</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dungeon Info */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-100">
                  <span>Dungeon Information</span>
                  <Badge
                    className={
                      dungeon.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : dungeon.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {dungeon.difficulty.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-300">{dungeon.description}</p>
                </div>

                <div className="bg-amber-900/30 p-4 rounded border border-amber-600">
                  <h4 className="font-semibold mb-2 text-amber-300 flex items-center">
                    <Coins className="w-4 h-4 mr-2" />
                    Gold Reward: {dungeon.goldReward}
                  </h4>
                  <p className="text-amber-200 text-sm">
                    Complete this dungeon to earn gold that can be spent in the Gacha system to obtain new cards.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Deck Selection */}
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-gray-100">
                  <span>Your Battle Deck</span>
                  <Badge variant={selectedDeck.length >= 15 ? "default" : "destructive"}>
                    {selectedDeck.length}/20 cards
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={() => setShowDeckBuilder(true)} className="flex-1 bg-amber-600 hover:bg-amber-700">
                    Build Deck
                  </Button>
                  <Button
                    onClick={() => setShowHelp(true)}
                    variant="outline"
                    size="sm"
                    className="bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>

                {selectedDeck.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-200">Current Deck Preview:</h4>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {selectedDeck.slice(0, 12).map((card, index) => (
                        <div
                          key={`${card.id}-${index}`}
                          className="aspect-[3/4] bg-gray-600 rounded border border-gray-500 flex items-center justify-center text-xs text-center p-1"
                        >
                          <div>
                            <div className="font-medium truncate text-gray-200">{card.name}</div>
                            <div className="text-gray-400">{card.cost || 0}</div>
                          </div>
                        </div>
                      ))}
                      {selectedDeck.length > 12 && (
                        <div className="aspect-[3/4] bg-gray-600 rounded border border-gray-500 flex items-center justify-center text-xs text-gray-400">
                          +{selectedDeck.length - 12}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleStartBattle}
                  disabled={selectedDeck.length < 10}
                  className="w-full bg-red-600 hover:bg-red-700"
                  size="lg"
                >
                  <Swords className="w-4 h-4 mr-2" />
                  {selectedDeck.length < 10 ? `Need ${10 - selectedDeck.length} more unique cards` : "Enter Dungeon!"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Modals */}
          <DeckBuilder
            ownedCards={progress.ownedCards}
            selectedDeck={selectedDeck}
            onDeckChange={setSelectedDeck}
            onClose={() => setShowDeckBuilder(false)}
            onConfirm={() => setShowDeckBuilder(false)}
            isOpen={showDeckBuilder}
          />
          <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </div>
      </div>
    )
  }

  // Battle screen (same as stage battle but with dungeon theming)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <Sidebar />
        {/* Header with dungeon info */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex space-x-2">
              <Button
                onClick={handleReturnToDungeon}
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Dungeon
              </Button>
              <Button
                onClick={() => setShowDeckViewer(true)}
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Decks
              </Button>
              <Button
                onClick={() => setShowHelp(true)}
                variant="outline"
                size="sm"
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-100 mb-2">{dungeon.name}</h1>
              <p className="text-gray-300">Dungeon Exploration</p>
            </div>
            <div className="w-32"></div>
          </div>

          <div className="flex justify-center items-center space-x-4 text-gray-300">
            <span>Turn {turn}</span>
            <Badge variant="outline" className="capitalize bg-gray-700 border-gray-600 text-gray-300">
              {gamePhase.replace(/([A-Z])/g, " $1").toLowerCase()}
            </Badge>
            {gamePhase === "playerTurn" && (
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className={`font-bold ${canAffordSelection ? "text-green-400" : "text-red-400"}`}>
                  Resources: {currentResourceCost}/{player.resources}
                </span>
              </div>
            )}
            {gamePhase === "enemySelection" && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 font-medium">Enemy is selecting cards...</span>
              </div>
            )}
          </div>
        </div>

        {/* Player and Enemy Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PlayerStatus player={player} energyBonus={playerEnergyBonus} isPlayer={true} />
          <PlayerStatus player={enemy} energyBonus={enemyEnergyBonus} isPlayer={false} />
        </div>

        {/* Battlefield - Kings and Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Battlefield
            player={player}
            selectedKing={selectedKing}
            selectedSupport={selectedSupport}
            isPlayer={true}
            gamePhase={gamePhase}
            onRetrieveKing={retrieveKing}
            onRetrieveSupport={retrieveSupport}
            onDeselectKing={() => setSelectedKing(null)}
            onDeselectSupport={() => setSelectedSupport(null)}
          />
          <Battlefield
            player={enemy}
            selectedKing={null}
            selectedSupport={null}
            isPlayer={false}
            gamePhase={gamePhase}
          />
        </div>

        {/* Armies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ArmyDisplay
            player={player}
            selectedCards={selectedCards}
            isPlayer={true}
            gamePhase={gamePhase}
            onRetrieveFromArmy={retrieveFromArmy}
          />
          <ArmyDisplay player={enemy} selectedCards={[]} isPlayer={false} gamePhase={gamePhase} />
        </div>

        {/* Enemy Selection Display */}
        {(showEnemySelection || gamePhase === "enemySelection") && (
          <Card className="mb-6 bg-red-900/30 border-red-600">
            <CardHeader>
              <CardTitle className="text-red-300">
                {gamePhase === "enemySelection" ? "Enemy is Selecting..." : "Enemy's Selection"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gamePhase === "enemySelection" && !showEnemySelection ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-red-400">Enemy is thinking...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-200">Normal Cards</h4>
                    <div className="space-y-2">
                      {enemySelectedCards.normalCards.map((card, index) => (
                        <div key={`enemy-selected-${card.id}-${index}`} className="h-[240px]">
                          <EnhancedCard key={`enemy-selected-${card.id}-${index}`} card={card} size="small" />
                        </div>
                      ))}
                      {enemySelectedCards.normalCards.length === 0 && (
                        <div className="p-2 text-center text-gray-500 text-sm">None</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-200">King</h4>
                    {enemySelectedCards.kingCard ? (
                      <div className="h-[240px]">
                        <EnhancedCard card={enemySelectedCards.kingCard} size="small" />
                      </div>
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm h-[240px] flex items-center justify-center">
                        None
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-gray-200">Support</h4>
                    {enemySelectedCards.supportCard ? (
                      <div className="h-[240px]">
                        <EnhancedCard card={enemySelectedCards.supportCard} size="small" />
                      </div>
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm h-[240px] flex items-center justify-center">
                        None
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Player Hand and Actions */}
        {gamePhase === "playerTurn" && (
          <div className="space-y-6">
            <PlayerHand
              player={player}
              selectedCards={selectedCards}
              selectedKing={selectedKing}
              selectedSupport={selectedSupport}
              canAffordSelection={canAffordSelection}
              onCardSelect={handleCardSelect}
              onDiscardCard={discardCard}
              onSkipTurn={skipTurn}
              onConfirmSelection={confirmSelection}
            />
          </div>
        )}

        {/* Game Over Screen with dungeon completion */}
        {gamePhase === "gameOver" && (
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader>
              <CardTitle className="text-center text-gray-100">Dungeon Complete</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-lg font-semibold text-gray-200">{player.hp > 0 ? "Victory!" : "Defeat!"}</div>

              {battleWon && (
                <div className="bg-amber-900/30 p-4 rounded border border-amber-600">
                  <h3 className="font-semibold text-amber-300 mb-2 flex items-center justify-center">
                    <Coins className="w-5 h-5 mr-2" />
                    Gold Earned: {dungeon.goldReward}
                  </h3>
                  <p className="text-amber-200 text-sm">Use your gold in the Gacha system to obtain new cards!</p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleReturnToDungeon} className="flex-1 bg-gray-600 hover:bg-gray-700">
                  Return to Dungeon
                </Button>
                {player.hp > 0 && (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Play Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Battle Log */}
        <BattleLog battleLog={battleLog} />

        {/* Modals */}
        <DeckViewer player={player} enemy={enemy} isOpen={showDeckViewer} onClose={() => setShowDeckViewer(false)} />
        <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      </div>
    </div>
  )
}
