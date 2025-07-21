"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Shield, Trash2, SkipForward } from "lucide-react"
import type { GameCard, Player } from "@/types/medieval"
import { EnhancedCardComponent } from "./card-component"
import { getAvailableHandCards, canPlayCard, canPlayAsKing, canPlayAsSupport } from "@/utils/medieval"

interface PlayerHandProps {
  player: Player
  selectedCards: GameCard[]
  selectedKing: GameCard | null
  selectedSupport: GameCard | null
  canAffordSelection: boolean
  onCardSelect: (card: GameCard, role: "normal" | "king" | "support") => void
  onDiscardCard: (card: GameCard) => void
  onSkipTurn: () => void
  onConfirmSelection: () => void
}

export const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  selectedCards,
  selectedKing,
  selectedSupport,
  canAffordSelection,
  onCardSelect,
  onDiscardCard,
  onSkipTurn,
  onConfirmSelection,
}) => {
  const availableHandCards = getAvailableHandCards(player)
  const hasSelection = selectedCards.length > 0 || selectedKing || selectedSupport

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Your Hand ({availableHandCards.length})</span>
          <div className="flex space-x-2">
            <Button onClick={onSkipTurn} variant="outline" size="sm">
              <SkipForward className="w-4 h-4 mr-1" />
              Skip Turn
            </Button>
            <Button onClick={onConfirmSelection} disabled={!canAffordSelection || !hasSelection} size="sm">
              Confirm Selection
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {availableHandCards.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No cards in hand</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {availableHandCards.map((card) => {
              const isSelected = selectedCards.includes(card) || selectedKing === card || selectedSupport === card
              const canAfford = canPlayCard(card, player)

              return (
                <div key={card.id} className="space-y-2">
                  <EnhancedCardComponent
                    card={card}
                    isSelected={isSelected}
                    canAfford={canAfford}
                    onClick={() => onCardSelect(card, "normal")}
                  />
                  <div className="flex space-x-1">
                    {canPlayAsKing(card) && !player.king && !selectedKing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 bg-transparent"
                        onClick={() => onCardSelect(card, "king")}
                        disabled={!canAfford}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        King
                      </Button>
                    )}
                    {canPlayAsSupport(card) && !player.support && !selectedSupport && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 bg-transparent"
                        onClick={() => onCardSelect(card, "support")}
                        disabled={!canAfford}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Support
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-2 py-1 bg-transparent"
                      onClick={() => onDiscardCard(card)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
