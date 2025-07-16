import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Activity } from 'lucide-react';

interface LeaderboardFooterProps {
  onRefresh: () => void;
}

export const LeaderboardFooter: React.FC<LeaderboardFooterProps> = ({ onRefresh }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-cyan-50 to-purple-50 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-purple-900/20 p-6 border-t border-purple-100 dark:border-purple-800">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">
              Live updates
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              Updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={onRefresh}
            variant="outline"
            className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Refresh Leaderboard
          </Button>
        </div>
      </div>
    </div>
  );
};