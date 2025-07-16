// components/Chat/ChatWindow.tsx
import { useEffect, useRef, useState } from 'react'
import { Profile } from '@/types/database'
import { EnhancedMessage, useTypingIndicator } from '@/hooks/useChat'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { TypingIndicator } from './TypingIndicator'

interface ChatWindowProps {
    messages: EnhancedMessage[]
    currentUser: Profile | null
    selectedUser: Profile | null
    onSendMessage: (content: string, replyToId?: string) => void
    loading?: boolean
}

export const ChatWindow = ({
    messages,
    currentUser,
    selectedUser,
    onSendMessage,
    loading
}: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [replyTo, setReplyTo] = useState<EnhancedMessage | null>(null)

    const {
        otherUserTyping,
        startTyping,
        stopTyping
    } = useTypingIndicator(currentUser?.id || '', selectedUser?.id || '')

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, otherUserTyping])

    const handleReply = (message: EnhancedMessage) => {
        setReplyTo(message)
    }

    const handleCancelReply = () => {
        setReplyTo(null)
    }

    const handleSendMessage = (content: string, replyToId?: string) => {
        onSendMessage(content, replyToId)
        setReplyTo(null)
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
        <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="border-b p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {selectedUser.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedUser.username}</h3>
                            <p className="text-sm text-gray-500">{selectedUser.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-1"
            >
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p className="text-gray-500">Loading messages...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">👋</div>
                                    <p className="text-gray-500">No messages yet</p>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Start the conversation by sending a message below
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isOwn={message.sender_id === currentUser?.id}
                                    onReply={handleReply}
                                />
                            ))
                        )}

                        {/* Typing Indicator */}
                        {otherUserTyping && (
                            <TypingIndicator username={selectedUser.username} />
                        )}

                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                disabled={loading}
                onStartTyping={startTyping}
                onStopTyping={stopTyping}
                replyTo={replyTo}
                onCancelReply={handleCancelReply}
            />
        </div>
    )
}