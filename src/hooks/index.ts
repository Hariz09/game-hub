// Authentication hooks
export { useCurrentUser, useProfiles } from './useAuth'

// Message hooks
export { useMessages } from './useMessages'

// Typing indicator hook
export { useTypingIndicator } from './useTyping'

// Realtime connection utilities
export { useRealtimeConnection } from './useRealtimeConnection'

// Types
export type { 
  EnhancedMessage, 
  MessageWithSender, 
  ReplyToMessage, 
  RealtimeConnectionStatus,
  TypingPayload 
} from '../types/chat'