// app/page.tsx
'use client'
import Sidebar from '@/components/sidebar/sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dice1, PuzzleIcon, Shapes, Play, Star, Users, Clock, Loader2, Zap, Coffee, Tag, Gamepad2, Fish, Sparkles, Bomb } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import CleanBackground from '@/components/clean-background';

interface GameLink {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  players?: string;
  duration?: string;
  rating?: number;
  isNew?: boolean;
  isPopular?: boolean;
  thumbnail?: string;
  tags: string[];
}

interface ComingSoonGame {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  players?: string;
  duration?: string;
  category: string;
  tags: string[];
}

const games: GameLink[] = [
  {
    id: 'coffee-brew-idle',
    title: 'Coffee Brew Idle',
    description: 'Build your coffee empire from a single bean! Automate brewing, unlock recipes, and become the ultimate barista tycoon',
    icon: Coffee,
    href: '/games/coffee-brew-idle',
    players: '1',
    duration: '∞',
    isNew: true,
    thumbnail: '/images/thumbnails/coffee-brew-idle.png',
    tags: ['Idle', 'Strategy', 'Business', 'Simulation']
  },
  {
    id: '2048',
    title: '2048',
    description: 'Addictive puzzle game - merge tiles to reach the ultimate 2048',
    icon: PuzzleIcon,
    href: '/games/2048',
    players: '1',
    duration: '10-20m',
    thumbnail: '/images/thumbnails/2048.png',
    tags: ['Puzzle', 'Logic', 'Numbers', 'Brain Teaser']
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Timeless block-stacking challenge - clear lines and beat your score',
    icon: Shapes,
    href: '/games/tetris',
    players: '1',
    duration: '5-∞',
    thumbnail: '/images/thumbnails/tetris.png',
    tags: ['Arcade', 'Puzzle', 'Classic', 'Fast-paced']
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Classic puzzle game where you clear a grid without triggering hidden mines.',
    icon: Bomb,
    href: '/games/minesweeper',
    players: '1',
    duration: '5–∞',
    thumbnail: '/images/thumbnails/minesweeper.png',
    tags: ['Puzzle', 'Logic', 'Singleplayer']
  },
  {
    id: 'uno',
    title: 'UNO (Static)',
    description: 'Classic card game with friends - match colors and numbers to win',
    icon: Dice1,
    href: '/games/uno',
    players: '2-4',
    duration: '15-30m',
    thumbnail: '/images/thumbnails/uno.png',
    tags: ['Card Game', 'Party', 'Classic', 'Fast-paced']
  },
  
  {
    id: 'medieval-card-battle',
    title: 'Medieval Card Battle',
    description: 'WIP',
    icon: Dice1,
    href: '/games/medieval-card-battle',
    players: '1',
    duration: '15-30m',
    thumbnail: '/placeholder.png',
    tags: ['Card Game']
  },
];

const comingSoonGames: ComingSoonGame[] = [
  {
    id: 'nexus-conquest',
    title: 'Nexus Conquest',
    description: 'Multiplayer turn-based strategy game where players gather resources through a gacha system and build units to conquer their opponents base.',
    icon: Zap,
    players: '2-6',
    duration: '15-30m',
    category: 'Strategy',
    tags: ['Strategy', 'Multiplayer', 'Turn-based', 'Combat', 'Resource Management', 'Gacha']
  },
  {
    id: 'multiplayer-uno',
    title: 'UNO (Multiplayer)',
    description: 'Real-time multiplayer UNO with voice chat, custom rules, and tournament modes. Challenge friends or join public lobbies.',
    icon: Gamepad2,
    players: '2-8',
    duration: '10-25m',
    category: 'Card Game',
    tags: ['Card Game', 'Multiplayer', 'Real-time', 'Voice Chat', 'Tournament']
  },
  {
    id: 'sushi-go',
    title: 'Sushi Go!',
    description: 'Fast-paced drafting card game where you pick sushi dishes to create the most delicious combinations and score points.',
    icon: Fish,
    players: '2-5',
    duration: '10-15m',
    category: 'Card Game',
    tags: ['Card Game', 'Drafting', 'Food Theme', 'Quick Play', 'Family Friendly']
  },
  {
    id: 'gacha-heroes',
    title: 'Gacha Heroes Arena',
    description: 'Collect legendary heroes through gacha mechanics, build powerful teams, and battle in epic RPG combat with stunning animations.',
    icon: Sparkles,
    players: '1',
    duration: '20-60m',
    category: 'RPG',
    tags: ['Gacha', 'RPG', 'Collection', 'Turn-based Combat', 'Heroes', 'Progression']
  },
];

export default function Home() {
  const [loadingGame, setLoadingGame] = useState<string | null>(null);

  const handleGameClick = (gameId: string) => {
    setLoadingGame(gameId);
  };

  return (
    <main className="flex h-screen">
      <CleanBackground />
      <Sidebar />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 dark:border-purple-400/30">
                <Play className="w-8 h-8 text-cyan-400 dark:text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 dark:from-purple-400 dark:via-pink-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Game Hub
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                  Choose your adventure and dive into the action
                </p>
              </div>
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card key={game.id} className="group relative overflow-hidden bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 hover:border-purple-400/50 dark:hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 backdrop-blur-sm">
                {/* Status badges */}
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {game.isNew && (
                    <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full">
                      NEW
                    </span>
                  )}
                  {game.isPopular && (
                    <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      HOT
                    </span>
                  )}
                </div>

                {/* Thumbnail Section */}
                <Link
                  href={game.href}
                  className="relative h-48 overflow-hidden block cursor-pointer"
                  onClick={() => handleGameClick(game.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20"></div>
                  <Image
                    src={game.thumbnail || "/placeholder.png"}
                    alt={`${game.title} game thumbnail`}
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Loading overlay */}
                  {loadingGame === game.id && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 flex items-center justify-center z-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <span className="text-slate-900 dark:text-white font-medium">Loading {game.title}...</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 via-transparent to-transparent dark:from-slate-900/80 dark:via-transparent dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>
                </Link>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-400/30 dark:border-purple-400/30">
                        <game.icon className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 dark:group-hover:from-purple-400 dark:group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                          {game.title}
                        </CardTitle>
                        {game.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                            <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">{game.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {game.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {game.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-600/50">
                          {tag}
                        </span>
                      ))}
                      {game.tags.length > 4 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-600/50">
                          +{game.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Game stats */}
                  <div className="flex items-center justify-between text-xs">
                    {game.players && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{game.players} players</span>
                      </div>
                    )}
                    {game.duration && (
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{game.duration}</span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    asChild
                    disabled={loadingGame === game.id}
                  >
                    <Link href={game.href} onClick={() => handleGameClick(game.id)}>
                      {loadingGame === game.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Playing
                        </>
                      )}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                Coming Soon
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Exciting new games in development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonGames.map((game) => (
                <Card key={game.id} className="bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm relative overflow-hidden">
                  {/* Category badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 rounded-full">
                      {game.category}
                    </span>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-slate-200/50 to-slate-300/50 dark:from-slate-600/20 dark:to-slate-500/20 border border-slate-300 dark:border-slate-600/30">
                        <game.icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                        {game.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {game.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {game.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-600/50">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Game stats */}
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                      {game.players && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          <span>{game.players} players</span>
                        </div>
                      )}
                      {game.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          <span>{game.duration}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}