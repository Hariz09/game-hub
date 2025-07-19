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
    <div className="bg-white/50 backdrop-blur-sm p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-white/30 shadow-lg w-full">
      <div className="flex space-x-1 sm:space-x-2">
        <button
          onClick={() => onTabChange('overall')}
          className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex-1 sm:flex-initial text-sm sm:text-base ${
            activeTab === 'overall'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg transform scale-[1.02] sm:scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <span className="text-lg sm:text-xl">🏆</span>
          <span className="hidden xs:inline sm:inline">Overall</span>
          <span className="xs:hidden">Overall</span>
        </button>
        
        <button
          onClick={() => onTabChange('games')}
          className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex-1 sm:flex-initial text-sm sm:text-base ${
            activeTab === 'games'
              ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg transform scale-[1.02] sm:scale-105'
              : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
          }`}
        >
          <span className="text-lg sm:text-xl">🎮</span>
          <span className="hidden xs:inline sm:inline">Games</span>
          <span className="xs:hidden">Games</span>
        </button>
      </div>
    </div>
  );
};