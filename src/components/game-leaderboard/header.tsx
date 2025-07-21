import React from 'react';

interface GameLeaderboardHeaderProps {
  gameName: string;
  limit: number;
  onLimitChange: (newLimit: number) => void;
  onBack: () => void;
}

export const GameLeaderboardHeader: React.FC<GameLeaderboardHeaderProps> = ({ 
  gameName,
  limit, 
  onLimitChange,
  onBack
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 text-white p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-2xl hover:text-purple-200 transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
          >
            ←
          </button>
          <div className="text-4xl">🎮</div>
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
              {gameName} Leaderboard
            </h1>
            <p className="text-purple-100 text-lg">
              Top performers in {gameName}
            </p>
          </div>
        </div>
        
        <div className="mt-6 lg:mt-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <label className="text-sm font-semibold mb-3 block text-cyan-100">
            Show top players:
          </label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent min-w-[140px]"
          >
            <option value={5} className="text-gray-800">5 players</option>
            <option value={10} className="text-gray-800">10 players</option>
            <option value={25} className="text-gray-800">25 players</option>
            <option value={50} className="text-gray-800">50 players</option>
          </select>
        </div>
      </div>
    </div>
  );
};