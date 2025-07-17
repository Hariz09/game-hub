// components/Chat/MessageInput.tsx
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, X } from 'lucide-react'
import { EnhancedMessage } from '@/hooks'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSendMessage: (content: string, replyToId?: string) => void
  disabled?: boolean
  onStartTyping?: () => void
  onStopTyping?: () => void
  replyTo?: EnhancedMessage | null
  onCancelReply?: () => void
}

export const MessageInput = ({ 
  onSendMessage, 
  disabled, 
  onStartTyping, 
  onStopTyping,
  replyTo,
  onCancelReply
}: MessageInputProps) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus()
    }
  }, [replyTo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setMessage(value)

    // Handle typing indicators
    if (value.trim() && !isTyping) {
      setIsTyping(true)
      onStartTyping?.()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      onStopTyping?.()
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message, replyTo?.id)
      setMessage('')
      onCancelReply?.()
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false)
        onStopTyping?.()
      }
      
      // Clear timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && replyTo) {
      onCancelReply?.()
    }
  }

  return (
    <div className="border-t bg-white">
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700">
              Replying to {replyTo.sender?.username}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {replyTo.content}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <Input
          ref={inputRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={replyTo ? "Reply to message..." : "Type a message..."}
          disabled={disabled}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
          className={cn(
            "transition-colors",
            message.trim() && !disabled && "bg-blue-500 hover:bg-blue-600"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}