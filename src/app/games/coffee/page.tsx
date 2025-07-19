'use client'
import React, { useState } from 'react';
import { Coffee, Star, User, Trophy } from 'lucide-react';
import { EquipmentKey, UpgradeKey } from '@/types/coffee';
import { GAME_CONFIG, EQUIPMENT, UPGRADES } from '@/lib/coffee';
import { useCoffeeGame } from '@/hooks/useCoffeeGame';

const CoffeeBrewIdleGame: React.FC = () => {
  const {
    gameState,
    gameStats,
    authLoading,
    handleClick,
    buyEquipment,
    buyUpgrade,
    canPrestige,
    prestige,
    handleManualSave,
    loadLeaderboard,
    formatNumber
  } = useCoffeeGame();

  // UI state
  const [showPrestige, setShowPrestige] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBest, setUserBest] = useState<any>(null);

  const handleLoadLeaderboard = async () => {
    try {
      const { leaderboard: leaderboardData, userBest: userBestData } = await loadLeaderboard();
      setLeaderboard(leaderboardData);
      setUserBest(userBestData);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Failed to load leaderboard');
    }
  };

  const handlePrestige = () => {
    prestige();
    setShowPrestige(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-xl">Loading Coffee Brew Idle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-2">
              <Coffee className="text-amber-600" />
              Coffee Brew Idle
            </h1>
            
            <div className="flex items-center gap-4">
              {gameState.prestigeLevel > 0 && (
                <div className="flex items-center gap-2 text-purple-600">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">Prestige Level {gameState.prestigeLevel}</span>
                </div>
              )}
              
              {gameState.isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-semibold">
                    {gameState.username || 'Player'}
                  </span>
                  {!gameState.username && (
                    <button
                      onClick={() => setShowProfile(true)}
                      className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Set Username
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">Not authenticated</div>
              )}
              
              <button
                onClick={handleLoadLeaderboard}
                className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </button>
              
              {/* Debug Save Button */}
              <button
                onClick={handleManualSave}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
              >
                Save Now
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-amber-100 rounded-lg p-3">
              <div className="text-sm text-amber-600">Coffee Beans</div>
              <div className="text-xl font-bold text-amber-800">{formatNumber(gameState.coffeeBeans)}</div>
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <div className="text-sm text-green-600">Per Second</div>
              <div className="text-xl font-bold text-green-800">{formatNumber(gameStats.beansPerSecond)}</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3">
              <div className="text-sm text-blue-600">Total Produced</div>
              <div className="text-xl font-bold text-blue-800">{formatNumber(gameState.totalCoffeeProduced)}</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3">
              <div className="text-sm text-purple-600">Prestige Points</div>
              <div className="text-xl font-bold text-purple-800">{gameState.prestigePoints}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coffee Bean Clicker */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-800 mb-4">Bean Production</h2>
            
            <div className="text-center">
              <button
                onClick={handleClick}
                className="w-48 h-48 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-4 flex items-center justify-center"
              >
                <Coffee size={80} className="text-white" />
              </button>
              
              <p className="text-amber-700 mb-2">Click for beans!</p>
              <p className="text-sm text-amber-600">+{gameState.clickPower * (gameState.upgrades.includes('clickPower') ? 2 : 1)} per click</p>
              
              {canPrestige() && (
                <button
                  onClick={() => setShowPrestige(true)}
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Star className="w-4 h-4" />
                  Prestige Available!
                </button>
              )}
            </div>
          </div>

          {/* Equipment */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-800 mb-4">Brewing Equipment</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(EQUIPMENT).map(([key, equipment]) => {
                const equipmentKey = key as EquipmentKey;
                const level = gameState.equipment[equipmentKey];
                const cost = Math.floor(equipment.baseCost * Math.pow(equipment.costMultiplier, level));
                const canAfford = gameState.coffeeBeans >= cost;
                const production = equipment.baseProduction * level;
                
                return (
                  <div key={key} className="bg-amber-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{equipment.icon}</span>
                        <div>
                          <div className="font-semibold text-amber-800">{equipment.name}</div>
                          <div className="text-sm text-amber-600">Level {level}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => buyEquipment(equipmentKey)}
                        disabled={!canAfford}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                          canAfford
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {formatNumber(cost)}
                      </button>
                    </div>
                    <div className="text-sm text-amber-700">
                      {equipment.description}
                    </div>
                    {production > 0 && (
                      <div className="text-sm text-green-600">
                        Producing: {formatNumber(production)}/sec
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upgrades */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-amber-800 mb-4">Upgrades</h2>
            
            <div className="space-y-3">
              {Object.entries(UPGRADES).map(([key, upgrade]) => {
                const upgradeKey = key as UpgradeKey;
                const owned = gameState.upgrades.includes(upgradeKey);
                const canAfford = gameState.coffeeBeans >= upgrade.cost && !owned;
                
                return (
                  <div key={key} className={`rounded-lg p-3 ${owned ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-800">{upgrade.name}</div>
                        <div className="text-sm text-gray-600">{upgrade.description}</div>
                      </div>
                      {!owned && (
                        <button
                          onClick={() => buyUpgrade(upgradeKey)}
                          disabled={!canAfford}
                          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                            canAfford
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {formatNumber(upgrade.cost)}
                        </button>
                      )}
                      {owned && (
                        <span className="text-green-600 font-semibold text-sm">OWNED</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{upgrade.effect}</div>
                  </div>
                );
              })}
            </div>

            {/* Game Stats */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Statistics</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Equipment Value: {formatNumber(gameStats.totalValue)} beans</div>
                <div>Prestige Bonus: +{gameState.prestigeLevel * 10}% production</div>
                <div>Upgrades Owned: {gameState.upgrades.length}/4</div>
                <div className="text-xs pt-2 text-gray-500">
                  {gameState.isAuthenticated ? '✅ Cloud Save Active' : '⚠️ Local Save Only'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-600" />
                Leaderboard
              </h2>
              
              {userBest && (
                <div className="mb-4 p-3 bg-blue-100 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Your Best Score:</h3>
                  <div className="text-sm text-blue-600">
                    Score: {formatNumber(userBest.score)} | Rank: #{userBest.rank || 'Unranked'}
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{entry.rank}</span>
                      <span className="font-semibold">{entry.username}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatNumber(entry.score)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowLeaderboard(false)}
                className="mt-4 w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Prestige Modal */}
        {showPrestige && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                <Star className="text-purple-600" />
                Prestige
              </h2>
              
              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  Reset your progress to gain permanent bonuses!
                </p>
                <p className="text-sm text-gray-600">
                  You will gain {Math.floor(gameState.totalCoffeeProduced / GAME_CONFIG.PRESTIGE_THRESHOLD)} prestige points
                  and +10% permanent production bonus.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={prestige}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Prestige Now
                </button>
                <button
                  onClick={() => setShowPrestige(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeBrewIdleGame;