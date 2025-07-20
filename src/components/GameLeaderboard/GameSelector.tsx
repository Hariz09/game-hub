import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Gamepad2, Zap, Star } from 'lucide-react';

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

const gameIcons = ['🎮', '🕹️', '🎯', '🏆', '⚡', '🌟', '🎲', '🎪', '🚀', '💎', '🔥', '⭐'];

export const GameSelector: React.FC<GameSelectorProps> = ({ 
  games, 
  selectedGame, 
  onGameSelect,
  loading 
}) => {
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900 p-6">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative space-y-8">
          {/* Loading Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-spin">
              <Gamepad2 className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Game Hub Loading...
              </h2>
              <p className="text-gray-300">Preparing your gaming experience</p>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-black/40 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50 transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-full bg-gray-600/50" />
                        <Skeleton className="h-4 w-3/4 bg-gray-600/50" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full bg-gray-600/50" />
                    <Skeleton className="h-4 w-2/3 bg-gray-600/50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900 p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Game Hub
              </h1>
              <p className="text-gray-300">Choose your adventure</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Star className="h-4 w-4" />
            <span>{games.length} games available</span>
            <Star className="h-4 w-4" />
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => {
            const isSelected = selectedGame === game.name;
            const iconEmoji = gameIcons[index % gameIcons.length];
            
            return (
              <Card 
                key={game.id}
                className={`group cursor-pointer transition-all duration-500 overflow-hidden border-2 transform hover:scale-105 hover:-translate-y-2 ${
                  isSelected
                    ? 'border-purple-400 shadow-2xl shadow-purple-500/25 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-cyan-900/80 backdrop-blur-sm'
                    : 'border-gray-700/50 hover:border-cyan-400/70 bg-black/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-purple-900/30 hover:to-cyan-900/30'
                }`}
                onClick={() => onGameSelect(game.name)}
              >
                <CardContent className="p-0 h-full">
                  {/* Card Header with Glow Effect */}
                  <div className={`h-2 w-full ${isSelected 
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500' 
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 group-hover:from-purple-500 group-hover:to-cyan-500'
                  } transition-all duration-300`}></div>
                  
                  <div className="p-6 space-y-4 h-full flex flex-col">
                    {/* Game Icon and Title */}
                    <div className="flex items-start space-x-4">
                      <div className={`text-4xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 ${
                        isSelected ? 'scale-110 animate-bounce' : ''
                      }`}>
                        {iconEmoji}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-bold text-lg truncate transition-colors ${
                            isSelected 
                              ? 'bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent' 
                              : 'text-white group-hover:text-purple-300'
                          }`}>
                            {game.name}
                          </h3>
                          
                          {isSelected && (
                            <div className="flex items-center space-x-1">
                              <Trophy className="h-5 w-5 text-yellow-400 animate-pulse" />
                              <Zap className="h-4 w-4 text-cyan-400" />
                            </div>
                          )}
                        </div>
                        
                        {isSelected && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {game.description && (
                      <p className={`text-sm flex-1 transition-colors leading-relaxed ${
                        isSelected 
                          ? 'text-gray-200' 
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}>
                        {game.description}
                      </p>
                    )}

                    {/* Bottom Action Area */}
                    <div className="flex items-center justify-between pt-2">
                      <div className={`text-xs px-3 py-1 rounded-full transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-gray-700/50 text-gray-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300'
                      }`}>
                        {isSelected ? 'Playing' : 'Available'}
                      </div>
                      
                      <div className={`transition-all duration-300 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-100"></div>
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-200"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {games.length === 0 && (
          <div className="text-center py-16 space-y-6">
            <div className="relative">
              <div className="text-8xl opacity-30 animate-bounce">🎮</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-ping"></div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                No Games Available
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Your game library is empty. Games will appear here when they&apos;re loaded into the hub.
              </p>
              
              <div className="flex items-center justify-center space-x-2 pt-4">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {games.length > 0 && (
          <div className="text-center pt-8">
            <div className="inline-flex items-center space-x-6 px-6 py-3 rounded-2xl bg-black/30 backdrop-blur-sm border border-gray-700/50">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Gamepad2 className="h-4 w-4 text-purple-400" />
                <span>{games.length} Games</span>
              </div>
              {selectedGame && (
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span>Now Playing: {selectedGame}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};