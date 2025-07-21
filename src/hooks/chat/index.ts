// Authentication hooks
export { useCurrentUser, useProfiles } from '../auth/use-auth'

// Message hooks
export { useMessages } from './use-messages'

// Typing indicator hook
export { useTypingIndicator } from './use-typing'

// Realtime connection utilities
export { useRealtimeConnection } from '../use-realtime-connection'

// Types
export type { 
  EnhancedMessage, 
  MessageWithSender, 
  ReplyToMessage, 
  RealtimeConnectionStatus,
  TypingPayload 
} from '../../types/chat'