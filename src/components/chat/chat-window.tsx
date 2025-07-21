// components/Chat/ChatWindow.tsx - Enhanced version with improved layout
import { useEffect, useRef, useState, useCallback } from 'react'
import { Profile } from '@/types/database'
import { EnhancedMessage, useTypingIndicator } from '@/hooks/chat'
import { MessageBubble, MessageInput, TypingIndicator } from './'
import { AlertCircle, Wifi, WifiOff, RefreshCw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ChatWindowProps {
    messages: EnhancedMessage[]
    currentUser: Profile | null
    selectedUser: Profile | null
    onSendMessage: (content: string, replyToId?: string) => void
    markMessagesAsRead: () => void
    loading?: boolean
    isOnline?: boolean
    reconnectAttempts?: number
    refetch?: () => void
}

export const ChatWindow = ({
    messages,
    currentUser,
    selectedUser,
    onSendMessage,
    markMessagesAsRead,
    loading,
    isOnline = true,
    reconnectAttempts = 0,
    refetch
}: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [replyTo, setReplyTo] = useState<EnhancedMessage | null>(null)
    const [isWindowFocused, setIsWindowFocused] = useState(true)
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const [lastMessageCount, setLastMessageCount] = useState(0)
    const [, setUserHasScrolled] = useState(false)
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

    const {
        otherUserTyping,
        startTyping,
        stopTyping
    } = useTypingIndicator(currentUser?.id || '', selectedUser?.id || '')

    // Smooth scroll to bottom
    const scrollToBottom = useCallback((behavior: 'smooth' | 'instant' = 'smooth') => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior,
                block: 'end',
                inline: 'nearest'
            })
        }
    }, [])

    // Check if user is at bottom of messages
    const isAtBottom = useCallback(() => {
        const container = messagesContainerRef.current
        if (!container) return false
        
        const { scrollTop, scrollHeight, clientHeight } = container
        return scrollTop + clientHeight >= scrollHeight - 50 // 50px threshold
    }, [])

    // Handle window focus/blur for read status
    useEffect(() => {
        const handleFocus = () => {
            setIsWindowFocused(true)
            if (selectedUser) {
                markMessagesAsRead()
            }
        }

        const handleBlur = () => {
            setIsWindowFocused(false)
        }

        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)

        return () => {
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
        }
    }, [selectedUser, markMessagesAsRead])

    // Mark messages as read when appropriate
    useEffect(() => {
        if (selectedUser && messages.length > 0 && isWindowFocused && isAtBottom()) {
            const timer = setTimeout(() => {
                markMessagesAsRead()
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [selectedUser, messages.length, isWindowFocused, markMessagesAsRead, isAtBottom])

    // Handle scroll events
    useEffect(() => {
        const container = messagesContainerRef.current
        if (!container) return

        const handleScroll = () => {
            const atBottom = isAtBottom()
            const hasScrolled = container.scrollTop > 0
            
            setUserHasScrolled(hasScrolled && !atBottom)
            setShowScrollToBottom(!atBottom && messages.length > 0)
            setShouldAutoScroll(atBottom)
            
            // Mark messages as read if scrolled to bottom
            if (atBottom && selectedUser && isWindowFocused) {
                markMessagesAsRead()
            }
        }

        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
    }, [selectedUser, isWindowFocused, markMessagesAsRead, messages.length, isAtBottom])

    // Auto-scroll logic for new messages and typing indicator
    useEffect(() => {
        const hasNewMessages = messages.length > lastMessageCount
        const wasAtBottom = shouldAutoScroll
        
        if (hasNewMessages || otherUserTyping) {
            // Always scroll for new messages from current user
            const lastMessage = messages[messages.length - 1]
            const isOwnMessage = lastMessage && lastMessage.sender_id === currentUser?.id
            
            if (isOwnMessage || wasAtBottom || otherUserTyping) {
                // Use instant scroll for own messages, smooth for others
                scrollToBottom(isOwnMessage ? 'instant' : 'smooth')
            }
        }
        
        setLastMessageCount(messages.length)
    }, [messages.length, otherUserTyping, lastMessageCount, shouldAutoScroll, currentUser?.id, scrollToBottom, messages])

    // Reset scroll behavior when changing conversations
    useEffect(() => {
        if (selectedUser) {
            setUserHasScrolled(false)
            setShouldAutoScroll(true)
            setShowScrollToBottom(false)
            // Scroll to bottom when opening a new conversation
            setTimeout(() => scrollToBottom('instant'), 100)
        }
    }, [selectedUser, scrollToBottom])

    // Scroll to bottom when typing indicator appears/disappears
    useEffect(() => {
        if (otherUserTyping && shouldAutoScroll) {
            setTimeout(() => scrollToBottom('smooth'), 100)
        }
    }, [otherUserTyping, shouldAutoScroll, scrollToBottom])

    const handleReply = (message: EnhancedMessage) => {
        setReplyTo(message)
    }

    const handleCancelReply = () => {
        setReplyTo(null)
    }

    const handleSendMessage = (content: string, replyToId?: string) => {
        onSendMessage(content, replyToId)
        setReplyTo(null)
        // Ensure we scroll to bottom after sending
        setTimeout(() => scrollToBottom('smooth'), 100)
    }

    const handleScrollToBottom = () => {
        scrollToBottom('smooth')
        setShouldAutoScroll(true)
        setUserHasScrolled(false)
    }

    const handleRetry = () => {
        if (refetch) {
            refetch()
        }
    }

    // Connection status indicator
    const renderConnectionStatus = () => {
        if (!isOnline) {
            return (
                <Alert className="mx-4 mt-2 border-red-200 bg-red-50">
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>Connection lost. Messages may not be delivered.</span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRetry}
                            disabled={loading}
                        >
                            {loading ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                                'Retry'
                            )}
                        </Button>
                    </AlertDescription>
                </Alert>
            )
        }

        if (reconnectAttempts > 0) {
            return (
                <Alert className="mx-4 mt-2 border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Reconnecting... (Attempt {reconnectAttempts}/5)
                    </AlertDescription>
                </Alert>
            )
        }

        return null
    }

    if (!selectedUser) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-gray-500 text-lg">Select a user to start chatting</p>
                    <p className="text-gray-400 text-sm mt-2">
                        Choose someone from the users list to begin your conversation
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full max-h-full">
            {/* Chat Header */}
            <div className="flex-shrink-0 border-b p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {selectedUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedUser.username}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                {isOnline ? (
                                    <Wifi className="h-3 w-3 text-green-500" />
                                ) : (
                                    <WifiOff className="h-3 w-3 text-red-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Connection Status */}
            <div className="flex-shrink-0">
                {renderConnectionStatus()}
            </div>

            {/* Messages Container */}
            <div className="flex-1 relative min-h-0">
                <div
                    ref={messagesContainerRef}
                    className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                    style={{ 
                        scrollBehavior: 'auto',
                        overflowAnchor: 'none'
                    }}
                >
                    <div className="p-4 bg-gray-50 min-h-full flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                    <p className="text-gray-500">Loading messages...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl mb-4">👋</div>
                                            <p className="text-gray-500">No messages yet</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Start the conversation by sending a message below
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 flex-1">
                                        {messages.map((message) => (
                                            <MessageBubble
                                                key={message.id}
                                                message={message}
                                                isOwn={message.sender_id === currentUser?.id}
                                                onReply={handleReply}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Typing Indicator */}
                                {otherUserTyping && (
                                    <div className="mt-2">
                                        <TypingIndicator username={selectedUser.username} />
                                    </div>
                                )}

                                {/* Scroll anchor */}
                                <div 
                                    ref={messagesEndRef} 
                                    className="h-1 flex-shrink-0"
                                    style={{ overflowAnchor: 'auto' }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Scroll to Bottom Button */}
                {showScrollToBottom && (
                    <div className="absolute bottom-4 right-4 z-10">
                        <Button
                            onClick={handleScrollToBottom}
                            className="rounded-full w-12 h-12 p-0 shadow-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-600"
                            variant="outline"
                        >
                            <ChevronDown className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="flex-shrink-0 border-t bg-white">
                <MessageInput
                    onSendMessage={handleSendMessage}
                    disabled={loading || !isOnline}
                    onStartTyping={startTyping}
                    onStopTyping={stopTyping}
                    replyTo={replyTo}
                    onCancelReply={handleCancelReply}
                />
            </div>
        </div>
    )
}