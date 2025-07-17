import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Message } from '@/types/database'
import { RealtimeChannel } from '@supabase/supabase-js'
import { EnhancedMessage, MessageWithSender, ReplyToMessage } from '@/types/chat'

const supabase = createClient()

export const useMessages = (senderId: string, receiverId: string) => {
  const [messages, setMessages] = useState<EnhancedMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(true)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const lastFetchTimeRef = useRef<number>(0)

  const fetchMessages = useCallback(async () => {
    // Prevent duplicate fetches within 1 second
    const now = Date.now()
    if (now - lastFetchTimeRef.current < 1000) {
      return
    }
    lastFetchTimeRef.current = now

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
  }, [senderId, receiverId]) // Dependencies for useCallback
  
  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (senderId && receiverId) {
        fetchMessages()
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [senderId, receiverId, fetchMessages]) // <--- ADDED fetchMessages here

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
          return [...prev, enhancedMessage].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        }
        return prev
      })

    } catch (error) {
      console.error('Error fetching complete message:', error)
    }
  }, []) // fetchCompleteMessage doesn't depend on senderId/receiverId directly, as it fetches by messageId.

  // Enhanced realtime channel setup with better UPDATE handling
  const setupRealtimeChannel = useCallback(() => {
    if (!senderId || !receiverId) return

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channelName = `messages_${[senderId, receiverId].sort().join('_')}`

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Real-time INSERT:', payload)

        const message = payload.new as Message

        // Check if the message belongs to the current conversation
        const isRelevant = (
          (message.sender_id === senderId && message.receiver_id === receiverId) ||
          (message.sender_id === receiverId && message.receiver_id === senderId)
        )

        if (isRelevant) {
          fetchCompleteMessage(message.id)
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Real-time UPDATE:', payload)

        const oldMessage = payload.old as Message
        const newMessage = payload.new as Message

        // Check if the message belongs to the current conversation
        const isRelevant = (
          (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
          (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId)
        )

        if (isRelevant) {
          console.log('Updating message in real-time:', {
            id: newMessage.id,
            oldStatus: oldMessage.delivery_status,
            newStatus: newMessage.delivery_status
          })

          setMessages(prev => {
            const updated = prev.map(msg => {
              if (msg.id === newMessage.id) {
                return {
                  ...msg,
                  ...newMessage,
                  delivery_status: newMessage.delivery_status as "sent" | "delivered" | "read"
                }
              }
              return msg
            })

            // Log the update for debugging
            const updatedMessage = updated.find(msg => msg.id === newMessage.id)
            if (updatedMessage) {
              console.log('Message updated in state:', {
                id: updatedMessage.id,
                status: updatedMessage.delivery_status
              })
            }

            return updated
          })
        }
      })
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)

        if (status === 'SUBSCRIBED') {
          setIsOnline(true)
          console.log('Successfully subscribed to realtime channel')
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsOnline(false)
          console.error('Realtime subscription failed:', status)
        }
      })

    channelRef.current = channel
  }, [senderId, receiverId, fetchCompleteMessage]) // Dependencies for useCallback

  // Direct UPDATE approach - simpler and more reliable for real-time
  const markMessagesAsRead = useCallback(async () => {
    try {
      console.log('Marking messages as read:', { senderId, receiverId })

      // Direct UPDATE query instead of RPC
      const { data, error } = await supabase
        .from('messages')
        .update({ delivery_status: 'read' })
        .eq('sender_id', receiverId)  // Messages sent BY the other user
        .eq('receiver_id', senderId)  // Messages sent TO current user
        .neq('delivery_status', 'read')  // Only update unread messages
        .select('id, delivery_status')  // Return the updated records

      if (error) {
        console.error('Update error:', error)
        throw error
      }

      console.log('Successfully marked messages as read:', data)

      // The real-time listener will automatically catch these updates
      // No need for optimistic updates since real-time should be fast

    } catch (error) {
      console.error('Error marking messages as read:', error)
    }
  }, [senderId, receiverId])

  // Main effect for setting up messages and realtime
  useEffect(() => {
    if (!senderId || !receiverId) {
      setLoading(false)
      return
    }

    // Reset state when conversation changes
    setMessages([])
    lastFetchTimeRef.current = 0

    // Fetch initial messages
    fetchMessages()

    // Setup realtime channel
    setupRealtimeChannel()

    // Cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [senderId, receiverId, fetchMessages, setupRealtimeChannel]) // Dependencies for useEffect

  // Visibility change handler - refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && senderId && receiverId) {
        fetchMessages()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [senderId, receiverId, fetchMessages]) // Dependencies for useEffect

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

      // Don't add optimistic update here - let the realtime subscription handle it
      // This prevents duplicate messages

    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
    markMessagesAsRead,
    isOnline,
    reconnectAttempts: 0 // Simplified - no longer tracking reconnect attempts
  }
}