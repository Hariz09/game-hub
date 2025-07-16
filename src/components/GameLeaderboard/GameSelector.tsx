import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';

interface Game {
  id: string;
  name: string;
  description?: string | null;
}

interface GameSelectorProps {
  games: Game[];
  selectedGame: string | null;
  onGameSelect: (gameName: string) => void;
  loading?: boolean;
}

export const GameSelector: React.FC<GameSelectorProps> = ({ 
  games, 
  selectedGame, 
  onGameSelect,
  loading 
}) => {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-center items-center space-x-3 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary"></div>
          <span className="text-muted-foreground dark:text-muted-foreground font-medium">Loading games...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden bg-card dark:bg-card border-border dark:border-border">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-muted dark:bg-muted" />
                    <Skeleton className="h-6 flex-1 bg-muted dark:bg-muted" />
                  </div>
                  <Skeleton className="h-4 w-full bg-muted dark:bg-muted" />
                  <Skeleton className="h-4 w-3/4 bg-muted dark:bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground dark:text-foreground">Choose Your Game</h2>
        <p className="text-muted-foreground dark:text-muted-foreground">Select a game to view the leaderboard</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {games.map((game) => (
          <Card 
            key={game.id}
            className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] overflow-hidden border-border dark:border-border ${
              selectedGame === game.name
                ? 'ring-2 ring-primary dark:ring-primary shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20'
                : 'hover:shadow-md hover:bg-accent/50 dark:hover:bg-accent/50 bg-card dark:bg-card'
            }`}
            onClick={() => onGameSelect(game.name)}
          >
            <CardContent className="p-6 h-full">
              <div className="space-y-4 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <div className="text-2xl transition-transform group-hover:scale-110">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground dark:text-foreground truncate">
                      {game.name}
                    </h3>
                  </div>
                  {selectedGame === game.name && (
                    <div className="text-primary dark:text-primary">
                      <Trophy className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Description */}
                {game.description && (
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 flex-1">
                    {game.description}
                  </p>
                )}

                {/* Selection Badge */}
                {selectedGame === game.name && (
                  <div className="flex justify-end">
                    <Badge variant="default" className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center py-12 space-y-4">
          <div className="text-6xl opacity-50">🎮</div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground">No games available</h3>
            <p className="text-muted-foreground dark:text-muted-foreground">Games will appear here when they&apos;re loaded</p>
          </div>
        </div>
      )}
    </div>
  );
};