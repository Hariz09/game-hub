import React from 'react';
import { Loader2, TrendingUp } from 'lucide-react';
import { Icon } from '@iconify/react';

import { EquipmentKey } from '@/types/coffee';
import { EQUIPMENT } from '@/lib/coffee';
import { GameState } from '@/types/coffee';

interface EquipmentSectionProps {
  gameState: GameState;
  isReady: boolean;
  formatNumber: (num: number) => string;
  buyEquipment: (equipmentKey: EquipmentKey) => void;
}

export const EquipmentSection: React.FC<EquipmentSectionProps> = ({
  gameState,
  isReady,
  formatNumber,
  buyEquipment
}) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg border border-amber-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:coffee" className="text-lg text-white" />
          <h2 className="text-lg font-bold text-white">Equipment</h2>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="p-4 flex-1 flex flex-col min-h-0">
        <div className="grid gap-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-300 dark:scrollbar-thumb-gray-500 scrollbar-track-amber-100 dark:scrollbar-track-gray-700">
          {Object.entries(EQUIPMENT).map(([key, equipment]) => {
            const equipmentKey = key as EquipmentKey;
            const level = gameState.equipment[equipmentKey];
            const cost = Math.floor(equipment.baseCost * Math.pow(equipment.costMultiplier, level));
            const canAfford = gameState.coffeeBeans >= cost;
            const production = equipment.baseProduction * level;
            
            return (
              <div
                key={key}
                className={`
                  group bg-white dark:bg-gray-800 rounded-lg border transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-700/20
                  ${canAfford 
                    ? 'border-amber-200 dark:border-amber-600 hover:border-amber-400 dark:hover:border-amber-500' 
                    : 'border-gray-200 dark:border-gray-600'
                  }
                `}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    {/* Left side: Icon + Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${level > 0 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600' 
                          : 'bg-gray-200 dark:bg-gray-600'
                        }
                      `}>
                        <Icon 
                          icon={equipment.icon} 
                          className={`text-base ${level > 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm truncate">
                            {equipment.name}
                          </h3>
                          <span className={`
                            text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                            ${level > 0 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }
                          `}>
                            Lv.{level}
                          </span>
                        </div>
                        
                        {level > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <TrendingUp className="w-3 h-3" />
                              <span>{formatNumber(production)}/s</span>
                            </div>
                            <span className="text-gray-400 dark:text-gray-500">•</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              Total: {formatNumber(production * level)}/s
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Buy Button */}
                    <button
                      onClick={() => buyEquipment(equipmentKey)}
                      disabled={!canAfford || !isReady}
                      className={`
                        px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-200
                        flex items-center gap-1 flex-shrink-0 ml-2
                        ${canAfford && isReady
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 hover:shadow-sm' 
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      <Icon icon="openmoji:roasted-coffee-bean" className="text-xs" />
                      {formatNumber(cost)}
                    </button>
                  </div>
                  
                  {/* Equipment Description */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {equipment.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading Overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-200 font-medium text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};