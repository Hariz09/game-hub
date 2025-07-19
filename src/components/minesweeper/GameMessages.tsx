// components/GameMessages.tsx
import { GameState } from "@/types/minesweeper";

interface GameMessagesProps {
  gameState: GameState;
  timer: number;
}

export const GameMessages: React.FC<GameMessagesProps> = ({ gameState, timer }) => {
  if (gameState === 'won') {
    return (
      <div className="mt-6 text-center" role="alert">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg inline-block">
          <p className="text-lg font-bold">🎉 Congratulations! You won!</p>
          <p>Time: {timer} seconds</p>
        </div>
      </div>
    );
  }
  
  if (gameState === 'lost') {
    return (
      <div className="mt-6 text-center" role="alert">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg inline-block">
          <p className="text-lg font-bold">💥 Game Over!</p>
          <p>Better luck next time!</p>
        </div>
      </div>
    );
  }
  
  return null;
};
