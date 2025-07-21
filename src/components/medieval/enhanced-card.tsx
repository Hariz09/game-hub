"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sword, Shield, Crown, Zap, Heart, Star, Users, Gem, Swords } from "lucide-react"
import type { GameCard } from "@/types/medieval"

interface EnhancedCardProps {
  card: GameCard
  isSelected?: boolean
  onClick?: () => void
  disabled?: boolean
  showLoyalty?: boolean
  canAfford?: boolean
  orientation?: "portrait" | "landscape"
  size?: "small" | "medium" | "large"
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  card,
  isSelected = false,
  onClick,
  disabled = false,
  showLoyalty = true,
  canAfford = true,
  orientation = "portrait",
  size = "medium",
}) => {
  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return {
          gradient: "from-yellow-600 via-amber-500 via-yellow-400 to-amber-300",
          border: "border-yellow-400",
          glow: "shadow-yellow-400/50",
          accent: "text-yellow-200",
        }
      case "rare":
        return {
          gradient: "from-blue-700 via-cyan-600 via-blue-500 to-cyan-400",
          border: "border-blue-400",
          glow: "shadow-blue-400/50",
          accent: "text-blue-200",
        }
      default:
        return {
          gradient: "from-gray-700 via-slate-600 via-gray-500 to-slate-400",
          border: "border-gray-400",
          glow: "shadow-gray-400/50",
          accent: "text-gray-200",
        }
    }
  }

  const getTypeInfo = (type: string) => {
    switch (type) {
      case "nobility":
        return {
          icon: Crown,
          color: "bg-purple-600",
          textColor: "text-purple-200",
          borderColor: "border-purple-400",
          name: "Nobility",
        }
      case "support":
        return {
          icon: Users,
          color: "bg-green-600",
          textColor: "text-green-200",
          borderColor: "border-green-400",
          name: "Support",
        }
      case "commoner":
        return {
          icon: Swords,
          color: "bg-amber-700",
          textColor: "text-amber-200",
          borderColor: "border-amber-500",
          name: "Commoner",
        }
      case "legendary":
        return {
          icon: Gem,
          color: "bg-gradient-to-r from-yellow-500 to-orange-500",
          textColor: "text-yellow-100",
          borderColor: "border-yellow-400",
          name: "Legendary",
        }
      default:
        return {
          icon: Star,
          color: "bg-gray-600",
          textColor: "text-gray-200",
          borderColor: "border-gray-400",
          name: "Unknown",
        }
    }
  }

  const getAbilityIcon = () => {
    switch (card.abilityType) {
      case "heal":
        return Heart
      case "boost":
        return Zap
      case "direct_damage":
        return Sword
      case "shield":
        return Shield
      case "rally":
        return Users
      case "assassinate":
        return Swords
      case "resource_gain":
        return Gem
      default:
        return Star
    }
  }

  const getSizeClasses = () => {
    if (orientation === "portrait") {
      switch (size) {
        case "small":
          return "h-[240px] w-full"
        case "large":
          return "h-[320px] w-full"
        default:
          return "h-[280px] w-full"
      }
    } else {
      switch (size) {
        case "small":
          return "h-[120px] w-full"
        case "large":
          return "h-[160px] w-full"
        default:
          return "h-[140px] w-full"
      }
    }
  }

  const colors = getRarityColors(card.rarity)
  const typeInfo = getTypeInfo(card.type)
  const TypeIcon = typeInfo.icon
  const AbilityIcon = getAbilityIcon()
  const sizeClasses = getSizeClasses()

  const cardClasses = `
    relative ${sizeClasses} bg-gradient-to-br ${colors.gradient} ${colors.border} border-2 
    shadow-lg ${colors.glow} transition-all duration-300 overflow-hidden
    ${onClick ? "cursor-pointer hover:scale-105 hover:rotate-1" : ""}
    ${isSelected ? "ring-4 ring-blue-400 ring-opacity-75" : ""}
    ${disabled || !canAfford ? "opacity-50 cursor-not-allowed" : ""}
  `

  if (orientation === "portrait") {
    return (
      <Card className={cardClasses} onClick={disabled || !canAfford ? undefined : onClick}>
        {/* Complex border pattern */}
        <div className="absolute inset-0 border-4 border-double border-amber-200/30 rounded-lg"></div>
        <div className="absolute inset-1 border border-dashed border-amber-100/20 rounded-lg"></div>

        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-8 h-8 p-1">
          <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-amber-200"></div>
          <div className="absolute top-2 left-2 w-1 h-1 border-l border-t border-amber-300"></div>
          <div className="absolute top-0.5 left-3 w-3 h-0.5 bg-amber-200 rounded-full"></div>
          <div className="absolute top-3 left-0.5 w-0.5 h-3 bg-amber-200 rounded-full"></div>
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 p-1 rotate-90">
          <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-amber-200"></div>
          <div className="absolute top-2 left-2 w-1 h-1 border-l border-t border-amber-300"></div>
          <div className="absolute top-0.5 left-3 w-3 h-0.5 bg-amber-200 rounded-full"></div>
          <div className="absolute top-3 left-0.5 w-0.5 h-3 bg-amber-200 rounded-full"></div>
        </div>

        {/* Cost indicator */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-200 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xs">{card.cost || 0}</span>
        </div>

        {/* Type indicator */}
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 ${typeInfo.color} rounded-full px-2 py-1 border ${typeInfo.borderColor} shadow-sm`}
        >
          <TypeIcon className={`w-2.5 h-2.5 ${typeInfo.textColor}`} />
          <span className={`${typeInfo.textColor} text-[8px] font-semibold uppercase tracking-wider`}>
            {typeInfo.name}
          </span>
        </div>

        <CardContent className="p-3 h-full flex flex-col relative z-10">
          {/* Header with title */}
          <div className="relative mb-2 mt-4">
            <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded p-1.5 border border-amber-200/40 backdrop-blur-sm">
              <h3 className="text-white font-bold text-xs text-center tracking-wide drop-shadow-lg relative z-10 truncate">
                {card.name}
              </h3>
            </div>
          </div>

          {/* Icon section */}
          <div className="flex-1 flex items-center justify-center mb-2 relative">
            {/* Outer decorative ring */}
            <div className="absolute w-14 h-14 border-2 border-dashed border-amber-200/30 rounded-full"></div>
            <div className="absolute w-12 h-12 border border-amber-200/20 rounded-full"></div>
            {/* Main icon container */}
            <div className="w-10 h-10 bg-gradient-to-br from-black/50 via-black/30 to-black/50 rounded-full border-2 border-amber-200/60 flex items-center justify-center relative backdrop-blur-sm">
              <AbilityIcon className="w-5 h-5 text-amber-100 drop-shadow-lg relative z-10" />
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            {/* Strength */}
            <div className="relative">
              <div className="bg-gradient-to-br from-red-800/90 via-red-700/80 to-red-900/90 rounded p-1 border border-red-400/60 backdrop-blur-sm">
                <div className="flex items-center justify-center gap-0.5 relative z-10">
                  <Sword className="w-2.5 h-2.5 text-red-200" />
                  <span className="text-red-100 font-bold text-[10px] tracking-wider">STR</span>
                </div>
                <div className="text-center text-white font-bold text-sm drop-shadow-lg relative z-10">
                  {card.strength}
                </div>
              </div>
            </div>
            {/* Loyalty */}
            {showLoyalty && (
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-800/90 via-blue-700/80 to-blue-900/90 rounded p-1 border border-blue-400/60 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-0.5 relative z-10">
                    <Crown className="w-2.5 h-2.5 text-blue-200" />
                    <span className="text-blue-100 font-bold text-[10px] tracking-wider">LOY</span>
                  </div>
                  <div className="text-center text-white font-bold text-sm drop-shadow-lg relative z-10">
                    {card.loyalty}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ability section */}
          <div className="relative">
            <div className="bg-gradient-to-br from-black/60 via-black/40 to-black/60 rounded p-1.5 border border-amber-200/40 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-0.5 relative z-10">
                <Star className="w-2.5 h-2.5 text-amber-300" />
                <span className="text-amber-200 font-bold text-[10px] uppercase tracking-wider">Ability</span>
              </div>
              <p className="text-amber-50 text-[9px] leading-tight relative z-10 line-clamp-3">{card.ability}</p>
            </div>
          </div>
        </CardContent>

        {/* Texture overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/30 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg pointer-events-none"></div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 rounded-lg pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M10 0l10 10-10 10L0 10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </Card>
    )
  } else {
    // Landscape orientation
    return (
      <Card className={cardClasses} onClick={disabled || !canAfford ? undefined : onClick}>
        {/* Complex border pattern */}
        <div className="absolute inset-0 border-4 border-double border-amber-200/30 rounded-lg"></div>
        <div className="absolute inset-1 border border-dashed border-amber-100/20 rounded-lg"></div>

        {/* Corner ornaments */}
        <div className="absolute top-0 left-0 w-6 h-6 p-1">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-l-2 border-t-2 border-amber-200"></div>
          <div className="absolute top-0.5 left-2.5 w-2 h-0.5 bg-amber-200 rounded-full"></div>
          <div className="absolute top-2.5 left-0.5 w-0.5 h-2 bg-amber-200 rounded-full"></div>
        </div>
        <div className="absolute top-0 right-0 w-6 h-6 p-1 rotate-90">
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-l-2 border-t-2 border-amber-200"></div>
          <div className="absolute top-0.5 left-2.5 w-2 h-0.5 bg-amber-200 rounded-full"></div>
          <div className="absolute top-2.5 left-0.5 w-0.5 h-2 bg-amber-200 rounded-full"></div>
        </div>

        {/* Cost indicator */}
        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-200 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xs">{card.cost || 0}</span>
        </div>

        {/* Type indicator */}
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 ${typeInfo.color} rounded-full px-2 py-0.5 border ${typeInfo.borderColor} shadow-sm`}
        >
          <TypeIcon className={`w-2 h-2 ${typeInfo.textColor}`} />
          <span className={`${typeInfo.textColor} text-[7px] font-semibold uppercase tracking-wider`}>
            {typeInfo.name}
          </span>
        </div>

        <CardContent className="p-3 h-full flex flex-row gap-2 relative z-10">
          {/* Left Column - Icon and Stats */}
          <div className="w-1/4 flex flex-col justify-between mt-4">
            {/* Icon section */}
            <div className="flex items-center justify-center relative mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-black/50 via-black/30 to-black/50 rounded-full border-2 border-amber-200/60 flex items-center justify-center relative backdrop-blur-sm">
                <AbilityIcon className="w-5 h-5 text-amber-100 drop-shadow-lg relative z-10" />
              </div>
            </div>
            {/* Stats section */}
            <div className="grid grid-cols-2 gap-1">
              {/* Strength */}
              <div className="relative">
                <div className="bg-gradient-to-br from-red-800/90 via-red-700/80 to-red-900/90 rounded p-0.5 border border-red-400/60 backdrop-blur-sm">
                  <div className="flex items-center justify-center relative z-10">
                    <Sword className="w-2 h-2 text-red-200" />
                  </div>
                  <div className="text-center text-white font-bold text-xs drop-shadow-lg relative z-10">
                    {card.strength}
                  </div>
                </div>
              </div>
              {/* Loyalty */}
              {showLoyalty && (
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-800/90 via-blue-700/80 to-blue-900/90 rounded p-0.5 border border-blue-400/60 backdrop-blur-sm">
                    <div className="flex items-center justify-center relative z-10">
                      <Crown className="w-2 h-2 text-blue-200" />
                    </div>
                    <div className="text-center text-white font-bold text-xs drop-shadow-lg relative z-10">
                      {card.loyalty}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Name and Ability */}
          <div className="w-3/4 flex flex-col justify-between mt-4">
            {/* Header with title */}
            <div className="relative mb-1">
              <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 rounded p-1 border border-amber-200/40 backdrop-blur-sm">
                <h3 className="text-white font-bold text-xs text-center tracking-wide drop-shadow-lg relative z-10 truncate">
                  {card.name}
                </h3>
              </div>
            </div>
            {/* Ability section */}
            <div className="relative flex-1">
              <div className="bg-gradient-to-br from-black/60 via-black/40 to-black/60 rounded p-1.5 border border-amber-200/40 backdrop-blur-sm h-full">
                <div className="flex items-center gap-1 mb-0.5 relative z-10">
                  <Star className="w-2 h-2 text-amber-300" />
                  <span className="text-amber-200 font-bold text-[8px] uppercase tracking-wider">Ability</span>
                </div>
                <p className="text-amber-50 text-[8px] leading-tight relative z-10 line-clamp-2">{card.ability}</p>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Texture overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/30 rounded-lg pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-lg pointer-events-none"></div>

        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-10 rounded-lg pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M10 0l10 10-10 10L0 10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </Card>
    )
  }
}

// Legacy component for backward compatibility
export const EnhancedCardComponent = EnhancedCard
