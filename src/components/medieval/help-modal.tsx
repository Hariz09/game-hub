"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Crown, Shield, Users, Heart, Sword, Zap, Target, Gem, Swords } from "lucide-react"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-amber-800">Game Help & Mechanics</h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Design Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Card Design & Elements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Each card is a masterpiece of medieval artistry, designed to convey power, rarity, and tactical
                information at a glance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-700">Visual Elements</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-200 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-bold text-xs">5</span>
                      </div>
                      <div>
                        <strong>Cost Indicator:</strong> The golden orb in the top-right shows the resource cost to play
                        the card.
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-600 rounded-full px-2 py-1 border border-purple-400 shadow-sm flex items-center gap-1 flex-shrink-0">
                        <Crown className="w-2.5 h-2.5 text-purple-200" />
                        <span className="text-purple-200 text-[8px] font-semibold uppercase">Nobility</span>
                      </div>
                      <div>
                        <strong>Type Badge:</strong> Shows the card type with distinctive colors and icons for quick
                        identification.
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-black/50 via-black/30 to-black/50 rounded-full border-2 border-amber-200/60 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                        <Sword className="w-5 h-5 text-amber-100" />
                      </div>
                      <div>
                        <strong>Ability Icon:</strong> The central icon represents the card's primary ability type,
                        making it easy to identify at a glance.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-amber-700">Rarity & Quality</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded border border-yellow-600 flex-shrink-0"></div>
                      <div>
                        <strong>Legendary:</strong> Golden gradient with ornate decorations and powerful effects
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded border border-blue-600 flex-shrink-0"></div>
                      <div>
                        <strong>Rare:</strong> Blue-cyan gradient with enhanced visual effects
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-slate-500 rounded border border-gray-600 flex-shrink-0"></div>
                      <div>
                        <strong>Common:</strong> Gray gradient with simple but elegant design
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">Card Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-red-800/90 via-red-700/80 to-red-900/90 rounded p-1 border border-red-400/60 backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-0.5">
                        <Sword className="w-2.5 h-2.5 text-red-200" />
                        <span className="text-red-100 font-bold text-[10px]">STR</span>
                      </div>
                      <div className="text-center text-white font-bold text-sm">8</div>
                    </div>
                    <div>
                      <strong>Strength (STR):</strong> The card's attack power and contribution to army strength
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-blue-800/90 via-blue-700/80 to-blue-900/90 rounded p-1 border border-blue-400/60 backdrop-blur-sm">
                      <div className="flex items-center justify-center gap-0.5">
                        <Crown className="w-2.5 h-2.5 text-blue-200" />
                        <span className="text-blue-100 font-bold text-[10px]">LOY</span>
                      </div>
                      <div className="text-center text-white font-bold text-sm">5</div>
                    </div>
                    <div>
                      <strong>Loyalty (LOY):</strong> How many turns the card remains faithful before potentially
                      betraying you
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <p className="text-sm mb-2">Battle follows this exact sequence:</p>
                  <ol className="text-sm space-y-1 list-decimal pl-4">
                    <li>Card abilities trigger (healing, boosts, shields, etc.)</li>
                    <li>Player army attacks enemy (damage based on total strength)</li>
                    <li>Check if enemy HP reaches 0 (player wins)</li>
                    <li>Enemy army attacks player (damage based on total strength)</li>
                    <li>Check if player HP reaches 0 (enemy wins)</li>
                    <li>Loyalty is tested for all cards</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Card Types & Roles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <Badge className="bg-purple-100 text-purple-800">Nobility</Badge>
                    <span className="text-sm">Can be played as Kings. High power, moderate loyalty.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <Badge className="bg-green-100 text-green-800">Support</Badge>
                    <span className="text-sm">Can be played as Support units. Provide ongoing benefits.</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Swords className="w-5 h-5 text-amber-700" />
                    <Badge className="bg-amber-100 text-amber-800">Commoner</Badge>
                    <span className="text-sm">Regular army units. Cannot be played as Support.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gem className="w-5 h-5 text-yellow-600" />
                    <Badge className="bg-yellow-100 text-yellow-800">Legendary</Badge>
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
                    <Gem className="w-4 h-4 text-amber-500" />
                    <strong>Resource Gain:</strong>
                    <span className="text-sm">Provides extra resources per turn</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unique Cards System */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Unique Cards System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">No Duplicates Rule</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Each player can only own one copy of each card</li>
                  <li>• Decks must contain only unique cards (no duplicates)</li>
                  <li>• During battle, each card can only be deployed once</li>
                  <li>• This creates more strategic deck building and tactical decisions</li>
                </ul>
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

          {/* Strategy Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-amber-800">Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Deck Building:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Balance cost curve (mix of low and high cost cards)</li>
                    <li>• Include cards for different roles (King, Support, Army)</li>
                    <li>• Consider ability synergies</li>
                    <li>• Plan for loyalty management</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Battle Tactics:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• React to enemy selections strategically</li>
                    <li>• Use abilities before attacks for maximum effect</li>
                    <li>• Manage loyalty to prevent betrayals</li>
                    <li>• Retrieve valuable cards when loyalty is low</li>
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
