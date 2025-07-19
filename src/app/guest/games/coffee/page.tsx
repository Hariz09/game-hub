'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coffee, Star, User, Trophy } from 'lucide-react';
import { EquipmentKey, UpgradeKey, GameState, GameStats } from '@/types/coffee';
import { GAME_CONFIG, EQUIPMENT, UPGRADES } from '@/lib/coffee';
import { GameScoreService } from '@/hooks/useGameScore';

const CoffeeBrewIdleGame: React.FC = () => {
  // Initialize GameScoreService
  const gameService = new GameScoreService();
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    coffeeBeans: 0,
    totalCoffeeProduced: 0,
    prestigePoints: 0,
    prestigeLevel: 0,
    clickPower: 1,
    equipment: {
      manualGrinder: 1,
      dripCoffee: 0,
      espressoMachine: 0,
      frenchPress: 0,
      coldBrew: 0,
      roaster: 0,
      plantation: 0
    },
    upgrades: [],
    lastSave: Date.now(),
    isAuthenticated: false,
    username: null
  });

  const [currentTab, setCurrentTab] = useState<string>('brewing');
  const [showPrestige, setShowPrestige] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBest, setUserBest] = useState<any>(null);
  const [gameStats, setGameStats] = useState<GameStats>({
    beansPerSecond: 0,
    totalValue: 0
  });

  // Use refs to store latest state for intervals
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      console.log('🔐 Checking authentication...');
      const isAuth = await gameService.isUserAuthenticated();
      console.log('🔐 Authentication status:', isAuth);
      
      if (isAuth) {
        const profile = await gameService.getUserProfile();
        console.log('👤 User profile:', profile);
        
        setGameState(prev => ({
          ...prev,
          isAuthenticated: true,
          username: profile?.username || null
        }));
        
        // Load game progress if authenticated
        await loadGameProgress();
      } else {
        console.log('⚠️ User not authenticated, loading from localStorage');
        loadFromLocalStorage();
      }
    };
    
    checkAuth();
  }, []);

  // Load from localStorage fallback
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('coffeeBrewSave');
      if (saved) {
        const savedState = JSON.parse(saved);
        console.log('📱 Loaded from localStorage:', savedState);
        
        setGameState(prev => ({
          ...prev,
          ...savedState,
          lastSave: Date.now(),
          isAuthenticated: false // Ensure this is false for local storage
        }));
        
        // Calculate offline progress
        const offlineTime = Math.min(
          (Date.now() - savedState.lastSave) / 1000,
          12 * 3600 // 12 hours cap
        );
        
        if (offlineTime > 60) {
          const offlineProduction = calculateProductionPerSecond(savedState) * offlineTime;
          setGameState(prev => ({
            ...prev,
            coffeeBeans: prev.coffeeBeans + Math.floor(offlineProduction),
            totalCoffeeProduced: prev.totalCoffeeProduced + Math.floor(offlineProduction)
          }));
          
          alert(`Welcome back! You produced ${formatNumber(Math.floor(offlineProduction))} beans while away!`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
    }
  }, []);

  // Save game progress to Supabase or localStorage
  const saveGameProgress = useCallback(async (state: GameState): Promise<void> => {
    console.log('💾 saveGameProgress called:', {
      isAuthenticated: state.isAuthenticated,
      username: state.username,
      coffeeBeans: Math.floor(state.coffeeBeans),
      totalProduced: Math.floor(state.totalCoffeeProduced)
    });

    // Always save to localStorage as backup
    try {
      localStorage.setItem('coffeeBrewSave', JSON.stringify(state));
      console.log('💾 Saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }

    // If not authenticated, return early
    if (!state.isAuthenticated) {
      console.log('⚠️ User not authenticated, skipping Supabase save');
      return;
    }

    try {
      console.log('☁️ Attempting to save to Supabase...');
      
      const gameData = {
        coffeeBeans: state.coffeeBeans,
        totalCoffeeProduced: state.totalCoffeeProduced,
        prestigePoints: state.prestigePoints,
        prestigeLevel: state.prestigeLevel,
        clickPower: state.clickPower,
        equipment: state.equipment,
        upgrades: state.upgrades,
        lastSave: Date.now()
      };

      // Calculate a score based on total production and prestige
      const score = Math.floor(state.totalCoffeeProduced + (state.prestigePoints * 1000000));
      
      console.log('📊 Saving score:', score, 'with game data keys:', Object.keys(gameData));
      
      const result = await gameService.saveScore(
        'coffee-brew-idle',
        score,
        0, // moves not applicable for idle games
        'completed',
        undefined,
        gameData
      );
      
      console.log('☁️ Supabase save result:', result);
      
      if (!result.success) {
        console.error('❌ Supabase save failed:', result.error);
      }
      
    } catch (error) {
      console.error('❌ Supabase save error:', error);
    }
  }, [gameService]);

  // Load game progress from Supabase
  const loadGameProgress = useCallback(async (): Promise<void> => {
    try {
      console.log('📥 Loading game progress from Supabase...');
      const scores = await gameService.getUserScores('coffee-brew-idle', 1);
      
      if (scores && scores.length > 0) {
        console.log('📥 Found saved game data:', scores[0]);
        const latestSave = scores[0];
        const savedData = latestSave.game_data as any;
        
        if (savedData) {
          setGameState(prev => ({
            ...prev,
            ...savedData,
            lastSave: Date.now(),
            isAuthenticated: true // Ensure this is true when loading from Supabase
          }));
          
          // Calculate offline progress
          const offlineTime = Math.min(
            (Date.now() - savedData.lastSave) / 1000,
            12 * 3600 // 12 hours cap
          );
          
          if (offlineTime > 60) {
            const offlineProduction = calculateProductionPerSecond(savedData) * offlineTime;
            setGameState(prev => ({
              ...prev,
              coffeeBeans: prev.coffeeBeans + Math.floor(offlineProduction),
              totalCoffeeProduced: prev.totalCoffeeProduced + Math.floor(offlineProduction)
            }));
            
            alert(`Welcome back! You produced ${formatNumber(Math.floor(offlineProduction))} beans while away!`);
          }
          
          console.log('✅ Game progress loaded from Supabase');
          return;
        }
      }
      
      console.log('📥 No Supabase data found, trying localStorage...');
      loadFromLocalStorage();
      
    } catch (error) {
      console.error('❌ Failed to load from Supabase:', error);
      loadFromLocalStorage();
    }
  }, [gameService, loadFromLocalStorage]);

  // Manual save function for testing
  const handleManualSave = useCallback(() => {
    console.log('🔧 Manual save triggered');
    saveGameProgress(gameStateRef.current);
  }, [saveGameProgress]);

  // Auto-save every 30 seconds
  useEffect(() => {
    console.log('⏰ Setting up auto-save interval (30 seconds)');
    
    const interval = setInterval(() => {
      console.log('⏰ Auto-save triggered');
      saveGameProgress(gameStateRef.current);
    }, 30000); // 30 seconds
    
    return () => {
      console.log('🧹 Cleaning up auto-save interval');
      clearInterval(interval);
    };
  }, [saveGameProgress]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const beansPerSecond = calculateProductionPerSecond(prev);
        const beansThisTick = beansPerSecond * (100 / 1000); // 100ms tick rate
        
        // Auto-clicker
        const hasAutoClicker = prev.upgrades.includes('autoClicker');
        const autoClickBeans = hasAutoClicker ? prev.clickPower * (100 / 1000) : 0;
        
        const totalNewBeans = beansThisTick + autoClickBeans;
        
        return {
          ...prev,
          coffeeBeans: prev.coffeeBeans + totalNewBeans,
          totalCoffeeProduced: prev.totalCoffeeProduced + totalNewBeans
        };
      });
    }, 100); // 100ms tick rate

    return () => clearInterval(gameLoop);
  }, []);

  // Calculate stats
  useEffect(() => {
    const beansPerSecond = calculateProductionPerSecond(gameState);
    const totalValue = Object.entries(gameState.equipment).reduce((sum, [key, level]) => {
      const equipment = EQUIPMENT[key as EquipmentKey];
      let totalCost = 0;
      for (let i = 0; i < level; i++) {
        totalCost += Math.floor(equipment.baseCost * Math.pow(equipment.costMultiplier, i));
      }
      return sum + totalCost;
    }, 0);

    setGameStats({ beansPerSecond, totalValue });
  }, [gameState]);

  // Load leaderboard
  const loadLeaderboard = async () => {
    try {
      console.log('🏆 Loading leaderboard...');
      const leaderboardData = await gameService.getLeaderboard('coffee-brew-idle', 10);
      const userBestData = await gameService.getUserBestScore('coffee-brew-idle');
      console.log('🏆 Leaderboard loaded:', leaderboardData);
      setLeaderboard(leaderboardData);
      setUserBest(userBestData);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('❌ Failed to load leaderboard:', error);
    }
  };

  // Create or update profile
  const handleCreateProfile = async () => {
    if (!newUsername.trim()) return;
    
    try {
      console.log('👤 Creating profile:', newUsername.trim());
      const result = await gameService.createOrUpdateProfile(newUsername.trim());
      if (result.success) {
        setGameState(prev => ({
          ...prev,
          username: newUsername.trim()
        }));
        setShowProfile(false);
        setNewUsername('');
        
        console.log('✅ Profile created, reloading game progress');
        // Reload game progress after creating profile
        await loadGameProgress();
      } else {
        alert(result.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('❌ Error creating profile:', error);
      alert('Failed to create profile');
    }
  };

  const calculateProductionPerSecond = (state: GameState): number => {
    let production = 0;
    
    Object.entries(state.equipment).forEach(([key, level]) => {
      const equipment = EQUIPMENT[key as EquipmentKey];
      production += equipment.baseProduction * level;
    });
    
    // Apply upgrades
    if (state.upgrades.includes('efficiency')) {
      production *= 1.5;
    }
    if (state.upgrades.includes('speedBoost')) {
      production *= 1.25;
    }
    
    // Apply prestige bonus
    production *= (1 + state.prestigeLevel * 0.1);
    
    return production;
  };

  const handleClick = (): void => {
    const beansToAdd = gameState.clickPower * (gameState.upgrades.includes('clickPower') ? 2 : 1);
    setGameState(prev => ({
      ...prev,
      coffeeBeans: prev.coffeeBeans + beansToAdd,
      totalCoffeeProduced: prev.totalCoffeeProduced + beansToAdd
    }));
  };

  const buyEquipment = (equipmentKey: EquipmentKey): void => {
    const equipment = EQUIPMENT[equipmentKey];
    const currentLevel = gameState.equipment[equipmentKey];
    const cost = Math.floor(equipment.baseCost * Math.pow(equipment.costMultiplier, currentLevel));
    
    if (gameState.coffeeBeans >= cost) {
      setGameState(prev => ({
        ...prev,
        coffeeBeans: prev.coffeeBeans - cost,
        equipment: {
          ...prev.equipment,
          [equipmentKey]: prev.equipment[equipmentKey] + 1
        }
      }));
    }
  };

  const buyUpgrade = (upgradeKey: UpgradeKey): void => {
    const upgrade = UPGRADES[upgradeKey];
    
    if (gameState.coffeeBeans >= upgrade.cost && !gameState.upgrades.includes(upgradeKey)) {
      setGameState(prev => ({
        ...prev,
        coffeeBeans: prev.coffeeBeans - upgrade.cost,
        upgrades: [...prev.upgrades, upgradeKey]
      }));
    }
  };

  const canPrestige = (): boolean => {
    return gameState.totalCoffeeProduced >= 1000000; // 1M threshold
  };

  const prestige = (): void => {
    if (!canPrestige()) return;
    
    const prestigePointsGained = Math.floor(gameState.totalCoffeeProduced / 1000000);
    
    setGameState(prev => ({
      ...prev,
      coffeeBeans: 0,
      totalCoffeeProduced: 0,
      prestigePoints: prev.prestigePoints + prestigePointsGained,
      prestigeLevel: prev.prestigeLevel + 1,
      equipment: {
        manualGrinder: 1,
        dripCoffee: 0,
        espressoMachine: 0,
        frenchPress: 0,
        coldBrew: 0,
        roaster: 0,
        plantation: 0
      },
      upgrades: []
    }));
    
    setShowPrestige(false);
  };

  const formatNumber = (num: number): string => {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
  };

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
                onClick={loadLeaderboard}
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

        {/* Profile Modal */}
        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                <User className="text-blue-600" />
                Set Username
              </h2>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={50}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCreateProfile}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Username
                </button>
                <button
                  onClick={() => setShowProfile(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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