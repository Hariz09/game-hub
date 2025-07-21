// components/Chat/TypingIndicator.tsx - Enhanced version
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  username: string
  className?: string
}

export const TypingIndicator = ({ username, className }: TypingIndicatorProps) => {
  return (
    <div className={cn("flex items-start gap-3 px-2 py-1", className)}>
      {/* Avatar */}
      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
        {username.charAt(0).toUpperCase()}
      </div>
      
      {/* Typing bubble */}
      <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border max-w-xs">
        <div className="flex items-center gap-2">
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
          
          {/* Typing text */}
          <span className="text-sm text-gray-500 ml-1">
            {username} is typing...
          </span>
        </div>
      </div>
    </div>
  )
}