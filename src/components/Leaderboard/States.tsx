import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Use object type instead of empty interface
export const LoadingState: React.FC<object> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-cyan-50 to-purple-100 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-purple-900/20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 dark:from-purple-800 dark:via-purple-900 dark:to-cyan-800 h-32 animate-pulse"></div>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-purple-600 dark:text-purple-400" />
                <div className="absolute inset-0 animate-ping">
                  <div className="h-16 w-16 border-4 border-purple-400 rounded-full opacity-75"></div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  Loading Champions...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Gathering the finest warriors from across the digital realm
                </p>
              </div>
              
              <div className="w-full max-w-md">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/20 dark:to-cyan-900/20 h-24 rounded-2xl"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-cyan-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 h-32"></div>
          <div className="p-8">
            <div className="text-center py-12">
              <div className="text-8xl mb-6">⚠️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Oops! Something went wrong
              </h2>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={onRetry}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use object type instead of empty interface
export const EmptyState: React.FC<object> = () => {
  return (
    <div className="text-center py-16">
      <div className="text-8xl mb-6">🎮</div>
      <h3 className="text-2xl font-bold text-gray-700 mb-4">
        No Champions Yet
      </h3>
      <p className="text-gray-600 text-lg">
        Be the first to claim your spot on the leaderboard!
      </p>
    </div>
  );
};