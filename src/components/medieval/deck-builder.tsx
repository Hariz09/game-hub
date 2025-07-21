"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus, Minus, Search } from "lucide-react"
import type { GameCard } from "@/types/medieval"
import { EnhancedCardComponent } from "./card-component"

interface DeckBuilderProps {
  ownedCards: GameCard[]
  selectedDeck: GameCard[]
  onDeckChange: (deck: GameCard[]) => void
  onClose: () => void
  onConfirm: () => void
  isOpen: boolean
}

export const DeckBuilder: React.FC<DeckBuilderProps> = ({
  ownedCards,
  selectedDeck,
  onDeckChange,
  onClose,
  onConfirm,
  isOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRarity, setFilterRarity] = useState<string>("all")

  if (!isOpen) return null

  const filteredCards = ownedCards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || card.type === filterType
    const matchesRarity = filterRarity === "all" || card.rarity === filterRarity
    return matchesSearch && matchesType && matchesRarity
  })

  const getCardCount = (cardName: string) => {
    return selectedDeck.filter((card) => card.name === cardName).length
  }

  const addCardToDeck = (card: GameCard) => {
    if (selectedDeck.length < 20 && getCardCount(card.name) < 2) {
      onDeckChange([...selectedDeck, card])
    }
  }

  const removeCardFromDeck = (card: GameCard) => {
    const index = selectedDeck.findIndex((c) => c.name === card.name)
    if (index !== -1) {
      const newDeck = [...selectedDeck]
      newDeck.splice(index, 1)
      onDeckChange(newDeck)
    }
  }

  const getDeckStats = () => {
    const stats = {
      total: selectedDeck.length,
      types: { nobility: 0, support: 0, commoner: 0, legendary: 0 },
      rarities: { common: 0, rare: 0, legendary: 0 },
      avgCost: 0,
    }

    selectedDeck.forEach((card) => {
      stats.types[card.type]++
      stats.rarities[card.rarity]++
      stats.avgCost += card.cost || 0
    })

    stats.avgCost = stats.total > 0 ? stats.avgCost / stats.total : 0

    return stats
  }

  const stats = getDeckStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-amber-800">Deck Builder</h2>
          <div className="flex items-center space-x-2">
            <Badge variant={selectedDeck.length >= 15 ? "default" : "destructive"}>
              {selectedDeck.length}/20 cards
            </Badge>
            <Button onClick={onClose} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Card Collection */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4 space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="nobility">Nobility</option>
                  <option value="support">Support</option>
                  <option value="commoner">Commoner</option>
                  <option value="legendary">Legendary</option>
                </select>
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Rarities</option>
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredCards.map((card, index) => {
                const count = getCardCount(card.name)
                const canAdd = selectedDeck.length < 20 && count < 2

                return (
                  <div key={`${card.id}-${index}`} className="relative">
                    <EnhancedCardComponent card={card} />
                    <div className="absolute top-2 right-2 flex items-center space-x-1">
                      {count > 0 && <Badge className="bg-blue-500 text-white text-xs">{count}</Badge>}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-6 h-6 p-0 bg-white"
                        onClick={() => addCardToDeck(card)}
                        disabled={!canAdd}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Deck */}
          <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Current Deck</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Cards:</span>
                  <Badge variant={stats.total >= 15 ? "default" : "destructive"}>{stats.total}/20</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Avg Cost:</span>
                  <span>{stats.avgCost.toFixed(1)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Nobility: {stats.types.nobility}</div>
                  <div>Support: {stats.types.support}</div>
                  <div>Commoner: {stats.types.commoner}</div>
                  <div>Legendary: {stats.types.legendary}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {Array.from(new Set(selectedDeck.map((card) => card.name))).map((cardName) => {
                const card = selectedDeck.find((c) => c.name === cardName)!
                const count = getCardCount(cardName)

                return (
                  <div key={cardName} className="flex items-center space-x-2 p-2 bg-white rounded border">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{card.name}</div>
                      <div className="text-xs text-gray-500">
                        {card.type} • Cost: {card.cost || 0}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-6 h-6 p-0 bg-transparent"
                        onClick={() => removeCardFromDeck(card)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{count}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-6 h-6 p-0 bg-transparent"
                        onClick={() => addCardToDeck(card)}
                        disabled={selectedDeck.length >= 20 || count >= 2}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button onClick={onConfirm} disabled={selectedDeck.length < 15} className="w-full">
                {selectedDeck.length < 15 ? `Need ${15 - selectedDeck.length} more cards` : "Confirm Deck"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
