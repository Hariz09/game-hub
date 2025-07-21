"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Shield, ArrowUp } from "lucide-react"
import type { GameCard, Player } from "@/types/medieval"
import { EnhancedCard } from "./enhanced-card"

interface BattlefieldProps {
  player: Player
  selectedKing: GameCard | null
  selectedSupport: GameCard | null
  isPlayer?: boolean
  gamePhase: string
  onRetrieveKing?: () => void
  onRetrieveSupport?: () => void
  onDeselectKing?: () => void
  onDeselectSupport?: () => void
}

export const Battlefield: React.FC<BattlefieldProps> = ({
  player,
  selectedKing,
  selectedSupport,
  isPlayer = false,
  gamePhase,
  onRetrieveKing,
  onRetrieveSupport,
  onDeselectKing,
  onDeselectSupport,
}) => {
  const bgColor = isPlayer ? "bg-blue-50" : "bg-red-50"
  const textColor = isPlayer ? "text-blue-800" : "text-red-800"
  const borderColor = isPlayer ? "border-blue-300" : "border-red-300"
  const emptyTextColor = isPlayer ? "text-blue-500" : "text-red-500"

  return (
    <Card className={bgColor}>
      <CardHeader>
        <CardTitle className={textColor}>{isPlayer ? "Player's Court" : "Enemy's Court"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* King Section */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Crown className="w-4 h-4 mr-1" />
              King
            </h4>
            {selectedKing ? (
              <div className="space-y-2">
                <div className="h-[240px]">
                  <EnhancedCard card={selectedKing} isSelected={true} onClick={onDeselectKing} size="small" />
                </div>
                <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
              </div>
            ) : player.king ? (
              <div className="space-y-2">
                <div className="h-[240px]">
                  <EnhancedCard card={player.king} size="small" />
                </div>
                {isPlayer && gamePhase === "playerTurn" && onRetrieveKing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={onRetrieveKing}
                  >
                    <ArrowUp className="w-3 h-3 mr-1" />
                    Retrieve to Hand
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={`p-4 border-2 border-dashed ${borderColor} rounded text-center ${emptyTextColor} h-[240px] flex items-center justify-center`}
              >
                No King
              </div>
            )}
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Support
            </h4>
            {selectedSupport ? (
              <div className="space-y-2">
                <div className="h-[240px]">
                  <EnhancedCard card={selectedSupport} isSelected={true} onClick={onDeselectSupport} size="small" />
                </div>
                <div className="text-xs text-center text-blue-600 font-medium">Selected for deployment</div>
              </div>
            ) : player.support ? (
              <div className="space-y-2">
                <div className="h-[240px]">
                  <EnhancedCard card={player.support} size="small" />
                </div>
                {isPlayer && gamePhase === "playerTurn" && onRetrieveSupport && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs bg-transparent"
                    onClick={onRetrieveSupport}
                  >
                    <ArrowUp className="w-3 h-3 mr-1" />
                    Retrieve to Hand
                  </Button>
                )}
              </div>
            ) : (
              <div
                className={`p-4 border-2 border-dashed ${borderColor} rounded text-center ${emptyTextColor} h-[240px] flex items-center justify-center`}
              >
                No Support
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
