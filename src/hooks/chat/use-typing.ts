import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { TypingPayload } from '@/types/chat'

const supabase = createClient()

export const useTypingIndicator = (currentUserId: string, chatUserId: string) => {
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!currentUserId || !chatUserId) return

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

    const channelName = `typing_${[currentUserId, chatUserId].sort().join('_')}`
    
    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'typing' }, (payload: { payload: TypingPayload }) => {
        if (payload.payload.userId === chatUserId) {
          setOtherUserTyping(payload.payload.isTyping)
          
          // Auto-clear typing indicator after 3 seconds
          if (payload.payload.isTyping) {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => setOtherUserTyping(false), 3000)
          }
        }
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [currentUserId, chatUserId])

  const startTyping = useCallback(() => {
    if (!isTyping && channelRef.current) {
      setIsTyping(true)
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId, isTyping: true }
      })
    }
  }, [currentUserId, isTyping])

  const stopTyping = useCallback(() => {
    if (isTyping && channelRef.current) {
      setIsTyping(false)
      channelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId, isTyping: false }
      })
    }
  }, [currentUserId, isTyping])

  return {
    isTyping,
    otherUserTyping,
    startTyping,
    stopTyping
  }
}