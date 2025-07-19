import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EquipmentKey, UpgradeKey, GameState, GameStats } from '@/types/coffee';
import { EQUIPMENT, UPGRADES } from '@/lib/coffee';
import { GameScoreService } from '@/hooks/useGameScore';
import { useCurrentUser } from '@/hooks/useAuth';

interface LoadingStates {
  gameLoading: boolean;
  savingProgress: boolean;
  loadingLeaderboard: boolean;
  initializing: boolean;
}

interface GameData {
  coffeeBeans: number;
  totalCoffeeProduced: number;
  lifetimeTotal: number;
  prestigePoints: number;
  prestigeLevel: number;
  clickPower: number;
  equipment: Record<EquipmentKey, number>;
  upgrades: UpgradeKey[];
  lastSave: number;
  isAuthenticated: boolean;
  username: string
  [key: string]: unknown;
}

export const useCoffeeGame = () => {
  const { user, loading: authLoading } = useCurrentUser();
  
  // Memoize gameService to prevent recreating on every render
  const gameService = useMemo(() => new GameScoreService(), []);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    gameLoading: true,
    savingProgress: false,
    loadingLeaderboard: false,
    initializing: true
  });

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    coffeeBeans: 0,
    totalCoffeeProduced: 0,
    lifetimeTotal: 0,
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

  const [gameStats, setGameStats] = useState<GameStats>({
    beansPerSecond: 0,
    totalValue: 0
  });

  // Game loop ref for cleanup
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Use refs to store latest state for intervals
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Calculate production per second - stable function with no dependencies
  const calculateProductionPerSecond = useCallback((state: GameState): number => {
    let production = 0;
    
    Object.entries(state.equipment).forEach(([key, level]) => {
      const equipment = EQUIPMENT[key as EquipmentKey];
      production += equipment.baseProduction * level;
    });
    
    // Apply upgrades using the upgrade definitions
    if (state.upgrades.includes('efficiency')) {
      production *= UPGRADES.efficiency.multiplier || 1.5;
    }
    if (state.upgrades.includes('speedBoost')) {
      production *= UPGRADES.speedBoost.multiplier || 1.8;
    }
    
    // Apply prestige bonus
    production *= (1 + state.prestigeLevel * 0.1);
    
    return production;
  }, []); // No dependencies needed - uses parameters and external constants

  // Format number helper - stable function
  const formatNumber = useCallback((num: number): string => {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
  }, []);

  // Save game progress - stable function with proper dependencies
  // Enhanced saveGameProgress function with detailed error logging
const saveGameProgress = useCallback(async (state: GameState): Promise<boolean> => {
  // Don't save if still initializing
  if (loadingStates.initializing) {
    console.log('Save skipped: Game still initializing');
    return false;
  }

  console.log('Starting save process...');
  setLoadingStates(prev => ({ ...prev, savingProgress: true }));

  try {
    // Always save to localStorage as backup
    try {
      const saveData = JSON.stringify(state);
      localStorage.setItem('coffeeBrewSave', saveData);
      console.log('✅ LocalStorage save successful');
    } catch (localStorageError) {
      console.error('❌ Failed to save to localStorage:', localStorageError);
      // Don't return false here - continue with cloud save attempt
    }

    // If not authenticated, return early
    if (!state.isAuthenticated || !user) {
      console.log('✅ Save completed (localStorage only - not authenticated)');
      return true;
    }

    // Validate user object
    if (!user.username) {
      console.error('❌ User object missing username:', user);
      return false;
    }

    try {
      // Prepare game data
      const gameData: GameData = {
        coffeeBeans: state.coffeeBeans,
        totalCoffeeProduced: state.totalCoffeeProduced,
        lifetimeTotal: state.lifetimeTotal,
        prestigePoints: state.prestigePoints,
        prestigeLevel: state.prestigeLevel,
        clickPower: state.clickPower,
        equipment: state.equipment,
        upgrades: state.upgrades,
        lastSave: Date.now(),
        isAuthenticated: true,
        username: user.username
      };

      // Validate game data
      if (!gameData.coffeeBeans && gameData.coffeeBeans !== 0) {
        console.error('❌ Invalid game data - missing coffeeBeans');
        return false;
      }

      const score = Math.floor(state.lifetimeTotal + (state.prestigePoints * 1000000));
      console.log('Attempting cloud save with score:', score);
      
      // Check if gameService is available
      if (!gameService) {
        console.error('❌ GameService not available');
        return false;
      }

      const result = await gameService.saveScore(
        'coffee-brew-idle',
        score,
        0,
        'completed',
        undefined,
        gameData
      );
      
      if (!result.success) {
        console.error('❌ Supabase save failed:', result.error);
        console.error('Full result object:', result);
        return false;
      }

      console.log('✅ Cloud save successful');
      return true;
      
    } catch (supabaseError) {
      console.error('❌ Supabase save error:', supabaseError);
      // Log more details about the error
      if (supabaseError instanceof Error) {
        console.error('Error message:', supabaseError.message);
        console.error('Error stack:', supabaseError.stack);
      }
      return false;
    }

  } catch (generalError) {
    console.error('❌ General save error:', generalError);
    return false;
  } finally {
    setLoadingStates(prev => ({ ...prev, savingProgress: false }));
  }
}, [gameService, user, loadingStates.initializing]);

  // Start game loop - stable function
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const beansPerSecond = calculateProductionPerSecond(prev);
        const beansThisTick = beansPerSecond * (100 / 1000);
        
        const hasAutoClicker = prev.upgrades.includes('autoClicker');
        const autoClickerBeansPerSecond = hasAutoClicker ? UPGRADES.autoClicker.beansPerSecond || 1 : 0;
        const autoClickBeans = autoClickerBeansPerSecond * (100 / 1000);
        
        const totalNewBeans = beansThisTick + autoClickBeans;
        
        return {
          ...prev,
          coffeeBeans: prev.coffeeBeans + totalNewBeans,
          totalCoffeeProduced: prev.totalCoffeeProduced + totalNewBeans,
          lifetimeTotal: prev.lifetimeTotal + totalNewBeans
        };
      });
    }, 100);
  }, [calculateProductionPerSecond]);

  // Start auto-save - stable function
  const startAutoSave = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
    
    autoSaveIntervalRef.current = setInterval(() => {
      saveGameProgress(gameStateRef.current);
    }, 30000);
  }, [saveGameProgress]);

  // Manual save function
  const handleManualSave = useCallback(async (): Promise<boolean> => {
    return await saveGameProgress(gameStateRef.current);
  }, [saveGameProgress]);

  

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, loadingLeaderboard: true }));
    
    try {
      const leaderboardData = await gameService.getLeaderboard('coffee-brew-idle', 10);
      const userBestData = await gameService.getUserBestScore('coffee-brew-idle');
      
      return { leaderboard: leaderboardData, userBest: userBestData };
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingLeaderboard: false }));
    }
  }, [gameService]);

  // Initialize game - this effect should only run once when auth state changes
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      return;
    }

    const initializeGame = async () => {
      if (authLoading) return;

      console.log('Initializing game...');
      setLoadingStates(prev => ({ ...prev, gameLoading: true, initializing: true }));

      try {
        // Update authentication state
        setGameState(prev => ({
          ...prev,
          isAuthenticated: !!user,
          username: user?.username || null
        }));

        // Load game data
        if (user) {
          try {
            const scores = await gameService.getUserScores('coffee-brew-idle', 1);
            
            if (scores && scores.length > 0) {
              const latestSave = scores[0];
              const savedData = latestSave.game_data as GameData;
              
              if (savedData) {
                const migratedData = {
                  ...savedData,
                  lifetimeTotal: savedData.lifetimeTotal || savedData.totalCoffeeProduced || 0
                };
                
                setGameState(prev => ({
                  ...prev,
                  ...migratedData,
                  lastSave: Date.now(),
                  isAuthenticated: true,
                  username: user.username
                }));
                
                // Calculate offline progress
                const offlineTime = Math.min(
                  (Date.now() - savedData.lastSave) / 1000,
                  12 * 3600
                );
                
                if (offlineTime > 60) {
                  const offlineProduction = calculateProductionPerSecond(savedData) * offlineTime;
                  const offlineBeans = Math.floor(offlineProduction);
                  
                  setGameState(prev => ({
                    ...prev,
                    coffeeBeans: prev.coffeeBeans + offlineBeans,
                    totalCoffeeProduced: prev.totalCoffeeProduced + offlineBeans,
                    lifetimeTotal: prev.lifetimeTotal + offlineBeans
                  }));
                }
              }
            } else {
              // Load from localStorage if no Supabase data
              const saved = localStorage.getItem('coffeeBrewSave');
              if (saved) {
                const savedState = JSON.parse(saved);
                const migratedState = {
                  ...savedState,
                  lifetimeTotal: savedState.lifetimeTotal || savedState.totalCoffeeProduced || 0
                };
                
                setGameState(prev => ({
                  ...prev,
                  ...migratedState,
                  lastSave: Date.now(),
                  isAuthenticated: true,
                  username: user.username
                }));
              }
            }
          } catch (error) {
            console.error('Failed to load from Supabase:', error);
            // Fallback to localStorage
            const saved = localStorage.getItem('coffeeBrewSave');
            if (saved) {
              const savedState = JSON.parse(saved);
              setGameState(prev => ({
                ...prev,
                ...savedState,
                isAuthenticated: true,
                username: user.username
              }));
            }
          }
        } else {
          // Load from localStorage for non-authenticated users
          try {
            const saved = localStorage.getItem('coffeeBrewSave');
            if (saved) {
              const savedState = JSON.parse(saved);
              const migratedState = {
                ...savedState,
                lifetimeTotal: savedState.lifetimeTotal || savedState.totalCoffeeProduced || 0
              };
              
              setGameState(prev => ({
                ...prev,
                ...migratedState,
                lastSave: Date.now(),
                isAuthenticated: false,
                username: null
              }));
            }
          } catch (error) {
            console.error('Failed to load from localStorage:', error);
          }
        }

        // Mark as initialized
        isInitializedRef.current = true;

        // Start game systems
        startGameLoop();
        startAutoSave();

      } catch (error) {
        console.error('Failed to initialize game:', error);
      } finally {
        setLoadingStates(prev => ({ 
          ...prev, 
          gameLoading: false, 
          initializing: false 
        }));
      }
    };

    initializeGame();

    // Cleanup on unmount
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
        autoSaveIntervalRef.current = null;
      }
    };
  }, [authLoading, user?.username]); // Minimal dependencies

  // Calculate stats separately
  useEffect(() => {
    if (loadingStates.initializing) return;

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
  }, [gameState, loadingStates.initializing, calculateProductionPerSecond]);

  const handleClick = (): void => {
    if (loadingStates.initializing) return;

    const clickMultiplier = gameState.upgrades.includes('clickPower') ? 
      (UPGRADES.clickPower.multiplier || 2) : 1;
    const beansToAdd = gameState.clickPower * clickMultiplier;
    
    setGameState(prev => ({
      ...prev,
      coffeeBeans: prev.coffeeBeans + beansToAdd,
      totalCoffeeProduced: prev.totalCoffeeProduced + beansToAdd,
      lifetimeTotal: prev.lifetimeTotal + beansToAdd
    }));
  };

  const buyEquipment = (equipmentKey: EquipmentKey): void => {
    if (loadingStates.initializing) return;

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
    if (loadingStates.initializing) return;

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
    return gameState.lifetimeTotal >= (gameState.prestigeLevel + 1) * 1000000;
  };

  const getPrestigeProgress = () => {
    const currentThreshold = gameState.prestigeLevel * 1000000;
    const nextThreshold = (gameState.prestigeLevel + 1) * 1000000;
    const progress = Math.min(
      ((gameState.lifetimeTotal - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 
      100
    );
    return {
      current: gameState.lifetimeTotal,
      next: nextThreshold,
      progress: Math.max(0, progress)
    };
  };

  const prestige = (): void => {
    if (!canPrestige() || loadingStates.initializing) return;
    
    const newPrestigeLevel = Math.floor(gameState.lifetimeTotal / 1000000);
    
    setGameState(prev => ({
      ...prev,
      coffeeBeans: 0,
      totalCoffeeProduced: 0,
      prestigePoints: prev.prestigePoints + (newPrestigeLevel - prev.prestigeLevel),
      prestigeLevel: newPrestigeLevel,
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
  };

  return {
    // State
    gameState,
    gameStats,
    
    // Loading states
    authLoading,
    gameLoading: loadingStates.gameLoading,
    savingProgress: loadingStates.savingProgress,
    loadingLeaderboard: loadingStates.loadingLeaderboard,
    initializing: loadingStates.initializing,
    isReady: !loadingStates.initializing && !loadingStates.gameLoading,
    
    // Actions
    handleClick,
    buyEquipment,
    buyUpgrade,
    canPrestige,
    prestige,
    handleManualSave,
    loadLeaderboard,
    
    // Utilities
    formatNumber,
    calculateProductionPerSecond,
    getPrestigeProgress
  };
};