"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Shield, Sword, Heart, Users, Zap, Star, Target } from "lucide-react"
import type { GameCard } from "@/types/medieval"

interface EnhancedCardComponentProps {
  card: GameCard
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
  showLoyalty?: boolean
  canAfford?: boolean
}

export const EnhancedCardComponent: React.FC<EnhancedCardComponentProps> = ({
  card,
  isSelected,
  onClick,
  disabled,
  showLoyalty = true,
  canAfford = true,
}) => {
  const getTypeIcon = () => {
    switch (card.type) {
     case "soldier":
       return <Users className="w-4 h-4" />
     case "minister":
       return <Shield className="w-4 h-4" />
     case "royalty":
       return <Crown className="w-4 h-4" />
     case "champion":
       return <Star className="w-4 h-4" />
   }
  }

  const getTypeColor = () => {
    switch (card.type) {
     case "soldier":
       return "bg-green-100 text-green-800"
     case "minister":
       return "bg-blue-100 text-blue-800"
     case "royalty":
       return "bg-yellow-100 text-yellow-800"
     case "champion":
       return "bg-purple-100 text-purple-800"
   }
  }

  const getRarityBorder = () => {
    switch (card.rarity) {
      case "legendary":
        return "border-purple-400 border-2"
      case "rare":
        return "border-blue-400 border-2"
      default:
        return "border-gray-200"
    }
  }

  const getAbilityIcon = () => {
    switch (card.abilityType) {
      case "heal":
        return <Heart className="w-3 h-3 text-green-500" />
      case "boost":
        return <Zap className="w-3 h-3 text-yellow-500" />
      case "direct_damage":
        return <Target className="w-3 h-3 text-red-500" />
      case "shield":
        return <Shield className="w-3 h-3 text-blue-500" />
      case "rally":
        return <Users className="w-3 h-3 text-orange-500" />
      case "assassinate":
        return <Sword className="w-3 h-3 text-black" />
      default:
        return null
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${getRarityBorder()} ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${disabled || !canAfford ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={disabled || !canAfford ? undefined : onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor()}>
            {getTypeIcon()}
            <span className="ml-1 text-xs">{card.type}</span>
          </Badge>
          <div className="flex items-center space-x-2">
            {card.cost !== undefined && (
              <div className="flex items-center bg-amber-100 px-1 rounded">
                <span className="text-xs font-bold text-amber-800">{card.cost}</span>
              </div>
            )}
            {card.strength > 0 && (
              <div className="flex items-center">
                <Sword className="w-4 h-4 text-red-500 mr-1" />
                <span className="font-bold">{card.strength}</span>
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-sm">{card.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {card.loyalty !== undefined && showLoyalty && (
          <div className="flex items-center mb-2">
            <Heart className="w-4 h-4 text-pink-500 mr-1" />
            <span className="text-sm">Loyalty: {card.loyalty}</span>
          </div>
        )}
        {card.ability && (
          <div className="flex items-start">
            {getAbilityIcon()}
            <p className="text-xs text-gray-600 italic ml-1">{card.ability}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
