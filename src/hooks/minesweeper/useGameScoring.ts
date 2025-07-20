// hooks/minesweeper/useGameScoring
import { useState, useEffect } from 'react';
import { GameScoreService } from '@/hooks/useGameScore';

export const useGameScoring = () => {
  const [gameScoreService] = useState(() => new GameScoreService());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBestScore, setUserBestScore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      const data = await gameScoreService.getLeaderboard('minesweeper', 10);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserBestScore = async () => {
    try {
      const bestScore = await gameScoreService.getUserBestScore('minesweeper');
      setUserBestScore(bestScore);
    } catch (error) {
      console.error('Error loading user best score:', error);
    }
  };

  const saveGameScore = async (
    score: number,
    moves: number,
    status: 'completed' | 'game_over' | 'won',
    durationSeconds: number,
    gameData: any
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