import { useState, useEffect, useCallback, useRef } from 'react';
import { EquipmentKey, UpgradeKey, GameState, GameStats } from '@/types/coffee';
import { GAME_CONFIG, EQUIPMENT, UPGRADES } from '@/lib/coffee';
import { GameScoreService } from '@/hooks/useGameScore';
import { useCurrentUser } from '@/hooks/useAuth';

interface LoadingStates {
  gameLoading: boolean;
  savingProgress: boolean;
  loadingLeaderboard: boolean;
  initializing: boolean;
}

export const useCoffeeGame = () => {
  const { user, loading: authLoading } = useCurrentUser();
  const gameService = new GameScoreService();
  
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
        console.error('❌ Failed to initialize game:', error);
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
  }, [user, authLoading]);

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
        const autoClickBeans = hasAutoClicker ? prev.clickPower * (100 / 1000) : 0;
        
        const totalNewBeans = beansThisTick + autoClickBeans;
        
        return {
          ...prev,
          coffeeBeans: prev.coffeeBeans + totalNewBeans,
          totalCoffeeProduced: prev.totalCoffeeProduced + totalNewBeans
        };
      });
    }, 100); // 100ms tick rate
  }, []);

  // Start auto-save
  const startAutoSave = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }

    console.log('⏰ Setting up auto-save interval (30 seconds)');
    
    autoSaveIntervalRef.current = setInterval(() => {
      console.log('⏰ Auto-save triggered');
      saveGameProgress(gameStateRef.current);
    }, 30000); // 30 seconds
  }, []);

  // Load from localStorage fallback
  const loadFromLocalStorage = useCallback(async (): Promise<void> => {
    try {
      const saved = localStorage.getItem('coffeeBrewSave');
      if (saved) {
        const savedState = JSON.parse(saved);
        console.log('📱 Loaded from localStorage:', savedState);
        
        setGameState(prev => ({
          ...prev,
          ...savedState,
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
            totalCoffeeProduced: prev.totalCoffeeProduced + offlineBeans
          }));
          
          // Don't show alert during loading - let the component handle notifications
          console.log(`📈 Offline progress: ${formatNumber(offlineBeans)} beans produced`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
    }
  }, []);

  // Save game progress to Supabase or localStorage
  const saveGameProgress = useCallback(async (state: GameState): Promise<boolean> => {
    // Don't save if still initializing
    if (loadingStates.initializing) {
      return false;
    }

    setLoadingStates(prev => ({ ...prev, savingProgress: true }));

    try {
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
      } catch (localStorageError) {
        console.error('❌ Failed to save to localStorage:', localStorageError);
      }

      // If not authenticated, return early
      if (!state.isAuthenticated || !user) {
        console.log('⚠️ User not authenticated, skipping Supabase save');
        return true; // localStorage save succeeded
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
          return false;
        }

        return true;
        
      } catch (supabaseError) {
        console.error('❌ Supabase save error:', supabaseError);
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
              totalCoffeeProduced: prev.totalCoffeeProduced + offlineBeans
            }));
            
            console.log(`📈 Offline progress: ${formatNumber(offlineBeans)} beans produced`);
          }
          
          console.log('✅ Game progress loaded from Supabase');
          return;
        }
      }
      
      console.log('📥 No Supabase data found, trying localStorage...');
      await loadFromLocalStorage();
      
    } catch (error) {
      console.error('❌ Failed to load from Supabase:', error);
      await loadFromLocalStorage();
    }
  }, [gameService, loadFromLocalStorage, user]);

  // Manual save function
  const handleManualSave = useCallback(async (): Promise<boolean> => {
    console.log('🔧 Manual save triggered');
    return await saveGameProgress(gameStateRef.current);
  }, [saveGameProgress]);

  // Load leaderboard with loading state
  const loadLeaderboard = useCallback(async () => {
    setLoadingStates(prev => ({ ...prev, loadingLeaderboard: true }));
    
    try {
      console.log('🏆 Loading leaderboard...');
      const leaderboardData = await gameService.getLeaderboard('coffee-brew-idle', 10);
      const userBestData = await gameService.getUserBestScore('coffee-brew-idle');
      console.log('🏆 Leaderboard loaded:', leaderboardData);
      
      return { leaderboard: leaderboardData, userBest: userBestData };
    } catch (error) {
      console.error('❌ Failed to load leaderboard:', error);
      throw error;
    } finally {
      setLoadingStates(prev => ({ ...prev, loadingLeaderboard: false }));
    }
  }, [gameService]);

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
  }, [gameState, loadingStates.initializing]);

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
    if (loadingStates.initializing) return;

    const beansToAdd = gameState.clickPower * (gameState.upgrades.includes('clickPower') ? 2 : 1);
    setGameState(prev => ({
      ...prev,
      coffeeBeans: prev.coffeeBeans + beansToAdd,
      totalCoffeeProduced: prev.totalCoffeeProduced + beansToAdd
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
    return gameState.totalCoffeeProduced >= 1000000; // 1M threshold
  };

  const prestige = (): void => {
    if (!canPrestige() || loadingStates.initializing) return;
    
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
  };

  const formatNumber = (num: number): string => {
    if (num < 1000) return Math.floor(num).toString();
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B';
    return (num / 1000000000000).toFixed(1) + 'T';
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
    calculateProductionPerSecond
  };
};