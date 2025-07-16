// types/database.ts
export interface Profile {
  id: string
  user_id: string
  role: string
  username: string
  email: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  content: string
  sender_id: string
  receiver_id: string
  created_at: string
  updated_at: string
  sender?: Profile
  receiver?: Profile
  delivery_status?: 'sent' | 'delivered' | 'read' | undefined
}

export interface Chat {
  id: string
  participants: Profile[]
  lastMessage?: Message
  unreadCount?: number
}