import { Message } from '@/types/database'

// Enhanced Message type with delivery status and reply info
export interface EnhancedMessage extends Message {
  delivery_status?: 'sent' | 'delivered' | 'read'
  reply_to?: {
    id: string
    content: string
    sender_username: string
  }
}

// Type for message with sender profile data (partial profile for reply-to queries)
export interface MessageWithSender {
  id: string
  content: string
  sender: { username: string } | { username: string }[]
}

// Type for reply-to message data
export interface ReplyToMessage {
  id: string
  content: string
  sender_username: string
}

// Realtime connection status
export interface RealtimeConnectionStatus {
  isOnline: boolean
  reconnectAttempts: number
}

// Typing indicator payload
export interface TypingPayload {
  userId: string
  isTyping: boolean
}