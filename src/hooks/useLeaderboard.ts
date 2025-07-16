import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  total_score: number;
  games_played: number;
  games_won: number;
  total_moves: number;
  avg_score: number;
  best_single_score: number;
  user_id: string;
}

export const useLeaderboard = (initialLimit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);

  const supabase = createClient();

  const fetchLeaderboard = useCallback(async (newLimit: number = limit) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .rpc('get_overall_leaderboard', { p_limit: newLimit });

      if (error) {
        throw error;
      }

      setLeaderboard(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit, supabase]); // dependency yang digunakan di dalam fetchLeaderboard

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    fetchLeaderboard(newLimit);
  };

  const refetch = () => {
    fetchLeaderboard();
  };

  return {
    leaderboard,
    loading,
    error,
    limit,
    handleLimitChange,
    refetch
  };
};
