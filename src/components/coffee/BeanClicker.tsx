import React from 'react';
import { Coffee, Star, Loader2, Zap, Crown } from 'lucide-react';

interface BeanClickerProps {
  gameState: any;
  isReady: boolean;
  canPrestige: () => boolean;
  getPrestigeProgress: () => { current: number; next: number; progress: number };
  formatNumber: (num: number) => string;
  onHandleClick: () => void;
  onShowPrestige: () => void;
}

export const BeanClicker: React.FC<BeanClickerProps> = ({
  gameState,
  isReady,
  canPrestige,
  getPrestigeProgress,
  formatNumber,
  onHandleClick,
  onShowPrestige
}) => {
  const clickPower = gameState.clickPower * (gameState.upgrades.includes('clickPower') ? 20 : 1);
  const prestigeProgress = getPrestigeProgress();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient with subtle pattern */}
      
      {/* Main content */}
      <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100/50 dark:border-gray-700/50 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
            Bean Production
          </h2>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">{clickPower}/click</span>
          </div>
        </div>

        {/* Prestige Progress Bar */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span className="font-bold text-purple-800 dark:text-purple-200">
                Prestige Level {gameState.prestigeLevel}
              </span>
            </div>
            <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              {formatNumber(prestigeProgress.current)} / {formatNumber(prestigeProgress.next)}
            </span>
          </div>
          
          {/* Progress bar container */}
          <div className="relative w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full h-4 overflow-hidden shadow-inner">
            {/* Progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-400 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${prestigeProgress.progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Progress text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mix-blend-difference dark:mix-blend-normal">
                {prestigeProgress.progress.toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Next prestige info */}
          <div className="mt-2 text-center">
            <p className="text-xs text-purple-600 dark:text-purple-400">
              {canPrestige() ? (
                <span className="text-green-600 dark:text-green-400 font-bold animate-pulse">
                  ✨ Prestige Available! ✨
                </span>
              ) : (
                <>
                  Need {formatNumber(prestigeProgress.next - prestigeProgress.current)} more for next prestige
                </>
              )}
            </p>
          </div>
        </div>
        
        <div className="text-center space-y-6">
          {/* Main click button */}
          <div className="relative inline-block">
            <button
              onClick={onHandleClick}
              disabled={!isReady}
              className="group relative w-56 h-56 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 dark:from-amber-500 dark:via-orange-500 dark:to-yellow-500 rounded-full shadow-2xl hover:shadow-amber-500/25 dark:hover:shadow-amber-400/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
            >
              {/* Subtle inner glow */}
              <div className="absolute inset-4 bg-gradient-to-br from-amber-300/30 dark:from-amber-200/20 to-transparent rounded-full"></div>
              
              {/* Coffee icon */}
              <div className="relative flex items-center justify-center h-full">
                <Coffee size={96} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-200" />
              </div>
              
              {/* Click ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-active:opacity-100 group-active:animate-ping transition-opacity"></div>
            </button>
          </div>

          {/* Prestige button */}
          {canPrestige() && isReady && (
            <div className="pt-4">
              <button
                onClick={onShowPrestige}
                className="group bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 dark:from-purple-500 dark:via-purple-400 dark:to-indigo-500 text-white px-8 py-3 rounded-2xl hover:from-purple-700 hover:via-purple-600 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:via-purple-500 dark:hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 transform hover:scale-105 flex items-center gap-3 mx-auto font-semibold relative"
              >
                <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Prestige Available!</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 dark:bg-yellow-300 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-purple-400/20 dark:from-yellow-300/20 dark:to-purple-300/20 animate-pulse"></div>
              </button>
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="font-medium">Brewing...</span>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};