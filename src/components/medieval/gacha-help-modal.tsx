"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Star, Gem, Shield, Users, HelpCircle } from "lucide-react"

interface GachaHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GachaHelpModal: React.FC<GachaHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-purple-800 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            Gacha System Guide
          </h2>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* No Duplicates Guarantee */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🎯 No Duplicates Guarantee</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-green-700">
                <strong>Every banner guarantees no duplicate cards!</strong> Once you obtain a card from a banner, you
                will never get it again from that same banner.
              </p>
              <div className="bg-green-100 p-3 rounded">
                <h4 className="font-semibold text-green-800 mb-2">How it works:</h4>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Each banner contains exactly 20 unique cards</li>
                  <li>• Once you pull a card, it's removed from the pool</li>
                  <li>• Pull rates automatically adjust as cards are obtained</li>
                  <li>• Complete the banner to collect all 20 cards!</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Banner Composition */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-800">📦 Banner Composition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">Card Distribution (20 total)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="font-medium">Legendary</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">1 card</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                      <div className="flex items-center">
                        <Gem className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="font-medium">Epic</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">2 cards</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-medium">Rare</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">6 cards</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="font-medium">Common</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800">11 cards</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Initial Drop Rates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span>Legendary</span>
                      <span className="font-bold text-yellow-700">5%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Epic</span>
                      <span className="font-bold text-purple-700">10%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>Rare</span>
                      <span className="font-bold text-blue-700">30%</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Common</span>
                      <span className="font-bold text-gray-700">55%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Rates */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">📈 Dynamic Drop Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-blue-700">
                As you obtain cards, the drop rates automatically adjust to reflect the remaining cards in the banner.
              </p>
              <div className="bg-blue-100 p-3 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Example:</h4>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>
                    • <strong>Start:</strong> 5% Legendary (1 out of 20 cards)
                  </p>
                  <p>
                    • <strong>After 10 pulls:</strong> 10% Legendary (1 out of 10 remaining cards)
                  </p>
                  <p>
                    • <strong>Last 5 cards:</strong> 20% Legendary (1 out of 5 remaining cards)
                  </p>
                </div>
              </div>
              <p className="text-blue-700 text-sm">
                <strong>
                  This means your chances of getting rare cards increase as you get closer to completing the banner!
                </strong>
              </p>
            </CardContent>
          </Card>

          {/* Pull Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-800">🎲 Pull Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-purple-200 rounded bg-purple-50">
                  <h4 className="font-semibold text-purple-800 mb-2">Single Pull</h4>
                  <p className="text-purple-700 text-sm mb-2">Pull one card at a time</p>
                  <div className="text-purple-600">
                    <div>
                      Cost: <strong>50 Gold</strong>
                    </div>
                    <div>Best for: Careful spending</div>
                  </div>
                </div>
                <div className="p-4 border border-purple-200 rounded bg-purple-50">
                  <h4 className="font-semibold text-purple-800 mb-2">10x Pull</h4>
                  <p className="text-purple-700 text-sm mb-2">Pull ten cards at once</p>
                  <div className="text-purple-600">
                    <div>
                      Cost: <strong>450 Gold</strong> (10% discount!)
                    </div>
                    <div>Best for: Bulk collection</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-800">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-amber-700">
                <p>
                  • <strong>Complete banners:</strong> You're guaranteed to get all cards eventually!
                </p>
                <p>
                  • <strong>Save gold:</strong> 10x pulls offer better value with the discount
                </p>
                <p>
                  • <strong>Check progress:</strong> Use "Show Probabilities" to see what cards you still need
                </p>
                <p>
                  • <strong>Earn gold:</strong> Complete dungeon stages to earn more gold for pulls
                </p>
                <p>
                  • <strong>Plan ahead:</strong> Higher rarity cards become more likely as you progress
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Banner Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-800">🏆 Banner Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Track your progress toward completing each banner:</p>
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm space-y-1">
                  <p>
                    • <strong>Progress Bar:</strong> Shows how many cards you've collected
                  </p>
                  <p>
                    • <strong>Obtained/Total:</strong> Exact count of your collection
                  </p>
                  <p>
                    • <strong>Completion Bonus:</strong> Satisfaction of a complete collection!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <Button onClick={onClose} className="w-full" size="lg">
            Got it! Let's Pull Some Cards!
          </Button>
        </div>
      </div>
    </div>
  )
}
