import { createClient } from '@/lib/supabase/client'

export interface GameScore {
  id: string
  user_id: string
  game_id: string
  score: number
  moves: number
  status: 'completed' | 'game_over' | 'won'
  duration_seconds?: number
  game_data?: Record<string, unknown>
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

export interface CoffeeGameData {
  level: number
  beans: number
  upgrades: Record<string, number>
  [key: string]: unknown;
}

export interface PuzzleGameData {
  grid: number[][]
  currentLevel: number
}

export type GameDataTypes = CoffeeGameData | PuzzleGameData | Record<string, unknown>

export class GameScoreService {
  private supabase = createClient()

  async saveScore(
    gameName: string,
    score: number,
    moves: number,
    status: 'completed' | 'game_over' | 'won',
    durationSeconds?: number,
    gameData?: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string; scoreId?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Save: User not authenticated:', authError)
        return { success: false, error: 'User not authenticated' }
      }

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
      console.error('Exception saving score:', error)
      return { success: false, error: 'Failed to save score' }
    }
  }

  /**
   * Dedicated save method for coffee game - overwrites existing save data
   * instead of creating new entries since idle games only need current progress
   */
  async saveCoffeeGameProgress(
    score: number,
    gameData: Record<string, unknown>
  ): Promise<{ success: boolean; error?: string; scoreId?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Coffee Save: User not authenticated:', authError)
        return { success: false, error: 'User not authenticated' }
      }

      const { data: gameResult, error: gameError } = await this.supabase
        .from('games')
        .select('id')
        .eq('name', 'coffee-brew-idle')
        .single()

      if (gameError || !gameResult) {
        console.error('Error finding coffee game:', gameError)
        return { success: false, error: 'Coffee game not found in database' }
      }

      const gameId = gameResult.id

      const { data: existingScore, error: checkError } = await this.supabase
        .from('game_scores')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing coffee save:', checkError)
        return { success: false, error: 'Failed to check existing save' }
      }

      const currentTime = new Date().toISOString()

      if (existingScore) {
        const { data, error } = await this.supabase
          .from('game_scores')
          .update({
            score: score,
            moves: 0,
            status: 'completed',
            duration_seconds: null,
            game_data: gameData,
            updated_at: currentTime
          })
          .eq('id', existingScore.id)
          .select('id')
          .single()

        if (error) {
          console.error('Error updating coffee save:', error)
          return { success: false, error: error.message }
        }

        return { success: true, scoreId: data.id }
      } else {
        const { data, error } = await this.supabase
          .from('game_scores')
          .insert({
            user_id: user.id,
            game_id: gameId,
            score: score,
            moves: 0,
            status: 'completed',
            duration_seconds: null,
            game_data: gameData,
            created_at: currentTime,
            updated_at: currentTime
          })
          .select('id')
          .single()

        if (error) {
          console.error('Error creating coffee save:', error)
          return { success: false, error: error.message }
        }

        return { success: true, scoreId: data.id }
      }
    } catch (error) {
      console.error('Exception saving coffee game:', error)
      return { success: false, error: 'Failed to save coffee game progress' }
    }
  }

  /**
   * Load the latest (and only) coffee game save for the current user
   */
  async loadCoffeeGameProgress(): Promise<{ success: boolean; error?: string; gameData?: Record<string, unknown> | null }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Coffee Load: User not authenticated:', authError)
        return { success: false, error: 'User not authenticated' }
      }

      const { data: gameResult, error: gameError } = await this.supabase
        .from('games')
        .select('id')
        .eq('name', 'coffee-brew-idle')
        .single()

      if (gameError || !gameResult) {
        console.error('Error finding coffee game:', gameError)
        return { success: false, error: 'Coffee game not found in database' }
      }

      const gameId = gameResult.id

      const { data, error } = await this.supabase
        .from('game_scores')
        .select('game_data, score, updated_at')
        .eq('user_id', user.id)
        .eq('game_id', gameId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, gameData: null }
        }
        console.error('Error loading coffee save:', error)
        return { success: false, error: error.message }
      }

      return { success: true, gameData: data.game_data as Record<string, unknown> | null }
    } catch (error) {
      console.error('Exception loading coffee game:', error)
      return { success: false, error: 'Failed to load coffee game progress' }
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
      console.error('Exception fetching user best score:', error)
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
      console.error('Exception fetching leaderboard:', error)
      return []
    }
  }

  async getUserScores(gameName: string, limit: number = 10): Promise<GameScore[]> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Load: User not authenticated:', authError)
        return []
      }

      const { data: gameData, error: gameError } = await this.supabase
        .from('games')
        .select('id')
        .eq('name', gameName)
        .single()

      if (gameError || !gameData) {
        console.error('Error finding game:', gameError)
        return []
      }

      const { data, error } = await this.supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', gameData.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user scores:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Exception fetching user scores:', error)
      return []
    }
  }

  async getUserScoresViaRPC(gameName: string, limit: number = 10): Promise<GameScore[]> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('RPC Load: User not authenticated:', authError)
        return []
      }

      const { data, error } = await this.supabase.rpc('get_user_game_scores', {
        p_game_name: gameName,
        p_limit: limit
      })

      if (error) {
        console.error('RPC Error fetching user scores:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('RPC Exception fetching user scores:', error)
      return []
    }
  }

  async createOrUpdateProfile(username: string): Promise<{ success: boolean; error?: string; profileId?: string }> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data, error } = await this.supabase.rpc('create_or_update_profile', {
        p_username: username
      })

      if (error) {
        console.error('Error creating/updating profile:', error)
        return { success: false, error: error.message }
      }

      return { success: true, profileId: data }
    } catch (error) {
      console.error('Exception creating/update profile:', error)
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
      console.error('Exception fetching user profile:', error)
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

  // Type-safe methods for specific games
  async saveCoffeeGameProgressTyped(
    score: number,
    gameData: CoffeeGameData
  ): Promise<{ success: boolean; error?: string; scoreId?: string }> {
    return this.saveCoffeeGameProgress(score, gameData as Record<string, unknown>)
  }

  async loadCoffeeGameProgressTyped(): Promise<{ success: boolean; error?: string; gameData?: CoffeeGameData | null }> {
    const result = await this.loadCoffeeGameProgress()
    return {
      ...result,
      gameData: result.gameData as CoffeeGameData | null
    }
  }
}