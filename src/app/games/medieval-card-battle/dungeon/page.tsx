"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Coins, Lock, CheckCircle, Swords } from "lucide-react"
import { DUNGEON_STAGES } from "@/data/dungeon-stages"
import { getPlayerProgress } from "@/lib/medieval/player-progress"
import type { PlayerProgress, DungeonStage } from "@/types/medieval"
import Sidebar from "@/components/sidebar/Sidebar"

export default function DungeonPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<PlayerProgress | null>(null)
  const [stages, setStages] = useState<DungeonStage[]>(DUNGEON_STAGES)

  useEffect(() => {
    const playerProgress = getPlayerProgress()
    setProgress(playerProgress)

    // Update stage unlock status
    const updatedStages = DUNGEON_STAGES.map((stage, index) => ({
      ...stage,
      unlocked: index === 0 || playerProgress.completedDungeons.includes(DUNGEON_STAGES[index - 1]?.id),
      completed: playerProgress.completedDungeons.includes(stage.id),
    }))
    setStages(updatedStages)
  }, [])

  const handleStageSelect = (stageId: string) => {
    router.push(`/games/medieval-card-battle/dungeon/${stageId}`)
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

  const getTotalGoldEarned = () => {
    if (!progress) return 0
    return stages
      .filter((stage) => progress.completedDungeons.includes(stage.id))
      .reduce((total, stage) => total + stage.goldReward, 0)
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4 flex items-center justify-center">
        <div className="text-gray-300">Loading dungeon...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <Sidebar />
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            onClick={() => router.push("/games/medieval-card-battle")}
            variant="outline"
            size="sm"
            className="mr-4 bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Campaign
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">Dungeon Exploration</h1>
            <p className="text-gray-300">Brave the depths to earn gold and treasure</p>
          </div>
          <div className="bg-gray-700/80 rounded-lg px-4 py-2 border border-amber-600">
            <div className="flex items-center">
              <Coins className="w-5 h-5 text-amber-400 mr-2" />
              <span className="text-amber-300 font-bold">{progress.gold} Gold</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-100">Dungeon Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Completed:</span>
                  <span className="font-bold">
                    {progress.completedDungeons.length}/{stages.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-amber-300 flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                Gold Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Total from Dungeons:</span>
                  <span className="font-bold text-amber-300">{getTotalGoldEarned()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-100">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/games/medieval-card-battle/gacha")}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Coins className="w-4 h-4 mr-2" />
                Spend Gold (Gacha)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dungeon Stages */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100">Dungeon Stages</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stages.map((stage, index) => (
              <Card
                key={stage.id}
                className={`relative transition-all hover:shadow-lg ${
                  stage.completed
                    ? "bg-green-900/30 border-green-600"
                    : stage.unlocked
                      ? "bg-gray-700 border-gray-600 hover:border-amber-500"
                      : "bg-gray-800 border-gray-700 opacity-60"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-100">{stage.name}</CardTitle>
                    {stage.completed && <CheckCircle className="w-6 h-6 text-green-400" />}
                    {!stage.unlocked && <Lock className="w-6 h-6 text-gray-500" />}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(stage.difficulty)}>{stage.difficulty.toUpperCase()}</Badge>
                    <div className="flex items-center text-amber-300">
                      <Coins className="w-4 h-4 mr-1" />
                      <span className="font-bold">{stage.goldReward} Gold</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-gray-300 mb-4">{stage.description}</p>

                  <Button
                    onClick={() => handleStageSelect(stage.id)}
                    disabled={!stage.unlocked}
                    className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600"
                    variant={stage.completed ? "outline" : "default"}
                  >
                    <Swords className="w-4 h-4 mr-2" />
                    {stage.completed ? "Replay for Gold" : stage.unlocked ? "Enter Dungeon" : "Locked"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-gray-100">About Dungeons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-gray-300">
            <p>
              Dungeons are special challenge stages that reward you with gold instead of new cards. Use this gold in the
              Gacha system to obtain powerful new cards for your collection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-green-400 mb-1">Easy Dungeons</h4>
                <p>Moderate challenge with decent gold rewards. Good for beginners.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400 mb-1">Medium Dungeons</h4>
                <p>Increased difficulty with better gold rewards. Requires strategy.</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400 mb-1">Hard Dungeons</h4>
                <p>Maximum challenge with the highest gold rewards. For experts only.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
