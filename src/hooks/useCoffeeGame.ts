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
    lifetimeTotal: 0, // New: tracks total across all prestiges
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

  // Use refs to store latest state for intervals
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Calculate production per second
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
  }, []);

  // Format number helper
  const formatNumber = useCallback((num: number): string => {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
  }, []);

  // Load from localStorage fallback
  const loadFromLocalStorage = useCallback(async (): Promise<void> => {
    try {
      const saved = localStorage.getItem('coffeeBrewSave');
      if (saved) {
        const savedState = JSON.parse(saved);
        
        // Migrate old saves that don't have lifetimeTotal
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
        
        // Calculate offline progress
        const offlineTime = Math.min(
          (Date.now() - savedState.lastSave) / 1000,
          12 * 3600 // 12 hours cap
        );
        
        if (offlineTime > 60) {
          const offlineProduction = calculateProductionPerSecond(savedState) * offlineTime;
          const offlineBeans = Math.floor(offlineProduction);
          
          setGameState(prev => ({
            ...prev,
            coffeeBeans: prev.coffeeBeans + offlineBeans,
            totalCoffeeProduced: prev.totalCoffeeProduced + offlineBeans,
            lifetimeTotal: prev.lifetimeTotal + offlineBeans
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }, [calculateProductionPerSecond]);

  // Save game progress to Supabase or localStorage
  const saveGameProgress = useCallback(async (state: GameState): Promise<boolean> => {
    // Don't save if still initializing
    if (loadingStates.initializing) {
      return false;
    }

    setLoadingStates(prev => ({ ...prev, savingProgress: true }));

    try {
      // Always save to localStorage as backup
      try {
        localStorage.setItem('coffeeBrewSave', JSON.stringify(state));
      } catch (localStorageError) {
        console.error('Failed to save to localStorage:', localStorageError);
      }

      // If not authenticated, return early
      if (!state.isAuthenticated || !user) {
        return true; // localStorage save succeeded
      }

      try {
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

        // Calculate a score based on lifetime total and prestige
        const score = Math.floor(state.lifetimeTotal + (state.prestigePoints * 1000000));
        
        const result = await gameService.saveScore(
          'coffee-brew-idle',
          score,
          0, // moves not applicable for idle games
          'completed',
          undefined,
          gameData
        );
        
        if (!result.success) {
          console.error('Supabase save failed:', result.error);
          return false;
        }

        return true;
        
      } catch (supabaseError) {
        console.error('Supabase save error:', supabaseError);
        return false;
      }

    } finally {
      setLoadingStates(prev => ({ ...prev, savingProgress: false }));
    }
  }, [gameService, user, loadingStates.initializing]);

  // Load game progress from Supabase
  const loadGameProgress = useCallback(async (): Promise<void> => {
    if (!user) {
      await loadFromLocalStorage();
      return;
    }

    try {
      const scores = await gameService.getUserScores('coffee-brew-idle', 1);
      
      if (scores && scores.length > 0) {
        const latestSave = scores[0];
        const savedData = latestSave.game_data as GameData;
        
        if (savedData) {
          // Migrate old saves that don't have lifetimeTotal
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
            12 * 3600 // 12 hours cap
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
          
          return;
        }
      }
      
      await loadFromLocalStorage();
      
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
      await loadFromLocalStorage();
    }
  }, [gameService, loadFromLocalStorage, user, calculateProductionPerSecond]);

  // Start game loop
  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const beansPerSecond = calculateProductionPerSecond(prev);
        const beansThisTick = beansPerSecond * (100 / 1000); // 100ms tick rate
        
        // Auto-clicker
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
    }, 100); // 100ms tick rate
  }, [calculateProductionPerSecond]);

  // Start auto-save
  const startAutoSave = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
    
    autoSaveIntervalRef.current = setInterval(() => {
      saveGameProgress(gameStateRef.current);
    }, 30000); // 30 seconds
  }, [saveGameProgress]);

  // Manual save function
  const handleManualSave = useCallback(async (): Promise<boolean> => {
    return await saveGameProgress(gameStateRef.current);
  }, [saveGameProgress]);

  // Load leaderboard with loading state
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

  // Initialize game when auth state is ready
  useEffect(() => {
    const initializeGame = async () => {
      if (authLoading) return; // Wait for auth to complete

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
          await loadGameProgress();
        } else {
          await loadFromLocalStorage();
        }

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

    // Cleanup on unmount or re-initialization
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
  }, [user, authLoading, loadFromLocalStorage, loadGameProgress, startAutoSave, startGameLoop]);

  // Calculate stats with loading state consideration
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
    return gameState.lifetimeTotal >= (gameState.prestigeLevel + 1) * 1000000; // Next million threshold
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
      // lifetimeTotal stays the same!
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