import React from 'react';
import { Loader2, Star, TrendingUp, Shield, Zap } from 'lucide-react';
import { Icon } from '@iconify/react';
import { UpgradeKey } from '@/types/coffee';
import { UPGRADES } from '@/lib/coffee';

interface UpgradesSectionProps {
  gameState: any;
  gameStats: any;
  isReady: boolean;
  savingProgress: boolean;
  formatNumber: (num: number) => string;
  buyUpgrade: (upgradeKey: UpgradeKey) => void;
}

export const UpgradesSection: React.FC<UpgradesSectionProps> = ({
  gameState,
  gameStats,
  isReady,
  savingProgress,
  formatNumber,
  buyUpgrade
}) => {
  // Map upgrade keys to icons
  const getUpgradeIcon = (key: string) => {
    const iconMap: { [key: string]: string } = {
      doubleProduction: 'mdi:lightning-bolt',
      efficientGrinding: 'mdi:cog',
      premiumBeans: 'mdi:star',
      autoCollect: 'mdi:autorenew',
    };
    return iconMap[key] || 'mdi:arrow-up-bold';
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl shadow-lg border border-amber-200 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Star className="text-lg text-white" />
          <h2 className="text-lg font-bold text-white">Upgrades</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col min-h-0">
        {/* Upgrades Grid */}
        <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100 mb-4">
          {Object.entries(UPGRADES).map(([key, upgrade]) => {
            const upgradeKey = key as UpgradeKey;
            const owned = gameState.upgrades.includes(upgradeKey);
            const canAfford = gameState.coffeeBeans >= upgrade.cost && !owned;
            
            return (
              <div
                key={key}
                className={`
                  group bg-white rounded-lg border transition-all duration-200
                  ${owned 
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' 
                    : canAfford
                      ? 'border-amber-200 hover:border-amber-400 hover:shadow-md'
                      : 'border-gray-200'
                  }
                `}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    {/* Left side: Icon + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${owned
                          ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                          : canAfford
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                            : 'bg-gray-200'
                        }
                      `}>
                        <Icon 
                          icon={getUpgradeIcon(key)} 
                          className={`text-base ${owned || canAfford ? 'text-white' : 'text-gray-500'}`} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 text-sm truncate">
                            {upgrade.name}
                          </h3>
                          {owned && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-700 flex-shrink-0">
                              OWNED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-1 leading-relaxed">
                          {upgrade.description}
                        </p>
                        
                        <div className="text-xs text-amber-600 font-medium">
                          {upgrade.effect}
                        </div>
                      </div>
                    </div>

                    {/* Buy Button */}
                    {!owned && (
                      <button
                        onClick={() => buyUpgrade(upgradeKey)}
                        disabled={!canAfford || !isReady}
                        className={`
                          px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-200
                          flex items-center gap-1 flex-shrink-0 ml-2
                          ${canAfford && isReady
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-sm' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }
                        `}
                      >
                        <Icon icon="openmoji:roasted-coffee-bean" className="text-xs" />
                        {formatNumber(upgrade.cost)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Statistics</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Equipment Value:</span>
              <span className="font-medium text-gray-800">{formatNumber(gameStats.totalValue)} beans</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prestige Bonus:</span>
              <span className="font-medium text-purple-600">+{gameState.prestigeLevel * 10}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upgrades Owned:</span>
              <span className="font-medium text-amber-600">{gameState.upgrades.length}/4</span>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${gameState.isAuthenticated ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className={`text-xs font-medium ${gameState.isAuthenticated ? 'text-green-600' : 'text-yellow-600'}`}>
                  {gameState.isAuthenticated ? 'Cloud Save Active' : 'Local Save Only'}
                </span>
              </div>
              
              {savingProgress && (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                  <span className="text-amber-600 text-xs font-medium">Saving...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span className="text-amber-800 font-medium text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};