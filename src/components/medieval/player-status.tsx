import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Heart, Shield, Zap } from "lucide-react"
import type { Player } from "@/types/medieval"
import { getAvailableHandCards } from "@/utils/medieval"

interface PlayerStatusProps {
  player: Player
  energyBonus: number
  isPlayer?: boolean
}

export const PlayerStatus: React.FC<PlayerStatusProps> = ({ player, energyBonus, isPlayer = false }) => {
  const availableHandCards = getAvailableHandCards(player)
  const bgColor = isPlayer ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"
  const textColor = isPlayer ? "text-blue-800" : "text-red-800"

  return (
    <Card className={bgColor}>
      <CardHeader>
        <CardTitle className={`flex items-center justify-between ${textColor}`}>
          <span>{player.name}</span>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>
              {player.hp}/{player.maxHp}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Progress value={(player.hp / player.maxHp) * 100} className="w-full" />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Resources: {player.resources}/10</span>
              {energyBonus > 0 && <Badge className="bg-yellow-100 text-yellow-800">+{energyBonus}/turn</Badge>}
            </div>
            {player.shield > 0 && (
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{player.shield}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Hand: {availableHandCards.length} | Deck: {player.deck.length - player.hand.length}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
