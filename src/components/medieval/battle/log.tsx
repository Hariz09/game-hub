import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, Swords, Shield, Heart, Zap, Crown, Users, ScrollText, AlertCircle } from "lucide-react"

interface BattleLogProps {
  battleLog: string[]
}

interface LogEntry {
  message: string
  type: 'phase' | 'action' | 'damage' | 'heal' | 'ability' | 'status' | 'victory' | 'defeat'
  turn?: number
  phase?: string
}

const parseLogEntries = (battleLog: string[]): LogEntry[] => {
  return battleLog.map(log => {
    // Detect phase headers
    if (log.includes('---') && log.includes('Turn')) {
      const turnMatch = log.match(/Turn (\d+)/)
      const phaseMatch = log.match(/: (.+) ---/)
      return {
        message: log,
        type: 'phase',
        turn: turnMatch ? parseInt(turnMatch[1]) : undefined,
        phase: phaseMatch ? phaseMatch[1] : undefined
      }
    }
    
    // Detect different types of actions
    if (log.includes('deals') && log.includes('damage') || log.includes('Attack')) return { message: log, type: 'damage' }
    if (log.includes('heals') || log.includes('healing')) return { message: log, type: 'heal' }
    if (log.includes('provides') || log.includes('ability') || log.includes('Loyalty')) return { message: log, type: 'ability' }
    if (log.includes('shield') || log.includes('blocks')) return { message: log, type: 'status' }
    if (log.includes('wins') || log.includes('Victory')) return { message: log, type: 'victory' }
    if (log.includes('defeated') || log.includes('Defeat')) return { message: log, type: 'defeat' }
    
    return { message: log, type: 'action' }
  })
}

const groupByTurnAndPhase = (entries: LogEntry[]) => {
  const groups: { [key: string]: LogEntry[] } = {}
  let currentGroup = 'initial'
  
  entries.forEach(entry => {
    if (entry.type === 'phase' && entry.turn && entry.phase) {
      currentGroup = `turn-${entry.turn}-${entry.phase.toLowerCase().replace(/\s+/g, '-')}`
      groups[currentGroup] = []
    }
    
    if (!groups[currentGroup]) {
      groups[currentGroup] = []
    }
    
    groups[currentGroup].push(entry)
  })
  
  return groups
}

const getPhaseIcon = (phase: string) => {
  if (phase.includes('abilities')) return <Zap className="w-4 h-4" />
  if (phase.includes('attack')) return <Swords className="w-4 h-4" />
  if (phase.includes('loyalty')) return <Crown className="w-4 h-4" />
  return <ScrollText className="w-4 h-4" />
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'damage': return <Swords className="w-3 h-3 text-red-500" />
    case 'heal': return <Heart className="w-3 h-3 text-green-500" />
    case 'ability': return <Zap className="w-3 h-3 text-blue-500" />
    case 'status': return <Shield className="w-3 h-3 text-gray-500" />
    case 'victory': return <Crown className="w-3 h-3 text-yellow-500" />
    case 'defeat': return <AlertCircle className="w-3 h-3 text-red-600" />
    default: return <Users className="w-3 h-3 text-gray-400" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'damage': return 'text-red-700 bg-red-50 border-red-200'
    case 'heal': return 'text-green-700 bg-green-50 border-green-200'
    case 'ability': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'status': return 'text-gray-700 bg-gray-50 border-gray-200'
    case 'victory': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'defeat': return 'text-red-800 bg-red-100 border-red-300'
    default: return 'text-gray-600 bg-white border-gray-200'
  }
}

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)
  
  const entries = parseLogEntries(battleLog)
  const groupedEntries = groupByTurnAndPhase(entries)
  const groupKeys = Object.keys(groupedEntries)
  
  const toggleGroup = (groupKey: string) => {
    const newCollapsed = new Set(collapsedGroups)
    if (newCollapsed.has(groupKey)) {
      newCollapsed.delete(groupKey)
    } else {
      newCollapsed.add(groupKey)
    }
    setCollapsedGroups(newCollapsed)
  }
  
  const toggleAll = () => {
    if (collapsedGroups.size === 0) {
      // Collapse all except the last 2 groups
      const toCollapse = new Set(groupKeys.slice(0, -2))
      setCollapsedGroups(toCollapse)
    } else {
      // Expand all
      setCollapsedGroups(new Set())
    }
  }
  
  const formatGroupTitle = (groupKey: string) => {
    if (groupKey === 'initial') return 'Battle Start'
    
    const parts = groupKey.split('-')
    if (parts.length >= 3) {
      const turn = parts[1]
      const phase = parts.slice(2).join(' ').replace(/-/g, ' ')
      return `Turn ${turn} - ${phase.charAt(0).toUpperCase() + phase.slice(1)}`
    }
    return groupKey
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 min-w-0">
            <ScrollText className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">Battle Log</span>
            <Badge variant="secondary" className="flex-shrink-0">
              {battleLog.length}
            </Badge>
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              onClick={toggleAll}
              variant="outline"
              size="sm"
              className="text-xs whitespace-nowrap"
            >
              {collapsedGroups.size === 0 ? 'Collapse Old' : 'Expand All'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto overflow-x-hidden">
          {battleLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ScrollText className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Battle events will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              {groupKeys.map(groupKey => {
                const group = groupedEntries[groupKey]
                const isCollapsed = collapsedGroups.has(groupKey)
                const phaseEntry = group.find(entry => entry.type === 'phase')
                const otherEntries = group.filter(entry => entry.type !== 'phase')
                
                return (
                  <div key={groupKey} className="border rounded-lg overflow-hidden">
                    {phaseEntry ? (
                      <button
                        onClick={() => toggleGroup(groupKey)}
                        className="w-full p-3 bg-gradient-to-r from-amber-100 to-amber-50 hover:from-amber-150 hover:to-amber-100 transition-colors border-b flex items-center justify-between group min-h-0"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="flex-shrink-0">
                            {getPhaseIcon(phaseEntry.phase || '')}
                          </div>
                          <span className="font-semibold text-amber-800 truncate">
                            {formatGroupTitle(groupKey)}
                          </span>
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            {otherEntries.length} events
                          </Badge>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-amber-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                      </button>
                    ) : (
                      <div className="p-3 bg-gray-50 border-b">
                        <span className="font-semibold text-gray-700 break-words">
                          {formatGroupTitle(groupKey)}
                        </span>
                      </div>
                    )}
                    
                    {!isCollapsed && (
                      <div className="p-2 space-y-1 min-w-0">
                        {otherEntries.map((entry, index) => (
                          <div
                            key={`${groupKey}-${index}`}
                            className={`flex items-start gap-2 p-2 rounded border text-sm min-w-0 ${getTypeColor(entry.type)}`}
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {getTypeIcon(entry.type)}
                            </div>
                            <span className="flex-1 leading-relaxed break-words min-w-0">
                              {entry.message}
                            </span>
                          </div>
                        ))}
                        
                        {otherEntries.length === 0 && (
                          <div className="text-center py-2 text-gray-500 text-sm italic">
                            Phase in progress...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        {battleLog.length > 0 && (
          <div className="mt-4 pt-3 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-500">
              <span className="break-words">Latest events are shown first in each phase</span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Swords className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span>Damage</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Heart className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span>Healing</span>
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" />
                  <span>Abilities</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}