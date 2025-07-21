"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Minus, Search } from "lucide-react"
import type { GameCard } from "@/types/medieval"
import { EnhancedCard } from "./enhanced-card"

interface DeckBuilderProps {
  ownedCards: GameCard[]
  selectedDeck: GameCard[]
  onDeckChange: (deck: GameCard[]) => void
  onClose: () => void
  onConfirm: () => void
  isOpen: boolean
}

// Update deck builder to prevent duplicates and limit deck size
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

  const isCardInDeck = (cardName: string) => {
    return selectedDeck.some((card) => card.name === cardName)
  }

  const addCardToDeck = (card: GameCard) => {
    // Only allow unique cards and max 15 cards
    if (selectedDeck.length < 15 && !isCardInDeck(card.name)) {
      onDeckChange([...selectedDeck, card])
    }
  }

  const removeCardFromDeck = (card: GameCard) => {
    const newDeck = selectedDeck.filter((c) => c.name !== card.name)
    onDeckChange(newDeck)
  }

  const getDeckStats = () => {
    const stats = {
      total: selectedDeck.length,
      types: { nobility: 0, support: 0, commoner: 0, legendary: 0 },
      rarities: { common: 0, rare: 0, epic:0, legendary: 0 },
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

  const autoSelectCards = () => {
    // Sort cards by rarity (legendary > rare > common) and then by type
    const sortedCards = [...ownedCards].sort((a, b) => {
      // First sort by rarity
      const rarityOrder = { legendary: 4, epic:3, rare: 2, common: 1 }
      const rarityDiff = rarityOrder[b.rarity] - rarityOrder[a.rarity]

      if (rarityDiff !== 0) return rarityDiff

      // If same rarity, sort by type
      const typeOrder = { legendary: 4, nobility: 3, support: 2, commoner: 1 }
      return typeOrder[b.type] - typeOrder[a.type]
    })

    // Filter out cards already in deck
    const availableCards = sortedCards.filter((card) => !isCardInDeck(card.name))

    // Select cards up to the maximum (15)
    const cardsToAdd = availableCards.slice(0, 15 - selectedDeck.length)

    if (cardsToAdd.length > 0) {
      onDeckChange([...selectedDeck, ...cardsToAdd])
    }
  }

  const stats = getDeckStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-bold text-amber-800">Deck Builder</h2>
          <div className="flex items-center space-x-2">
            <Badge variant={selectedDeck.length >= 10 ? "default" : "destructive"}>
              {selectedDeck.length}/15 cards (unique only)
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
              <div className="bg-amber-50 p-3 rounded border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Unique Cards Only:</strong> Each card can only be added once to your deck. No duplicates
                  allowed. Click on any card to add it to your deck.
                </p>
              </div>
              <div className="flex flex-col space-y-3">
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
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <Button
                  onClick={autoSelectCards}
                  variant="outline"
                  className="w-full bg-amber-50 hover:bg-amber-100 border-amber-200"
                  disabled={selectedDeck.length >= 15}
                >
                  Auto-Select Best Cards ({15 - selectedDeck.length} remaining)
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredCards.map((card, index) => {
                const inDeck = isCardInDeck(card.name)
                const canAdd = selectedDeck.length < 15 && !inDeck

                return (
                  <div key={`${card.id}-${index}`} className="relative">
                    <div className="relative">
                      <EnhancedCard
                        card={card}
                        isSelected={inDeck}
                        disabled={inDeck || !canAdd}
                        onClick={canAdd ? () => addCardToDeck(card) : undefined}
                      />
                      {/* Status overlay */}
                      <div className="absolute top-2 right-2">
                        {inDeck && <Badge className="bg-green-500 text-white text-xs shadow-md">In Deck</Badge>}
                        {!canAdd && !inDeck && selectedDeck.length >= 15 && (
                          <Badge className="bg-gray-500 text-white text-xs shadow-md">Deck Full</Badge>
                        )}
                      </div>
                      {/* Click hint overlay for available cards */}
                      {canAdd && (
                        <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            Click to Add
                          </div>
                        </div>
                      )}
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
                  <Badge variant={stats.total >= 10 ? "default" : "destructive"}>{stats.total}/15</Badge>
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
              {selectedDeck.map((card) => (
                <div key={card.name} className="flex items-center space-x-2 p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{card.name}</div>
                    <div className="text-xs text-gray-500">
                      {card.type} • Cost: {card.cost || 0}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-6 h-6 p-0 bg-transparent hover:bg-red-50 hover:border-red-300"
                    onClick={() => removeCardFromDeck(card)}
                    title="Remove from deck"
                  >
                    <Minus className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button onClick={onConfirm} disabled={selectedDeck.length < 10} className="w-full">
                {selectedDeck.length < 10 ? `Need ${10 - selectedDeck.length} more cards` : "Confirm Deck"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
