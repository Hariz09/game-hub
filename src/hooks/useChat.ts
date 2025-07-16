// hooks/useChat.ts
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message, Profile } from '@/types/database'

const supabase = createClient()

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProfiles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('username', { ascending: true })

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  return { profiles, loading, refetch: fetchProfiles }
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const getCurrentUser = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single()

        if (error) throw error
        setUser(profile)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

  return { user, loading, refetch: getCurrentUser }
}

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
interface MessageWithSender {
  id: string
  content: string
  sender: { username: string } | { username: string }[]
}

// Type for reply-to message data
interface ReplyToMessage {
  id: string
  content: string
  sender_username: string
}

export const useMessages = (senderId: string, receiverId: string) => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      // First, get all messages for the conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError
      
      // Get unique reply_to IDs that are not null
      const replyToIds = [...new Set(
        messagesData
          ?.filter(msg => msg.reply_to)
          .map(msg => msg.reply_to)
      )] as string[]

      // Fetch reply-to messages if there are any
      let replyToMessages: MessageWithSender[] = []
      if (replyToIds.length > 0) {
        const { data: replyData, error: replyError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            sender:profiles!messages_sender_id_fkey(username)
          `)
          .in('id', replyToIds)

        if (replyError) throw replyError
        replyToMessages = replyData || []
      }

      // Create a map for quick lookup of reply-to messages
      const replyToMap = new Map<string, ReplyToMessage>(
        replyToMessages.map(msg => {
          const senderData = msg.sender
          return [msg.id, {
            id: msg.id,
            content: msg.content,
            sender_username: Array.isArray(senderData) ? senderData[0]?.username : senderData?.username
          }]
        })
      )
      
      // Transform messages to include reply info
      const enhancedMessages = (messagesData || []).map(msg => ({
        ...msg,
        reply_to: msg.reply_to ? replyToMap.get(msg.reply_to) : undefined
      }))
      
      setMessages(enhancedMessages)
      
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }, [senderId, receiverId])

  const fetchCompleteMessage = useCallback(async (messageId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(*),
          receiver:profiles!messages_receiver_id_fkey(*)
        `)
        .eq('id', messageId)
        .single()

      if (error) throw error
      
      // If this message has a reply_to, fetch that message separately
      let replyToInfo: ReplyToMessage | undefined = undefined
      if (data.reply_to) {
        const { data: replyData, error: replyError } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            sender:profiles!messages_sender_id_fkey(username)
          `)
          .eq('id', data.reply_to)
          .single()

        if (!replyError && replyData) {
          const senderData = replyData.sender as { username: string } | { username: string }[]
          replyToInfo = {
            id: replyData.id,
            content: replyData.content,
            sender_username: Array.isArray(senderData) ? senderData[0]?.username : senderData?.username
          }
        }
      }
      
      const enhancedMessage = {
        ...data,
        reply_to: replyToInfo
      }
      
      setMessages(prev => {
        const exists = prev.some(msg => msg.id === data.id)
        if (!exists) {
          return [...prev, enhancedMessage]
        }
        return prev
      })
      
    } catch (error) {
      console.error('Error fetching complete message:', error)
    }
  }, [senderId])

  useEffect(() => {
    if (!senderId || !receiverId) {
      setLoading(false)
      return
    }

    fetchMessages()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`messages_${senderId}_${receiverId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Real-time message update:', payload)
        
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message
          
          // Check if message belongs to current conversation
          if (
            (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
            (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
          ) {
            fetchCompleteMessage(newMessage.id)
          }
        } else if (payload.eventType === 'UPDATE') {
          const updatedMessage = payload.new as Message
          
          // Update message in state (for delivery status updates)
          setMessages(prev => prev.map(msg => 
            msg.id === updatedMessage.id 
              ? { ...msg, ...updatedMessage, delivery_status: updatedMessage.delivery_status as "sent" | "delivered" | "read" }
              : msg
          ))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [senderId, receiverId, fetchMessages, fetchCompleteMessage])

  const sendMessage = async (content: string, replyToId?: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content,
          sender_id: senderId,
          receiver_id: receiverId,
          reply_to: replyToId || null,
          delivery_status: 'sent'
        }])
        .select()
        .single()

      if (error) throw error
      
      console.log('Message sent:', data)
      
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  return { 
    messages, 
    loading, 
    sendMessage, 
    refetch: fetchMessages
  }
}

// Hook for typing indicators
export const useTypingIndicator = (currentUserId: string, chatUserId: string) => {
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  useEffect(() => {
    if (!currentUserId || !chatUserId) return

    const channel = supabase
      .channel(`typing_${currentUserId}_${chatUserId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.userId === chatUserId) {
          setOtherUserTyping(payload.payload.isTyping)
          
          // Auto-clear typing indicator after 3 seconds
          if (payload.payload.isTyping) {
            setTimeout(() => setOtherUserTyping(false), 3000)
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, chatUserId])

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true)
      supabase.channel(`typing_${currentUserId}_${chatUserId}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: currentUserId, isTyping: true }
        })
    }
  }, [currentUserId, chatUserId, isTyping])

  const stopTyping = useCallback(() => {
    if (isTyping) {
      setIsTyping(false)
      supabase.channel(`typing_${currentUserId}_${chatUserId}`)
        .send({
          type: 'broadcast',
          event: 'typing',
          payload: { userId: currentUserId, isTyping: false }
        })
    }
  }, [currentUserId, chatUserId, isTyping])

  return {
    isTyping,
    otherUserTyping,
    startTyping,
    stopTyping
  }
}