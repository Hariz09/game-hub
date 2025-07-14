// app/page.tsx
import Sidebar from '@/components/sidebar/Sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Dice1, PuzzleIcon, Shapes } from 'lucide-react';

interface GameLink {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Use React.ElementType for the icon component
  href: string;
}

const games: GameLink[] = [
  {
    id: 'uno',
    title: 'UNO',
    description: 'Classic card game!',
    icon: Dice1, // Using a dice icon for UNO
    href: '/games/uno',
  },
  {
    id: '2048',
    title: '2048',
    description: 'Merge numbers!',
    icon: PuzzleIcon, // Using a puzzle piece icon for 2048
    href: '/games/2048',
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Arrange blocks!',
    icon: Shapes, // Using a shapes icon for Tetris
    href: '/games/tetris',
  },
];

export default function Home() {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-hidden p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to the Game Hub!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"> {/* Smaller gap */}
          {games.map((game) => (
            <Card key={game.id} className="flex flex-col items-center text-center p-4 h-auto"> {/* Smaller card padding and alignment */}
              <CardHeader className="pb-2"> {/* Reduce padding */}
                <div className="mb-2"> {/* Smaller margin below icon */}
                  <game.icon className="w-10 h-10 text-blue-600" /> {/* Icon size and color */}
                </div>
                <CardTitle className="text-lg font-semibold">{game.title}</CardTitle> {/* Smaller title */}
              </CardHeader>
              <CardContent className="text-sm text-gray-600 flex-grow"> {/* Smaller text and flex-grow */}
                <p>{game.description}</p>
              </CardContent>
              <CardFooter className="pt-4 w-full"> {/* Padding top and full width button */}
                <Link href={game.href} passHref>
                  <Button variant="outline" className="w-full text-sm">Play</Button> {/* Smaller button */}
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}