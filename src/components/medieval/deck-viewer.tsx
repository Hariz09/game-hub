"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Users, Crown, Shield, Star } from "lucide-react"
import type { GameCard, Player } from "@/types/medieval"
import { EnhancedCard } from "./enhanced-card"

interface DeckViewerProps {
  player: Player
  enemy: Player
  isOpen: boolean
  onClose: () => void
}

export const DeckViewer: React.FC<DeckViewerProps> = ({ player, enemy, isOpen, onClose }) => {
  if (!isOpen) return null

  const getTypeStats = (deck: GameCard[]) => {
    const stats = {
      nobility: 0,
      support: 0,
      commoner: 0,
      legendary: 0,
    }

    deck.forEach((card) => {
      stats[card.type]++
    })

    return stats
  }

  const getRarityStats = (deck: GameCard[]) => {
    const stats = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    }

    deck.forEach((card) => {
      stats[card.rarity]++
    })

    return stats
  }

  const getAbilityStats = (deck: GameCard[]) => {
    const stats: Record<string, number> = {}

    deck.forEach((card) => {
      stats[card.abilityType] = (stats[card.abilityType] || 0) + 1
    })

    return stats
  }

  const playerTypeStats = getTypeStats(player.deck)
  const enemyTypeStats = getTypeStats(enemy.deck)
  const playerRarityStats = getRarityStats(player.deck)
  const enemyRarityStats = getRarityStats(enemy.deck)
  const playerAbilityStats = getAbilityStats(player.deck)
  const enemyAbilityStats = getAbilityStats(enemy.deck)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Deck Viewer</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Player Deck */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-800">Player Deck ({player.deck.length} cards)</h3>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span>Nobility: {playerTypeStats.nobility}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Support: {playerTypeStats.support}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>Commoner: {playerTypeStats.commoner}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>Legendary: {playerTypeStats.legendary}</span>
                </div>
              </div>
            </div>

            {/* Player Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Rarity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Common:</span>
                    <Badge variant="outline">{playerRarityStats.common}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rare:</span>
                    <Badge variant="outline">{playerRarityStats.rare}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Legendary:</span>
                    <Badge variant="outline">{playerRarityStats.legendary}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ability Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {Object.entries(playerAbilityStats).map(([ability, count]) => (
                    <div key={ability} className="flex justify-between text-sm">
                      <span className="capitalize">{ability.replace("_", " ")}:</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cost Curve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((cost) => {
                    const count = player.deck.filter((card) => (card.cost || 0) === cost).length
                    return count > 0 ? (
                      <div key={cost} className="flex justify-between text-sm">
                        <span>Cost {cost}:</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ) : null
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Player Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {player.deck.map((card, index) => (
                <div key={`player-deck-${card.id}-${index}`} className="h-[280px]">
                  <EnhancedCard card={card} />
                </div>
              ))}
            </div>
          </div>

          {/* Enemy Deck */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-red-800">Enemy Deck ({enemy.deck.length} cards)</h3>
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span>Nobility: {enemyTypeStats.nobility}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Support: {enemyTypeStats.support}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>Commoner: {enemyTypeStats.commoner}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>Legendary: {enemyTypeStats.legendary}</span>
                </div>
              </div>
            </div>

            {/* Enemy Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Rarity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Common:</span>
                    <Badge variant="outline">{enemyRarityStats.common}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rare:</span>
                    <Badge variant="outline">{enemyRarityStats.rare}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Legendary:</span>
                    <Badge variant="outline">{enemyRarityStats.legendary}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Ability Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {Object.entries(enemyAbilityStats).map(([ability, count]) => (
                    <div key={ability} className="flex justify-between text-sm">
                      <span className="capitalize">{ability.replace("_", " ")}:</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cost Curve</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((cost) => {
                    const count = enemy.deck.filter((card) => (card.cost || 0) === cost).length
                    return count > 0 ? (
                      <div key={cost} className="flex justify-between text-sm">
                        <span>Cost {cost}:</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ) : null
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Enemy Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {enemy.deck.map((card, index) => (
                <div key={`enemy-deck-${card.id}-${index}`} className="h-[280px]">
                  <EnhancedCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
