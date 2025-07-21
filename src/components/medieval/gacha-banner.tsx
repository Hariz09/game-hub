"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Star, Sparkles, Eye, EyeOff, HelpCircle, Gem, Shield, Users } from "lucide-react"
import type { GachaBanner, GachaPull } from "@/types/medieval"
import { EnhancedCard } from "./enhanced-card"
import {
  performPull,
  canAffordPull,
  canPullFromBanner,
  calculateDynamicRates,
  getBannerCompletion,
} from "@/lib/medieval/gacha-system"
import { getPlayerProgress, getBannerProgress } from "@/lib/medieval/player-progress"
import { GachaHelpModal } from "./gacha-help-modal"

interface GachaBannerProps {
  banner: GachaBanner
  onPullComplete: (results: GachaPull[]) => void
}

export const GachaBannerComponent: React.FC<GachaBannerProps> = ({ banner, onPullComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showProbabilities, setShowProbabilities] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const progress = getPlayerProgress()
  const obtainedCards = getBannerProgress(banner.id)
  const completion = getBannerCompletion(banner)
  const currentRates = calculateDynamicRates(banner, banner.id)

  const handlePull = async (pullCount: number) => {
    setIsLoading(true)

    try {
      const results = performPull(banner, pullCount)
      if (results) {
        onPullComplete(results)
      } else if (!canPullFromBanner(banner)) {
        alert("Banner completed! You have obtained all cards from this banner.")
      } else {
        alert("Not enough gold!")
      }
    } catch (error) {
      console.error("Pull failed:", error)
      alert("Pull failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const canAffordSingle = canAffordPull(banner, 1)
  const canAffordMulti = canAffordPull(banner, 10)
  const canPull = canPullFromBanner(banner)

  const isCardObtained = (cardName: string) => {
    return obtainedCards.includes(cardName)
  }

  const getFeaturedCards = () => {
    return banner.cards.filter((card) => card.rarity === "legendary" || card.rarity === "epic")
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return <Star className="w-4 h-4" />
      case "epic":
        return <Gem className="w-4 h-4" />
      case "rare":
        return <Shield className="w-4 h-4" />
      case "common":
        return <Users className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-600"
      case "epic":
        return "text-purple-600"
      case "rare":
        return "text-blue-600"
      case "common":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-purple-800 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                {banner.name}
              </CardTitle>
              <p className="text-purple-600 text-sm mt-1">{banner.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setShowHelp(true)} variant="outline" size="sm" className="bg-white/50">
                <HelpCircle className="w-4 h-4" />
              </Button>
              <Badge className={canPull ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {canPull ? "Active" : "Completed"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Banner Progress */}
          <div className="bg-white/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-purple-800">Banner Progress</h4>
              <span className="text-sm text-purple-600">
                {completion.obtained}/{completion.total} cards ({completion.percentage}%)
              </span>
            </div>
            <Progress value={completion.percentage} className="w-full" />
          </div>

          {/* Current Drop Rates */}
          <div className="bg-white/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-purple-800">Current Drop Rates</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="text-yellow-600 font-bold">{currentRates.legendary.toFixed(1)}%</div>
                <div className="text-gray-600">Legendary</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded">
                <div className="text-purple-600 font-bold">{currentRates.epic.toFixed(1)}%</div>
                <div className="text-gray-600">Epic</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="text-blue-600 font-bold">{currentRates.rare.toFixed(1)}%</div>
                <div className="text-gray-600">Rare</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-gray-600 font-bold">{currentRates.common.toFixed(1)}%</div>
                <div className="text-gray-600">Common</div>
              </div>
            </div>
            <p className="text-xs text-purple-600 mt-2">
              * Rates automatically adjust as you obtain cards from this banner
            </p>
          </div>

          {/* Featured Cards Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-purple-800">Featured Cards (Legendary & Epic)</h4>
              <Button
                onClick={() => setShowProbabilities(!showProbabilities)}
                variant="outline"
                size="sm"
                className="bg-white/50"
              >
                {showProbabilities ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showProbabilities ? "Hide All" : "Show All"}
              </Button>
            </div>

            {showProbabilities ? (
              <div className="space-y-4">
                {["legendary", "epic", "rare", "common"].map((rarity) => {
                  const cardsOfRarity = banner.cards.filter((card) => card.rarity === rarity)
                  if (cardsOfRarity.length === 0) return null

                  return (
                    <div key={rarity}>
                      <h5 className="font-medium mb-2 flex items-center capitalize">
                        {getRarityIcon(rarity)}
                        <span className={`ml-2 ${getRarityColor(rarity)}`}>
                          {rarity} ({cardsOfRarity.length})
                        </span>
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {cardsOfRarity.map((card, index) => {
                          const obtained = isCardObtained(card.name)
                          return (
                            <div key={`${card.id}-${index}`} className="relative">
                              <div className={`h-[280px] ${obtained ? "" : "opacity-60"}`}>
                                <EnhancedCard card={card} size="small" />
                              </div>
                              <div className="absolute top-1 right-1">
                                <Badge className={obtained ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                                  {obtained ? "Obtained" : "Not Obtained"}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {getFeaturedCards().map((card, index) => {
                  const obtained = isCardObtained(card.name)
                  return (
                    <div key={`${card.id}-${index}`} className="relative">
                      <div className={`h-[280px] ${obtained ? "" : "opacity-60"}`}>
                        <EnhancedCard card={card} size="small" />
                      </div>
                      <div className="absolute top-1 right-1">
                        <Badge className={obtained ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
                          {obtained ? "Obtained" : "Not Obtained"}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pull Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Button
                onClick={() => handlePull(1)}
                disabled={!canAffordSingle || isLoading || !banner.isActive || !canPull}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                <Coins className="w-4 h-4 mr-2" />
                Single Pull ({banner.singlePullCost} Gold)
              </Button>
              {!canAffordSingle && canPull && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  Need {banner.singlePullCost - progress.gold} more gold
                </p>
              )}
            </div>

            <div className="flex-1">
              <Button
                onClick={() => handlePull(10)}
                disabled={!canAffordMulti || isLoading || !banner.isActive || !canPull}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                <Star className="w-4 h-4 mr-2" />
                10x Pull ({banner.multiPullCost} Gold)
              </Button>
              {!canAffordMulti && canPull && (
                <p className="text-red-500 text-xs mt-1 text-center">
                  Need {banner.multiPullCost - progress.gold} more gold
                </p>
              )}
            </div>
          </div>

          {!canPull && (
            <div className="bg-green-50 p-4 rounded border border-green-200 text-center">
              <h4 className="font-semibold text-green-800 mb-2">🎉 Banner Completed!</h4>
              <p className="text-green-700 text-sm">
                You have obtained all {banner.totalCards} cards from this banner. Check back for new banners!
              </p>
            </div>
          )}

          {/* Player Gold Display */}
          <div className="text-center bg-amber-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center justify-center">
              <Coins className="w-5 h-5 text-amber-600 mr-2" />
              <span className="text-amber-800 font-bold">Your Gold: {progress.gold}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <GachaHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  )
}
