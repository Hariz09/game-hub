// components/Chat/TypingIndicator.tsx
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  username: string
  className?: string
}

export const TypingIndicator = ({ username, className }: TypingIndicatorProps) => {
  return (
    <div className={cn("flex items-center gap-2 px-4 py-2 text-gray-500", className)}>
      <div className="flex space-x-1">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
      </div>
      <span className="text-sm">{username} is typing...</span>
    </div>
  )
}