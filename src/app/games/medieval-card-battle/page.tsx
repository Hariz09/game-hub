"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Lock, CheckCircle, Trophy, RotateCcw } from "lucide-react"
import { STAGE_CONFIGS } from "@/data/stage-configs"
import { getPlayerProgress, resetProgress } from "@/utils/player-progress"
import type { PlayerProgress, StageConfig } from "@/types/medieval"

export default function CampaignPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<PlayerProgress | null>(null)
  const [stages, setStages] = useState<StageConfig[]>(STAGE_CONFIGS)

  useEffect(() => {
    const playerProgress = getPlayerProgress()
    setProgress(playerProgress)

    // Update stage unlock status
    const updatedStages = STAGE_CONFIGS.map((stage, index) => ({
      ...stage,
      unlocked: index === 0 || playerProgress.completedStages.includes(index.toString()),
      completed: playerProgress.completedStages.includes(stage.id),
    }))
    setStages(updatedStages)
  }, [])

  const handleStageSelect = (stageId: string) => {
    router.push(`/medieval-card-battle/stage/${stageId}`)
  }

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      resetProgress()
      window.location.reload()
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCollectionStats = () => {
    if (!progress) return { total: 0, byRarity: { common: 0, rare: 0, legendary: 0 } }

    const stats = {
      total: progress.ownedCards.length,
      byRarity: { common: 0, rare: 0, legendary: 0 },
    }

    progress.ownedCards.forEach((card) => {
      stats.byRarity[card.rarity]++
    })

    return stats
  }

  const collectionStats = getCollectionStats()
  const completedStages = progress?.completedStages.length || 0

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4 flex items-center justify-center">
        <div className="text-amber-800">Loading campaign...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-800 mb-2">Medieval Card Battle Campaign</h1>
          <p className="text-amber-700">Choose your battles and build your legend</p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Campaign Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Stages Completed:</span>
                  <span className="font-bold">
                    {completedStages}/{stages.length}
                  </span>
                </div>
                <Progress value={(completedStages / stages.length) * 100} className="w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-800 flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Card Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Cards:</span>
                  <span className="font-bold">{collectionStats.total}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div className="text-center">
                    <div className="font-medium">{collectionStats.byRarity.common}</div>
                    <div className="text-gray-500">Common</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{collectionStats.byRarity.rare}</div>
                    <div className="text-gray-500">Rare</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{collectionStats.byRarity.legendary}</div>
                    <div className="text-gray-500">Legendary</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-800">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  onClick={handleResetProgress}
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-800">Campaign Stages</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stages.map((stage, index) => (
              <Card
                key={stage.id}
                className={`relative transition-all hover:shadow-lg ${
                  stage.completed
                    ? "bg-green-50 border-green-200"
                    : stage.unlocked
                      ? "bg-white border-gray-200 hover:border-amber-300"
                      : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Stage {stage.id}: {stage.name}
                    </CardTitle>
                    {stage.completed && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {!stage.unlocked && <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(stage.difficulty)}>{stage.difficulty.toUpperCase()}</Badge>
                    <span className="text-sm text-gray-600">vs {stage.enemyName}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{stage.description}</p>

                  {stage.rewards.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">Rewards:</h4>
                      <div className="flex flex-wrap gap-1">
                        {stage.rewards.map((reward, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {reward.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleStageSelect(stage.id)}
                    disabled={!stage.unlocked}
                    className="w-full"
                    variant={stage.completed ? "outline" : "default"}
                  >
                    {stage.completed ? "Play Again" : stage.unlocked ? "Start Battle" : "Locked"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Collection Preview */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Your Card Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {progress.ownedCards.slice(0, 16).map((card, index) => (
                  <div
                    key={`${card.id}-${index}`}
                    className="aspect-[3/4] bg-gray-100 rounded border flex items-center justify-center text-xs text-center p-1"
                  >
                    <div>
                      <div className="font-medium">{card.name}</div>
                      <div className="text-gray-500">{card.type}</div>
                    </div>
                  </div>
                ))}
                {progress.ownedCards.length > 16 && (
                  <div className="aspect-[3/4] bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-600">
                    +{progress.ownedCards.length - 16} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
