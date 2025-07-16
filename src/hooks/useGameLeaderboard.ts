import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface GameLeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  moves: number;
  status: string;
  duration_seconds: number;
  created_at: string;
}

export interface Game {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export const useGameLeaderboard = (gameName: string, initialLimit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<GameLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(initialLimit);

  const supabase = createClient();

  const fetchLeaderboard = useCallback(async (newLimit: number = limit) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_game_leaderboard', {
        p_game_name: gameName,
        p_limit: newLimit,
      });

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit, gameName, supabase]);

  useEffect(() => {
    if (gameName) {
      fetchLeaderboard();
    }
  }, [gameName, fetchLeaderboard]);

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

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setGames(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return {
    games,
    loading,
    error,
    refetch: fetchGames
  };
};
