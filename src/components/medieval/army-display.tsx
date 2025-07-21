"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import type { GameCard, Player } from "@/types/medieval"
import { EnhancedCardComponent } from "./card-component"
import { generateCardKey } from "@/utils/medieval"

interface ArmyDisplayProps {
  player: Player
  selectedCards: GameCard[]
  isPlayer?: boolean
  gamePhase: string
  onRetrieveFromArmy?: (card: GameCard, index: number) => void
}

export const ArmyDisplay: React.FC<ArmyDisplayProps> = ({
  player,
  selectedCards,
  isPlayer = false,
  gamePhase,
  onRetrieveFromArmy,
}) => {
  const bgColor = isPlayer ? "bg-blue-50" : "bg-red-50"
  const textColor = isPlayer ? "text-blue-800" : "text-red-800"
  const emptyTextColor = isPlayer ? "text-blue-500" : "text-red-500"

  return (
    <Card className={bgColor}>
      <CardHeader>
        <CardTitle className={textColor}>
          {isPlayer
            ? `Player's Army (${player.playedCards.length + selectedCards.length}/4)`
            : `Enemy's Army (${player.playedCards.length}/4)`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Currently deployed cards */}
          {player.playedCards.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-blue-700 mb-2">Deployed Units</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {player.playedCards.map((card, index) => (
                  <div key={generateCardKey(card, "deployed", index)} className="space-y-2">
                    <EnhancedCardComponent card={card} />
                    {isPlayer && gamePhase === "playerTurn" && onRetrieveFromArmy && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs bg-transparent"
                        onClick={() => onRetrieveFromArmy(card, index)}
                      >
                        <ArrowUp className="w-3 h-3 mr-1" />
                        Retrieve to Hand
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected cards for deployment (player only) */}
          {isPlayer && selectedCards.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-blue-700 mb-2">Selected for Deployment</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCards.map((card, index) => (
                  <div key={`selected-${card.id}-${index}`} className="space-y-2">
                    <EnhancedCardComponent card={card} isSelected={true} />
                    <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {player.playedCards.length === 0 && (!isPlayer || selectedCards.length === 0) && (
            <div className={`p-4 text-center ${emptyTextColor}`}>
              {isPlayer ? "No units deployed or selected" : "No units deployed"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
