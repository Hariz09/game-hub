"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Eye, HelpCircle, ArrowLeft, Swords } from "lucide-react"
import { useMedievalGame } from "@/hooks/medieval/use-medieval-game"
import { PlayerStatus } from "@/components/medieval/player-status"
import { Battlefield } from "@/components/medieval/battlefield"
import { ArmyDisplay } from "@/components/medieval/army-display"
import { PlayerHand } from "@/components/medieval/player-hand"
import { BattleLog } from "@/components/medieval/battle-log"
import { DeckViewer } from "@/components/medieval/deck-viewer"
import { HelpModal } from "@/components/medieval/help-modal"
import { DeckBuilder } from "@/components/medieval/deck-builder"
import { EnhancedCardComponent } from "@/components/medieval/card-component"
import {
  getAvailableHandCards,
  canPlayCard,
  canPlayAsKing,
  canPlayAsSupport,
  canPlayAsNormal,
} from "@/utils/medieval"
import { STAGE_CONFIGS } from "@/data/stage-configs"
import { getPlayerProgress, addCardsToCollection, completeStage } from "@/utils/player-progress"
import type { StageConfig, PlayerProgress, GameCard } from "@/types/medieval"

export default function StageBattlePage() {
  const router = useRouter()
  const params = useParams()
  const stageId = params.id as string

  const [stage, setStage] = useState<StageConfig | null>(null)
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
    isInitialized,
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
    const foundStage = STAGE_CONFIGS.find((s) => s.id === stageId)
    const playerProgress = getPlayerProgress()

    if (!foundStage) {
      router.push("/medieval-card-battle")
      return
    }

    setStage(foundStage)
    setProgress(playerProgress)

    // Check if stage is unlocked
    const stageIndex = Number.parseInt(stageId) - 1
    const isUnlocked = stageIndex === 0 || playerProgress.completedStages.includes(stageIndex.toString())

    if (!isUnlocked) {
      router.push("/medieval-card-battle")
      return
    }
  }, [stageId, router])

  const handleStartBattle = () => {
    if (selectedDeck.length < 15) {
      alert("You need at least 15 cards in your deck!")
      return
    }

    // Initialize the game with selected deck and enemy deck
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
      deck: stage!.enemyDeck,
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

    // Add stage completion and rewards
    if (progress && stage) {
      completeStage(stage.id)
      addCardsToCollection(stage.rewards)

      // Update local state
      const updatedProgress = getPlayerProgress()
      setProgress(updatedProgress)
    }
  }

  const handleReturnToCampaign = () => {
    router.push("/medieval-card-battle")
  }

  // Game logic functions (same as before)
  const handleCardSelect = (card: any, role: "normal" | "king" | "support") => {
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

  const discardCard = (card: any) => {
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

  const retrieveFromArmy = (card: any, index: number) => {
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

    const playerStrength = calculateStrength(player)
    const enemyStrength = calculateStrength(enemy)

    const playerDamage = Math.max(0, enemyStrength - player.shield)
    const enemyDamage = Math.max(0, playerStrength - enemy.shield)

    newBattleLog.push(`Player army deals ${playerStrength} damage (${enemyDamage} after shield)`)
    newBattleLog.push(`Enemy army deals ${enemyStrength} damage (${playerDamage} after shield)`)

    setPlayer((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - playerDamage),
      shield: Math.max(0, prev.shield - enemyStrength),
    }))

    setEnemy((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - enemyDamage),
      shield: Math.max(0, prev.shield - playerStrength),
    }))

    if (player.support?.abilityType === "heal") {
      const healAmount = player.support.name.includes("5") ? 5 : player.support.name.includes("3") ? 3 : 2
      setPlayer((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
      }))
      newBattleLog.push(`${player.support.name} heals player for ${healAmount} HP`)
    }

    if (enemy.support?.abilityType === "heal") {
      const healAmount = enemy.support.name.includes("5") ? 5 : enemy.support.name.includes("3") ? 3 : 2
      setEnemy((prev) => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount),
      }))
      newBattleLog.push(`${enemy.support.name} heals enemy for ${healAmount} HP`)
    }

    const playerLoyaltyLog = processLoyalty(player, setPlayer, enemy, setEnemy)
    const enemyLoyaltyLog = processLoyalty(enemy, setEnemy, player, setPlayer)

    setBattleLog((prev) => [...prev, ...newBattleLog, ...playerLoyaltyLog, ...enemyLoyaltyLog])

    setTimeout(() => {
      if (player.hp <= 0) {
        setGamePhase("gameOver")
        setBattleLog((prev) => [...prev, "Enemy wins!"])
      } else if (enemy.hp <= 0) {
        setGamePhase("gameOver")
        setBattleLog((prev) => [...prev, "Player wins!"])
        handleBattleWin()
      } else {
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
      }
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

  if (!stage || !progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 flex items-center justify-center">
        <div className="text-amber-800">Loading stage...</div>
      </div>
    )
  }

  // Pre-battle setup screen
  if (!battleStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={handleReturnToCampaign} variant="outline" size="sm" className="mr-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Campaign
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-800">
                Stage {stage.id}: {stage.name}
              </h1>
              <p className="text-amber-700">Prepare for battle against {stage.enemyName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Battle Information</span>
                  <Badge
                    className={
                      stage.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : stage.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {stage.difficulty.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Enemy: {stage.enemyName}</h4>
                  <p className="text-sm text-gray-600">{stage.description}</p>
                </div>

                {stage.rewards.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Victory Rewards:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {stage.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-amber-50 rounded">
                          <span className="text-sm font-medium">{reward.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {reward.type} • {reward.rarity}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deck Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Battle Deck</span>
                  <Badge variant={selectedDeck.length >= 15 ? "default" : "destructive"}>
                    {selectedDeck.length}/20 cards
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button onClick={() => setShowDeckBuilder(true)} className="flex-1">
                    Build Deck
                  </Button>
                  <Button onClick={() => setShowHelp(true)} variant="outline" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>

                {selectedDeck.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Current Deck Preview:</h4>
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                      {selectedDeck.slice(0, 12).map((card, index) => (
                        <div
                          key={`${card.id}-${index}`}
                          className="aspect-[3/4] bg-gray-100 rounded border flex items-center justify-center text-xs text-center p-1"
                        >
                          <div>
                            <div className="font-medium truncate">{card.name}</div>
                            <div className="text-gray-500">{card.cost || 0}</div>
                          </div>
                        </div>
                      ))}
                      {selectedDeck.length > 12 && (
                        <div className="aspect-[3/4] bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-600">
                          +{selectedDeck.length - 12}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button onClick={handleStartBattle} disabled={selectedDeck.length < 15} className="w-full" size="lg">
                  <Swords className="w-4 h-4 mr-2" />
                  {selectedDeck.length < 15 ? `Need ${15 - selectedDeck.length} more cards` : "Start Battle!"}
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

  // Battle screen (same as original but with stage context)
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with stage info */}
        <div className="text-center mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex space-x-2">
              <Button onClick={handleReturnToCampaign} variant="outline" size="sm" className="bg-white/80">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Campaign
              </Button>
              <Button onClick={() => setShowDeckViewer(true)} variant="outline" size="sm" className="bg-white/80">
                <Eye className="w-4 h-4 mr-1" />
                View Decks
              </Button>
              <Button onClick={() => setShowHelp(true)} variant="outline" size="sm" className="bg-white/80">
                <HelpCircle className="w-4 h-4 mr-1" />
                Help
              </Button>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-amber-800 mb-2">
                Stage {stage.id}: {stage.name}
              </h1>
              <p className="text-amber-700">vs {stage.enemyName}</p>
            </div>
            <div className="w-32"></div>
          </div>

          <div className="flex justify-center items-center space-x-4 text-amber-700">
            <span>Turn {turn}</span>
            <Badge variant="outline" className="capitalize">
              {gamePhase.replace(/([A-Z])/g, " $1").toLowerCase()}
            </Badge>
            {gamePhase === "playerTurn" && (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className={`font-bold ${canAffordSelection ? "text-green-600" : "text-red-600"}`}>
                  Resources: {currentResourceCost}/{player.resources}
                </span>
              </div>
            )}
            {gamePhase === "enemySelection" && (
              <div className="flex items-center space-x-2">
                <span className="text-amber-600 font-medium">Enemy is selecting cards...</span>
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
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800">
                {gamePhase === "enemySelection" ? "Enemy is Selecting..." : "Enemy's Selection"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {gamePhase === "enemySelection" && !showEnemySelection ? (
                <div className="text-center py-8">
                  <div className="animate-pulse text-red-600">Enemy is thinking...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                  <div>
                    <h4 className="font-semibold mb-2">King</h4>
                    {enemySelectedCards.kingCard ? (
                      <EnhancedCardComponent card={enemySelectedCards.kingCard} />
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm">None</div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Support</h4>
                    {enemySelectedCards.supportCard ? (
                      <EnhancedCardComponent card={enemySelectedCards.supportCard} />
                    ) : (
                      <div className="p-2 text-center text-gray-500 text-sm">None</div>
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

        {/* Game Over Screen with stage completion */}
        {gamePhase === "gameOver" && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-center text-amber-800">Battle Complete</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-lg font-semibold">{player.hp > 0 ? "Victory!" : "Defeat!"}</div>

              {battleWon && stage.rewards.length > 0 && (
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Rewards Earned:</h3>
                  <div className="space-y-1">
                    {stage.rewards.map((reward, index) => (
                      <div key={index} className="text-sm text-green-700">
                        + {reward.name} ({reward.rarity})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleReturnToCampaign} className="flex-1">
                  Return to Campaign
                </Button>
                {player.hp > 0 && (
                  <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
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
