import React from 'react';
import { Coffee, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  authLoading: boolean;
  gameLoading: boolean;
  initializing: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  authLoading,
  gameLoading,
  initializing
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
      <div className="text-center">
        <Coffee className="w-16 h-16 text-amber-600 dark:text-amber-400 mx-auto mb-4 animate-pulse" />
        <div className="flex items-center justify-center gap-2 mb-2">
          <Loader2 className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-spin" />
          <p className="text-amber-800 dark:text-amber-200 text-xl font-semibold">Loading Coffee Brew Idle...</p>
        </div>
        {authLoading && (
          <p className="text-amber-600 dark:text-amber-300 text-sm">Checking authentication...</p>
        )}
        {gameLoading && (
          <p className="text-amber-600 dark:text-amber-300 text-sm">Loading game data...</p>
        )}
        {initializing && (
          <p className="text-amber-600 dark:text-amber-300 text-sm">Starting game systems...</p>
        )}
      </div>
    </div>
  );
};