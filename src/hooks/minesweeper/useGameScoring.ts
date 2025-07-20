// hooks/minesweeper/useGameScoring.ts
import { useState, useEffect, useCallback } from 'react';
import { GameScoreService, UserProfile, LeaderboardEntry, UserBestScore } from '@/hooks/useGameScore';

// Define the game data type for minesweeper
interface MinesweeperGameData {
  gridSize: string;
  mineCount: number;
  firstClickTime?: number;
  [key: string]: unknown;
}

export const useGameScoring = () => {
  const [gameScoreService] = useState(() => new GameScoreService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userBestScore, setUserBestScore] = useState<UserBestScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await gameScoreService.getLeaderboard('minesweeper', 10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [gameScoreService]);

  const loadUserBestScore = useCallback(async () => {
    try {
      const bestScore = await gameScoreService.getUserBestScore('minesweeper');
      setUserBestScore(bestScore);
    } catch (error) {
      console.error('Error loading user best score:', error);
    }
  }, [gameScoreService]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await gameScoreService.isUserAuthenticated();
      setIsAuthenticated(authenticated);
     
      if (authenticated) {
        const profile = await gameScoreService.getUserProfile();
        setUserProfile(profile);
        loadUserBestScore();
        loadLeaderboard();
      }
    };
    checkAuth();
  }, [gameScoreService, loadLeaderboard, loadUserBestScore]);

  const saveGameScore = async (
    score: number,
    moves: number,
    status: 'completed' | 'game_over' | 'won',
    durationSeconds: number,
    gameData: MinesweeperGameData
  ) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping score save');
      return { success: false, error: 'Not authenticated' };
    }

    try {
      setIsLoading(true);
      const result = await gameScoreService.saveScore(
        'minesweeper',
        score,
        moves,
        status,
        durationSeconds,
        gameData
      );

      if (result.success) {
        // Refresh leaderboard and best score after saving
        await loadLeaderboard();
        await loadUserBestScore();
      }

      return result;
    } catch (error) {
      console.error('Error saving game score:', error);
      return { success: false, error: 'Failed to save score' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    userProfile,
    leaderboard,
    userBestScore,
    isLoading,
    saveGameScore,
    loadLeaderboard,
    loadUserBestScore,
    gameScoreService
  };
};