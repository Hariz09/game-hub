// components/Chat/MessageBubble.tsx
import { EnhancedMessage } from '@/hooks'
import { cn } from '@/lib/utils'
import { Check, CheckCheck, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MessageBubbleProps {
  message: EnhancedMessage
  isOwn: boolean
  onReply?: (message: EnhancedMessage) => void
}

export const MessageBubble = ({ message, isOwn, onReply }: MessageBubbleProps) => {
  const getDeliveryIcon = () => {
    if (!isOwn) return null
    
    switch (message.delivery_status) {
      case 'sent':
        return <Check className="h-3 w-3" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />
      case 'read':
        return <CheckCheck className="h-3 w-3 bg-blue-500" />
      default:
        return null
    }
  }

  const getDeliveryColor = () => {
    if (!isOwn) return ''
    
    switch (message.delivery_status) {
      case 'sent':
        return 'text-blue-100'
      case 'delivered':
        return 'text-blue-100'
      case 'read':
        return 'text-green-200'
      default:
        return 'text-blue-100'
    }
  }

  return (
    <div className={cn("flex mb-4 group", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-xs lg:max-w-md relative",
        isOwn ? "mr-2" : "ml-2"
      )}>
        {/* Reply Reference */}
        {message.reply_to && (
          <div className={cn(
            "mb-1 p-2 rounded-t-lg border-l-2 text-xs",
            isOwn 
              ? "bg-blue-400 border-blue-200 text-blue-100" 
              : "bg-gray-100 border-gray-400 text-gray-600"
          )}>
            <div className="font-medium">
              Replying to {message.reply_to.sender_username}
            </div>
            <div className="opacity-75 truncate">
              {message.reply_to.content}
            </div>
          </div>
        )}
        
        {/* Main Message */}
        <div className={cn(
          "px-4 py-2 rounded-lg relative",
          message.reply_to 
            ? (isOwn ? "rounded-tl-lg" : "rounded-tr-lg")
            : "rounded-lg",
          isOwn 
            ? "bg-blue-500 text-white" 
            : "bg-gray-200 text-gray-800"
        )}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Timestamp and Delivery Status */}
          <div className={cn(
            "flex items-center justify-between text-xs mt-1",
            isOwn ? "text-blue-100" : "text-gray-500"
          )}>
            <span>
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {isOwn && (
              <div className={cn("ml-2 flex items-center", getDeliveryColor())}>
                {getDeliveryIcon()}
              </div>
            )}
          </div>
        </div>
        
        {/* Reply Button */}
        {onReply && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity",
              "h-6 w-6 p-0 bg-white/90 hover:bg-white shadow-sm",
              isOwn ? "right-0" : "left-0"
            )}
            onClick={() => onReply(message)}
          >
            <Reply className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}