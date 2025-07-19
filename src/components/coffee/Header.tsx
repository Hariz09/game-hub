import React from 'react';
import { Icon } from '@iconify/react';

interface GameHeaderProps {
  gameState: any;
  gameStats: any;
  savingProgress: boolean;
  isReady: boolean;
  saveStatus: string;
  formatNumber: (num: number) => string;
  onManualSave: () => void;
  onShowProfile: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  gameState,
  gameStats,
  savingProgress,
  isReady,
  saveStatus,
  formatNumber,
  onManualSave,
  onShowProfile
}) => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  
  return (
    <div className="relative overflow-hidden mb-4 sm:mb-8">
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-90"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20"></div>
      
      <div className="relative bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-6 lg:p-8">
        
        {/* Mobile Header Row */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          {/* Logo and Title - Responsive */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <Icon icon="openmoji:roasted-coffee-bean" className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-none">
                Coffee Brew
              </h1>
              <p className="text-xs text-gray-600 font-medium mt-0.5 hidden sm:block">Build your coffee empire</p>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 bg-white/80 rounded-xl shadow-md border border-gray-200 hover:bg-white transition-colors"
            >
              <Icon icon="material-symbols:menu" className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Desktop Controls - Hidden on Mobile */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-4">
            {/* Prestige Badge */}
            {gameState?.prestigeLevel > 0 && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-2 rounded-xl shadow-lg">
                <Icon icon="material-symbols:star" className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="font-bold text-sm lg:text-base">Lv.{gameState.prestigeLevel}</span>
              </div>
            )}
            
            {/* User Status */}
            <div className="flex items-center">
              {gameState?.isAuthenticated ? (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-xl border border-green-200">
                  <Icon icon="material-symbols:shield" className="w-4 h-4" />
                  <span className="font-semibold text-sm">{gameState.username || 'Player'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-xl border border-yellow-200">
                  <Icon icon="material-symbols:person" className="w-4 h-4" />
                  <span className="text-sm font-medium">Guest</span>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onManualSave}
                disabled={savingProgress || !isReady}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                {savingProgress ? (
                  <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                ) : (
                  <Icon icon="material-symbols:save" className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Expandable Menu */}
        {showMobileMenu && (
          <div className="sm:hidden mb-4 bg-white/90 backdrop-blur rounded-xl border border-gray-200 shadow-lg p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Prestige Level */}
            {gameState?.prestigeLevel > 0 && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl shadow-md">
                <Icon icon="material-symbols:star" className="w-5 h-5" />
                <span className="font-bold">Prestige Level {gameState.prestigeLevel}</span>
              </div>
            )}
            
            {/* Mobile User Status */}
            {gameState?.isAuthenticated ? (
              <div className="flex items-center justify-between bg-green-100 text-green-800 px-4 py-3 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <Icon icon="material-symbols:shield" className="w-5 h-5" />
                  <span className="font-semibold">{gameState.username || 'Player'}</span>
                </div>
                {!gameState?.username && (
                  <button
                    onClick={() => {
                      onShowProfile();
                      setShowMobileMenu(false);
                    }}
                    className="text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Set Name
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-xl border border-yellow-200">
                <Icon icon="material-symbols:person" className="w-5 h-5" />
                <span className="font-medium">Guest Mode</span>
              </div>
            )}
            
            {/* Mobile Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onManualSave();
                  setShowMobileMenu(false);
                }}
                disabled={savingProgress || !isReady}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md font-semibold"
              >
                {savingProgress ? (
                  <Icon icon="line-md:loading-loop" className="w-4 h-4" />
                ) : (
                  <Icon icon="material-symbols:save" className="w-4 h-4" />
                )}
                <span className="text-sm">Save Game</span>
              </button>
            </div>
          </div>
        )}
        
        {/* Stats Grid - Mobile First Design */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
          {/* Coffee Beans - Primary stat */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-3 sm:p-4 lg:p-5 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-semibold text-amber-700">Coffee Beans</div>
                <Icon icon="openmoji:roasted-coffee-bean" className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-amber-900 leading-tight">
                {formatNumber(gameState?.coffeeBeans || 0)}
              </div>
              <div className="text-xs text-amber-600 mt-0.5 sm:mt-1">Current resources</div>
            </div>
          </div>
          
          {/* Production Rate */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3 sm:p-4 lg:p-5 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-semibold text-green-700">Beans / Second</div>
                <Icon icon="fluent-emoji:factory" className="w-4 h-4 sm:w-5 sm:h-5"/>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-green-900 leading-tight">
                {formatNumber(gameStats?.beansPerSecond || 0)}/s
              </div>
              <div className="text-xs text-green-600 mt-0.5 sm:mt-1">Auto income</div>
            </div>
          </div>
          
          {/* Current Run Production */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl p-3 sm:p-4 lg:p-5 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-semibold text-cyan-700">Current Run</div>
                <Icon icon="devicon:cloudrun" className="w-4 h-4 sm:w-5 sm:h-5"/>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-cyan-900 leading-tight">
                {formatNumber(gameState?.totalCoffeeProduced || 0)}
              </div>
              <div className="text-xs text-cyan-600 mt-0.5 sm:mt-1">Beans produced</div>
            </div>
          </div>
          
          {/* Lifetime Total */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3 sm:p-4 lg:p-5 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-semibold text-blue-700">Lifetime Total</div>
                <Icon icon="lucide:sigma" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-blue-900 leading-tight">
                {formatNumber(gameState?.lifetimeTotal || 0)}
              </div>
              <div className="text-xs text-blue-600 mt-0.5 sm:mt-1">Cumulative Bean Production</div>
            </div>
          </div>
          
          {/* Prestige Points */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-3 sm:p-4 lg:p-5 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 h-full">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs sm:text-sm font-semibold text-purple-700">Prestige Points</div>
                <Icon icon="material-symbols:star" className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-black text-purple-900 leading-tight">
                {gameState?.prestigePoints || 0}
              </div>
              <div className="text-xs text-purple-600 mt-0.5 sm:mt-1">Bonus multiplier</div>
            </div>
          </div>
        </div>
        
        {/* Save Status Bar - Compact Design */}
        {(saveStatus || gameState?.isAuthenticated) && (
          <div className="flex items-center justify-between mt-3 sm:mt-6 bg-gray-50/80 backdrop-blur rounded-xl p-3 border border-gray-200">
            <div className="flex items-center gap-2">
              <Icon icon="material-symbols:cloud" className={`w-4 h-4 ${gameState?.isAuthenticated ? 'text-green-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">
                {gameState?.isAuthenticated ? 'Cloud Save Active' : 'Local Save Only'}
              </span>
            </div>
            {saveStatus && (
              <div className={`text-xs font-medium px-3 py-1 rounded-full ${
                saveStatus.includes('failed') 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                {saveStatus}
              </div>
            )}
          </div>
        )}
        
        {/* Loading Overlay */}
        {!isReady && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl flex items-center justify-center p-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 text-amber-600 text-center sm:text-left">
              <Icon icon="line-md:loading-loop" className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">Initializing Coffee Empire</div>
                <div className="text-sm text-gray-600">Setting up your brewing stations...</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};