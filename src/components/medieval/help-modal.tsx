"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Crown, Shield, Users, Star, Heart, Sword, Zap, Target } from "lucide-react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Game Help & Mechanics</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Game Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Game Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                Enhanced Medieval Card Battle is a strategic turn-based card game where you command armies, deploy kings
                and support units, and battle for supremacy. Each player starts with 60 HP and must reduce their
                opponent's HP to 0 to win.
              </p>
              <p>
                The game follows a unique turn structure:{" "}
                <strong>Enemy Selection → Player Turn → Battle → Repeat</strong>
              </p>
            </CardContent>
          </Card>

          {/* Turn Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Turn Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-semibold text-red-800 mb-2">1. Enemy Selection</h4>
                  <p className="text-sm">
                    The enemy AI selects their cards first. You can see their choices before making your own decisions.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2">2. Player Turn</h4>
                  <p className="text-sm">
                    You select your cards, knowing what the enemy has chosen. This allows for strategic counter-play.
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded">
                  <h4 className="font-semibold text-amber-800 mb-2">3. Battle Phase</h4>
                  <p className="text-sm">
                    Both armies clash, abilities trigger, and loyalty is tested. Damage is dealt based on total army
                    strength.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Card Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <Badge className="bg-yellow-100 text-yellow-800">Nobility</Badge>
                    <span className="text-sm">Can be played as Kings. High power, moderate loyalty.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <Badge className="bg-blue-100 text-blue-800">Support</Badge>
                    <span className="text-sm">Can be played as Support units. Provide ongoing benefits.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <Badge className="bg-green-100 text-green-800">Commoner</Badge>
                    <span className="text-sm">Regular army units. Cannot be played as Support.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-600" />
                    <Badge className="bg-purple-100 text-purple-800">Legendary</Badge>
                    <span className="text-sm">Can be played in any role. Powerful but expensive.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Battlefield Positions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Battlefield Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-3 rounded">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    King Position
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Only Nobility or Legendary cards</li>
                    <li>
                      • <strong>Immune to loyalty loss</strong>
                    </li>
                    <li>• Contributes to army strength</li>
                    <li>• Can be retrieved to hand</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Support Position
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Only Support or Legendary cards</li>
                    <li>• Provides ongoing abilities</li>
                    <li>• Loses loyalty each turn</li>
                    <li>• Can be retrieved to hand</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Army (Max 4)
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>• Any card except Support-only</li>
                    <li>• Loses loyalty each turn</li>
                    <li>• Main source of damage</li>
                    <li>• Can be retrieved to hand</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Abilities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Card Abilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-green-500" />
                    <strong>Heal:</strong>
                    <span className="text-sm">Restores HP when played or each turn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <strong>Boost:</strong>
                    <span className="text-sm">Increases strength of units</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-red-500" />
                    <strong>Direct Damage:</strong>
                    <span className="text-sm">Deals damage ignoring army strength</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <strong>Shield:</strong>
                    <span className="text-sm">Provides damage reduction</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    <strong>Rally:</strong>
                    <span className="text-sm">Boosts strength of all units</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sword className="w-4 h-4 text-black" />
                    <strong>Assassinate:</strong>
                    <span className="text-sm">Removes enemy units from play</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <strong>Resource Gain:</strong>
                    <span className="text-sm">Provides extra resources per turn</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loyalty System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Loyalty System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <strong>Every card has a loyalty value</strong> that decreases by 1 each turn after the battle phase.
              </p>
              <div className="bg-amber-50 p-3 rounded">
                <h4 className="font-semibold mb-2">Important Loyalty Rules:</h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Kings are immune</strong> - they never lose loyalty
                  </li>
                  <li>• When loyalty reaches 0, the card betrays you and joins the enemy deck</li>
                  <li>• Support cards and army units lose loyalty normally</li>
                  <li>• You can retrieve cards to hand before they betray</li>
                  <li>• Higher loyalty cards are more reliable long-term</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Resource Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Resources are used to play cards. You gain 3 resources per turn, plus any bonuses from cards.</p>
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-semibold mb-2">Resource Tips:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Maximum resources: 10</li>
                  <li>• Base gain: 3 per turn</li>
                  <li>• Resource gain cards provide permanent bonuses</li>
                  <li>• Plan your resource curve carefully</li>
                  <li>• Some powerful cards cost 6-7 resources</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Strategy Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Early Game:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Play low-cost units to build board presence</li>
                    <li>• Consider resource-generating cards</li>
                    <li>• Don't rush to play your King</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Mid Game:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Deploy your King for permanent power</li>
                    <li>• Use Support cards for ongoing benefits</li>
                    <li>• Watch enemy selections and counter-play</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Late Game:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Manage loyalty carefully</li>
                    <li>• Use direct damage to finish opponents</li>
                    <li>• Retrieve cards before they betray</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Advanced:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• React to enemy selections</li>
                    <li>• Balance aggression with defense</li>
                    <li>• Use abilities synergistically</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
