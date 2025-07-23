"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles, Star, Gem, Shield, Users } from "lucide-react"
import type { GachaPull } from "@/types/medieval"
import { EnhancedCard } from "../enhanced-card"

interface GachaResultsProps {
  results: GachaPull[]
  isOpen: boolean
  onClose: () => void
}

export const GachaResults: React.FC<GachaResultsProps> = ({ results, isOpen, onClose }) => {
  if (!isOpen || results.length === 0) return null

  const newCards = results.filter((result) => result.isNew)

  const getRarityCount = (rarity: string) => {
    return results.filter((result) => result.card.rarity === rarity).length
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return <Star className="w-5 h-5" />
      case "epic":
        return <Gem className="w-5 h-5" />
      case "rare":
        return <Shield className="w-5 h-5" />
      case "common":
        return <Users className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "epic":
        return "bg-purple-50 border-purple-200 text-purple-800"
      case "rare":
        return "bg-blue-50 border-blue-200 text-blue-800"
      case "common":
        return "bg-gray-50 border-gray-200 text-gray-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 mr-2" />
            <h2 className="text-2xl font-bold">Gacha Results</h2>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className={getRarityColor("legendary")}>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">{getRarityIcon("legendary")}</div>
                <div className="text-2xl font-bold">{getRarityCount("legendary")}</div>
                <div className="text-sm">Legendary</div>
              </CardContent>
            </Card>
            <Card className={getRarityColor("epic")}>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">{getRarityIcon("epic")}</div>
                <div className="text-2xl font-bold">{getRarityCount("epic")}</div>
                <div className="text-sm">Epic</div>
              </CardContent>
            </Card>
            <Card className={getRarityColor("rare")}>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">{getRarityIcon("rare")}</div>
                <div className="text-2xl font-bold">{getRarityCount("rare")}</div>
                <div className="text-sm">Rare</div>
              </CardContent>
            </Card>
            <Card className={getRarityColor("common")}>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center mb-1">{getRarityIcon("common")}</div>
                <div className="text-2xl font-bold">{getRarityCount("common")}</div>
                <div className="text-sm">Common</div>
              </CardContent>
            </Card>
          </div>

          {/* New Cards */}
          {newCards.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                New Cards Added to Collection! ({newCards.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newCards.map((result, index) => (
                  <div key={`new-${result.card.id}-${index}`} className="relative">
                    <div className="h-[240px]">
                      <EnhancedCard card={result.card} size="small" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-500 text-white animate-pulse">NEW!</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Results */}
          <div>
            <h3 className="text-xl font-bold text-purple-800 mb-4">All Results ({results.length} cards)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((result, index) => (
                <div key={`result-${result.card.id}-${index}`} className="relative">
                  <div className="h-[240px]">
                    <EnhancedCard card={result.card} size="small" />
                  </div>
                  {result.isNew && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-green-500 text-white">NEW</Badge>
                    </div>
                  )}
                  {!result.isNew && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-500 text-white">ADDED</Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Banner Progress Info */}
          <div className="bg-purple-50 p-4 rounded border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">🎯 No Duplicates Guarantee</h4>
            <p className="text-purple-700 text-sm">
              Since this banner guarantees no duplicates, you will never receive the same card twice from this banner.
              Your chances of getting remaining cards automatically increase with each pull!
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <Button onClick={onClose} className="w-full" size="lg">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
