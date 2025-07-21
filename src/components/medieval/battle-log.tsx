import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BattleLogProps {
  battleLog: string[]
}

export const BattleLog: React.FC<BattleLogProps> = ({ battleLog }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Battle Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {battleLog.length === 0 ? (
            <div className="text-gray-500 text-center">No events yet</div>
          ) : (
            battleLog.slice(-10).map((log, index) => (
              <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                {log}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
