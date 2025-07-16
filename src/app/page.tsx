// app/page.tsx
import Sidebar from '@/components/sidebar/Sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dice1, PuzzleIcon, Shapes, Play } from 'lucide-react';

interface GameLink {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const games: GameLink[] = [
  {
    id: 'uno',
    title: 'UNO (Static)',
    description: 'Classic card game',
    icon: Dice1,
    href: '/games/uno',
    color: 'text-red-500 dark:text-red-400',
  },
  {
    id: '2048',
    title: '2048',
    description: 'Merge numbers',
    icon: PuzzleIcon,
    href: '/games/2048',
    color: 'text-orange-500 dark:text-orange-400',
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Arrange blocks',
    icon: Shapes,
    href: '/games/tetris',
    color: 'text-blue-500 dark:text-blue-400',
  },
];

export default function Home() {
  return (
    <main className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Game Hub
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choose your game and start playing
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {games.map((game) => (
              <Card key={game.id} className="group hover:shadow-md transition-all duration-300 border-0 bg-white dark:bg-gray-800 shadow-sm hover:scale-[1.01]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${game.color}`}>
                      <game.icon className="w-5 h-5" />
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    {game.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pb-3">
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {game.description}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link href={game.href} className="w-full">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full group-hover:bg-gray-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-gray-900 transition-colors duration-300"
                    >
                      Play
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}