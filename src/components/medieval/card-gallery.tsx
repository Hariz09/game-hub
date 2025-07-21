"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import type { GameCard } from "@/types/medieval"
import { EnhancedCard } from "./enhanced-card"
import { ALL_CARDS_WITH_BANNERS } from "@/data/medieval-cards"

interface CardGalleryProps {
  ownedCards: GameCard[]
  isOpen: boolean
  onClose: () => void
}

export const CardGallery: React.FC<CardGalleryProps> = ({ ownedCards, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRarity, setFilterRarity] = useState<string>("all")
  const [showOwned, setShowOwned] = useState<"all" | "owned" | "missing">("all")

  if (!isOpen) return null

  // Check if a card is owned by comparing names
  const isCardOwned = (card: GameCard) => {
    return ownedCards.some((ownedCard) => ownedCard.name === card.name)
  }

  // Filter cards based on search, type, rarity, and ownership
  const filteredCards = ALL_CARDS_WITH_BANNERS.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || card.type === filterType
    const matchesRarity = filterRarity === "all" || card.rarity === filterRarity

    const owned = isCardOwned(card)
    const matchesOwnership =
      showOwned === "all" || (showOwned === "owned" && owned) || (showOwned === "missing" && !owned)

    return matchesSearch && matchesType && matchesRarity && matchesOwnership
  })

  // Get collection stats
  const getCollectionStats = () => {
    const total = ALL_CARDS_WITH_BANNERS.length
    const owned = ALL_CARDS_WITH_BANNERS.filter((card) => isCardOwned(card)).length
    const completion = Math.round((owned / total) * 100)

    const rarityStats = {
      common: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "common").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "common" && isCardOwned(card)).length,
      },
      rare: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "rare").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "rare" && isCardOwned(card)).length,
      },
      epic: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "epic").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "epic" && isCardOwned(card)).length,
      },
      legendary: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "legendary").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.rarity === "legendary" && isCardOwned(card)).length,
      },
    }

    const typeStats = {
      nobility: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "nobility").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "nobility" && isCardOwned(card)).length,
      },
      support: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "support").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "support" && isCardOwned(card)).length,
      },
      commoner: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "commoner").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "commoner" && isCardOwned(card)).length,
      },
      legendary: {
        total: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "legendary").length,
        owned: ALL_CARDS_WITH_BANNERS.filter((card) => card.type === "legendary" && isCardOwned(card)).length,
      },
    }

    return {
      total,
      owned,
      completion,
      rarityStats,
      typeStats,
    }
  }

  const stats = getCollectionStats()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Card Collection</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Collection Stats */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-800">Collection Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Completion:</span>
                    <span className="font-bold">
                      {stats.owned}/{stats.total} ({stats.completion}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: `${stats.completion}%` }}></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">By Rarity</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Common:</span>
                      <span>
                        {stats.rarityStats.common.owned}/{stats.rarityStats.common.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rare:</span>
                      <span>
                        {stats.rarityStats.rare.owned}/{stats.rarityStats.rare.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Epic:</span>
                      <span>
                        {stats.rarityStats.epic.owned}/{stats.rarityStats.epic.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legendary:</span>
                      <span>
                        {stats.rarityStats.legendary.owned}/{stats.rarityStats.legendary.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">By Type</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Nobility:</span>
                      <span>
                        {stats.typeStats.nobility.owned}/{stats.typeStats.nobility.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support:</span>
                      <span>
                        {stats.typeStats.support.owned}/{stats.typeStats.support.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commoner:</span>
                      <span>
                        {stats.typeStats.commoner.owned}/{stats.typeStats.commoner.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Legendary:</span>
                      <span>
                        {stats.typeStats.legendary.owned}/{stats.typeStats.legendary.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
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

            <select
              value={showOwned}
              onChange={(e) => setShowOwned(e.target.value as "all" | "owned" | "missing")}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Cards</option>
              <option value="owned">Owned Only</option>
              <option value="missing">Missing Only</option>
            </select>
          </div>

          {/* Cards Grid */}
          <div>
            <div className="mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {filteredCards.length} {showOwned !== "all" ? showOwned : ""} cards
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredCards.map((card, index) => {
                const owned = isCardOwned(card)

                return (
                  <div key={`${card.id}-${index}`} className="relative">
                    <div className={`h-[280px] ${!owned ? "opacity-70 grayscale" : ""}`}>
                      <EnhancedCard card={card} />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={owned ? "bg-green-500" : "bg-red-500"}>{owned ? "Owned" : "Missing"}</Badge>
                    </div>
                  </div>
                )
              })}

              {filteredCards.length === 0 && (
                <div className="col-span-full py-12 text-center text-gray-500">No cards match your filters</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
