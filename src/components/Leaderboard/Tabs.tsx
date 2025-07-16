import React from 'react';

interface LeaderboardTabsProps {
  activeTab: 'overall' | 'games';
  onTabChange: (tab: 'overall' | 'games') => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/30 shadow-lg">
      <div className="flex space-x-2">
        <button
          onClick={() => onTabChange('overall')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === 'overall'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <span className="text-xl">🏆</span>
          <span>Overall Leaderboard</span>
        </button>
        
        <button
          onClick={() => onTabChange('games')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            activeTab === 'games'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg transform scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <span className="text-xl">🎮</span>
          <span>Game Leaderboards</span>
        </button>
      </div>
    </div>
  );
};