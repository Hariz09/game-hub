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
        console.error('❌ Save: User not authenticated:', authError)
        return { success: false, error: 'User not authenticated' }
      }

      console.log('💾 Saving score for user:', user.id, 'game:', gameName, 'score:', score)

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
        console.error('❌ Error saving score:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Score saved successfully:', data)
      return { success: true, scoreId: data }
    } catch (error) {
      console.error('❌ Exception saving score:', error)
      return { success: false, error: 'Failed to save score' }
    }
  }

  async getUserBestScore(gameName: string): Promise<UserBestScore | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_best_score', {
        p_game_name: gameName
      })

      if (error) {
        console.error('❌ Error fetching user best score:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('❌ Exception fetching user best score:', error)
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
        console.error('❌ Error fetching leaderboard:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Exception fetching leaderboard:', error)
      return []
    }
  }

  // FIXED: Better approach using direct query instead of problematic join
  async getUserScores(gameName: string, limit: number = 10): Promise<GameScore[]> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('❌ Load: User not authenticated:', authError)
        return []
      }

      console.log('📥 Loading scores for user:', user.id, 'game:', gameName)

      // First, get the game_id for the game name
      const { data: gameData, error: gameError } = await this.supabase
        .from('games')
        .select('id')
        .eq('name', gameName)
        .single()

      if (gameError || !gameData) {
        console.error('❌ Error finding game:', gameError)
        return []
      }

      console.log('🎮 Found game ID:', gameData.id)

      // Then get user scores for that game
      const { data, error } = await this.supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', gameData.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('❌ Error fetching user scores:', error)
        return []
      }

      console.log('📊 Found scores:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('📊 Latest score data:', data[0])
        console.log('📊 Game data exists:', !!data[0].game_data)
        console.log('📊 Game data preview:', data[0].game_data ? Object.keys(data[0].game_data as any) : 'none')
      }

      return data || []
    } catch (error) {
      console.error('❌ Exception fetching user scores:', error)
      return []
    }
  }

  // ADDED: Alternative method using RPC if available
  async getUserScoresViaRPC(gameName: string, limit: number = 10): Promise<GameScore[]> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('❌ RPC Load: User not authenticated:', authError)
        return []
      }

      console.log('📥 Loading scores via RPC for user:', user.id, 'game:', gameName)

      const { data, error } = await this.supabase.rpc('get_user_game_scores', {
        p_game_name: gameName,
        p_limit: limit
      })

      if (error) {
        console.error('❌ RPC Error fetching user scores:', error)
        return []
      }

      console.log('📊 RPC Found scores:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('❌ RPC Exception fetching user scores:', error)
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

      console.log('👤 Creating/updating profile for user:', user.id, 'username:', username)

      // Call the database function to create or update profile
      const { data, error } = await this.supabase.rpc('create_or_update_profile', {
        p_username: username
      })

      if (error) {
        console.error('❌ Error creating/updating profile:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Profile created/updated:', data)
      return { success: true, profileId: data }
    } catch (error) {
      console.error('❌ Exception creating/updating profile:', error)
      return { success: false, error: 'Failed to create/update profile' }
    }
  }

  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_user_profile')

      if (error) {
        console.error('❌ Error fetching user profile:', error)
        return null
      }

      return data?.[0] || null
    } catch (error) {
      console.error('❌ Exception fetching user profile:', error)
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

  // ADDED: Debug method to check data exists
  async debugCheckData(gameName: string): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        console.log('🐛 Debug: No user authenticated')
        return
      }

      console.log('🐛 Debug: Checking data for user:', user.id, 'game:', gameName)

      // Check if game exists
      const { data: gameData } = await this.supabase
        .from('games')
        .select('*')
        .eq('name', gameName)

      console.log('🐛 Game data:', gameData)

      // Check all scores for this user
      const { data: allScores } = await this.supabase
        .from('game_scores')
        .select('*')
        .eq('user_id', user.id)

      console.log('🐛 All user scores:', allScores)

      // Check profile
      const { data: profile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)

      console.log('🐛 User profile:', profile)

    } catch (error) {
      console.error('🐛 Debug error:', error)
    }
  }
}