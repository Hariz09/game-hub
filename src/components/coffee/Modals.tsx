import React, { useState } from 'react';
import { Star, X, Zap, Sparkles } from 'lucide-react';

interface ModalsProps {
  showPrestige: boolean;
  gameState: any;
  isReady: boolean;
  formatNumber: (num: number) => string;
  onClosePrestige: () => void;
  onPrestige: () => void;
}

export const Modals: React.FC<ModalsProps> = ({
  showPrestige,
  gameState,
  isReady,
  formatNumber,
  onClosePrestige,
  onPrestige
}) => {
  const [prestigeAnimating, setPrestigeAnimating] = useState(false);

  // Calculate prestige rewards
  const getPrestigeRewards = () => {
    const newPrestigeLevel = Math.floor(gameState.lifetimeTotal / 1000000);
    const newPoints = newPrestigeLevel - gameState.prestigeLevel;
    const newBonus = newPrestigeLevel * 10; // 10% per level
    return { newPoints, newBonus, newLevel: newPrestigeLevel };
  };

  const handlePrestigeClick = () => {
    setPrestigeAnimating(true);
    setTimeout(() => {
      onPrestige();
      setPrestigeAnimating(false);
    }, 1000);
  };

  return (
    <>
      {/* Prestige Modal */}
      {showPrestige && (
        <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-black dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className={`bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl dark:shadow-purple-900/20 max-w-md w-full border border-purple-200 dark:border-purple-800/50 transform transition-all duration-500 ${
            prestigeAnimating ? 'scale-110 rotate-1' : 'scale-100'
          }`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6 text-white rounded-t-2xl relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>
                {prestigeAnimating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 animate-pulse"></div>
                )}
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white bg-opacity-20 dark:bg-white dark:bg-opacity-10 rounded-lg transition-all duration-500 ${
                    prestigeAnimating ? 'animate-spin' : ''
                  }`}>
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Ascend to Greatness</h2>
                    <p className="text-purple-100 dark:text-purple-200 text-sm">Unlock your true potential</p>
                  </div>
                </div>
                {!prestigeAnimating && (
                  <button
                    onClick={onClosePrestige}
                    className="p-2 hover:bg-white hover:bg-opacity-20 dark:hover:bg-white dark:hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Warning */}
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-100 dark:bg-orange-900/40 rounded">
                      <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800 dark:text-orange-300">Reset Warning</h3>
                      <p className="text-sm text-orange-700 dark:text-orange-400">
                        Your current progress will be reset, but you'll gain permanent bonuses!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rewards Preview */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Prestige Rewards
                  </h3>
                  
                  {(() => {
                    const { newPoints, newBonus, newLevel } = getPrestigeRewards();
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Prestige Points</span>
                          <span className="font-bold text-purple-800 dark:text-purple-200">+{newPoints}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">Production Bonus</span>
                          <span className="font-bold text-green-800 dark:text-green-200">+{newBonus}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-lg">
                          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">New Prestige Level</span>
                          <span className="font-bold text-yellow-800 dark:text-yellow-200">{newLevel}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Current Stats */}
                <div className="pt-2 border-t border-purple-100 dark:border-purple-800/30">
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Current Beans:</span>
                      <span>{formatNumber(gameState.coffeeBeans)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lifetime Total:</span>
                      <span>{formatNumber(gameState.lifetimeTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handlePrestigeClick}
                  disabled={!isReady || prestigeAnimating}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                    prestigeAnimating
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-500 dark:to-orange-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 text-white hover:from-purple-700 hover:to-indigo-700 dark:hover:from-purple-600 dark:hover:to-indigo-600 hover:shadow-lg transform hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
                >
                  {prestigeAnimating ? (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Ascending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Star className="w-4 h-4" />
                      Prestige Now
                    </span>
                  )}
                </button>
                {!prestigeAnimating && (
                  <button
                    onClick={onClosePrestige}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};