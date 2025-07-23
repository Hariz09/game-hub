"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Coins, Sparkles } from "lucide-react"
import { GACHA_BANNERS } from "@/data/gacha-banners"
import { getPlayerProgress } from "@/lib/medieval/player-progress"
import type { PlayerProgress, GachaPull } from "@/types/medieval"
import { GachaBannerComponent } from "@/components/medieval/gacha/banner"
import { GachaResults } from "@/components/medieval/gacha/results"
import Sidebar from "@/components/sidebar/sidebar"

export default function GachaPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<PlayerProgress | null>(null)
  const [pullResults, setPullResults] = useState<GachaPull[]>([])
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const playerProgress = getPlayerProgress()
    setProgress(playerProgress)
  }, [])

  const handlePullComplete = (results: GachaPull[]) => {
    setPullResults(results)
    setShowResults(true)
    // Refresh progress to show updated gold
    setProgress(getPlayerProgress())
  }

  const handleResultsClose = () => {
    setShowResults(false)
    setPullResults([])
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4 flex items-center justify-center">
        <div className="text-purple-800">Loading gacha system...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Sidebar />
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            onClick={() => router.push("/games/medieval-card-battle")}
            variant="outline"
            size="sm"
            className="mr-4 bg-white/80"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Campaign
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-purple-800 mb-2">Card Gacha</h1>
            <p className="text-purple-700">Spend gold to obtain powerful new cards</p>
          </div>
          <div className="bg-white/80 rounded-lg px-4 py-2 border border-amber-200">
            <div className="flex items-center">
              <Coins className="w-5 h-5 text-amber-600 mr-2" />
              <span className="text-amber-800 font-bold">{progress.gold} Gold</span>
            </div>
          </div>
        </div>

        {/* How to Get Gold */}
        <Card className="mb-6 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              <Coins className="w-5 h-5 mr-2" />
              How to Get Gold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Dungeon Exploration</h4>
                <p className="text-amber-600">
                  Complete dungeon stages to earn gold rewards. Higher difficulty dungeons provide more gold.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Coming Soon</h4>
                <p className="text-amber-600">
                  More ways to earn gold will be added in future updates, including daily quests and achievements.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => router.push("/games/medieval-card-battle/dungeon")}
                variant="outline"
                className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Dungeons
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Banners */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-purple-800">Active Banners</h2>

          {GACHA_BANNERS.filter((banner) => banner.isActive).map((banner) => (
            <GachaBannerComponent key={banner.id} banner={banner} onPullComplete={handlePullComplete} />
          ))}

          {GACHA_BANNERS.filter((banner) => banner.isActive).length === 0 && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">No active banners at the moment. Check back later!</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gacha Results Modal */}
        <GachaResults results={pullResults} isOpen={showResults} onClose={handleResultsClose} />
      </div>
    </div>
  )
}
