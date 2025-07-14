import { createClient } from '@/lib/supabase/client'

export interface GameScore {
  id: string
  user_id: string
  game_id: string
  score: number
  moves: number
  status: 'completed' | 'game_over' | 'won'
  duration_seconds?: number
  game_data?: unknown
  created_at: string
  updated_at: string
}

export interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  moves: number
  status: string
  duration_seconds?: number
  created_at: string
}

export interface UserBestScore {
  username: string
  score: number
  moves: number
  status: string
  duration_seconds?: number
  created_at: string
}

export interface UserProfile {
  id: string
  username: string
  created_at: string
  updated_at: string
}

export class GameScoreService {
  private supabase = createClient()

  async saveScore(
    gameName: string,
    score: number,
    moves: number,
    status: 'completed' | 'game_over' | 'won',
    durationSeconds?: number,
    gameData?: unknown
  ): Promise<{ success: boolean; error?: string; scoreId?: string }> {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Call the database function to save the score
      const { data, error } = await this.supabase.rpc('save_game_score', {
        p_game_name: gameName,
        p_score: score,
        p_moves: moves,
        p_status: status,
        p_duration_seconds: durationSeconds,
        p_game_data: gameData
      })

      if (error) {
        console.error('Error saving score:', error)
        return { success: false, error: error.message }
      }

      return { success: true, scoreId: data }
    } catch (error) {
      console.error('Error saving score:', error)
      return { success: false, error: 'Failed to save score' }
    }
  }

  async getUserBestScore(gameName: string): Promise<UserBestScore | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_best_score', {
        p_game_name: gameName
      })

      if (error) {
        console.error('Error fetching user best score:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Error fetching user best score:', error)
      return null
    }
  }

  async getLeaderboard(gameName: string, limit: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_game_leaderboard', {
        p_game_name: gameName,
        p_limit: limit
      })

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }

  async getUserScores(gameName: string, limit: number = 10): Promise<GameScore[]> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return []
      }

      const { data, error } = await this.supabase
        .from('game_scores')
        .select(`
          *,
          games (name)
        `)
        .eq('user_id', user.id)
        .eq('games.name', gameName)
        .order('score', { ascending: false })
        .order('moves', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user scores:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching user scores:', error)
      return []
    }
  }

  async createOrUpdateProfile(username: string): Promise<{ success: boolean; error?: string; profileId?: string }> {
    try {
      // Check if user is authenticated
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Call the database function to create or update profile
      const { data, error } = await this.supabase.rpc('create_or_update_profile', {
        p_username: username
      })

      if (error) {
        console.error('Error creating/updating profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, profileId: data }
    } catch (error) {
      console.error('Error creating/updating profile:', error)
      return { success: false, error: 'Failed to create/update profile' }
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_profile')

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async isUserAuthenticated(): Promise<boolean> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      return !error && !!user
    } catch {
      return false
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      return error ? null : user
    } catch {
      return null
    }
  }

  async hasUserProfile(): Promise<boolean> {
    try {
      const profile = await this.getUserProfile()
      return !!profile
    } catch {
      return false
    }
  }
}