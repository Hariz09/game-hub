import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient()

export const useRealtimeConnection = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setReconnectAttempts(0)
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
  }, [])

  const createChannel = useCallback((
    channelName: string,
    onMessage?: (payload: unknown) => void,
    onSystem?: (payload: unknown) => void
  ) => {
    const channel = supabase.channel(channelName)

    if (onMessage) {
      // For message channels
      channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, onMessage)
    }

    if (onSystem) {
      channel.on('system', {}, onSystem)
    }

    // Handle connection status
    channel.on('system', {}, (payload) => {
      console.log('Realtime system event:', payload)
      
      if (payload.status === 'CLOSED') {
        setIsOnline(false)
        // Attempt to reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          // Trigger reconnection logic here
        }, 2000)
      }
    })

    const subscribeWithRetry = () => {
      return channel.subscribe((status) => {
        console.log('Realtime subscription status:', status)
        
        if (status === 'SUBSCRIBED') {
          setIsOnline(true)
          setReconnectAttempts(0)
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsOnline(false)
          // Retry connection with exponential backoff
          if (reconnectAttempts < 5) {
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current)
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              setReconnectAttempts(prev => prev + 1)
              subscribeWithRetry()
            }, Math.pow(2, reconnectAttempts) * 1000)
          }
        }
      })
    }

    subscribeWithRetry()
    return channel
  }, [reconnectAttempts])

  const removeChannel = useCallback((channel: RealtimeChannel) => {
    supabase.removeChannel(channel)
  }, [])

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  return {
    isOnline,
    reconnectAttempts,
    createChannel,
    removeChannel,
    cleanup
  }
}