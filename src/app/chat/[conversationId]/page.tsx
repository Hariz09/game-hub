// app/chat/[conversationId]/page.tsx - Enhanced layout version
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Profile } from '@/types/database'
import { useProfiles, useMessages, useCurrentUser } from '@/hooks/chat'
import { UserList, ChatWindow } from '@/components/chat'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import Sidebar from '@/components/sidebar/sidebar'

export default function ChatConversationPage() {
  const params = useParams()
  const router = useRouter()
  const conversationId = params.conversationId as string
  
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { profiles } = useProfiles()
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const [otherUserId, setOtherUserId] = useState<string | null>(null)
  const [isUserListCollapsed, setIsUserListCollapsed] = useState(false)
  
  const { 
    messages, 
    loading: messagesLoading, 
    sendMessage, 
    markMessagesAsRead, 
    refetch,
    isOnline,
    reconnectAttempts
  } = useMessages(
    currentUser?.id || '',
    otherUserId || ''
  )

  // Helper functions for conversation ID handling
  const createConversationId = (userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort()
    return sortedIds.join('_')
  }

  const parseConversationId = (conversationId: string, currentUserId: string) => {
    const userIds = conversationId.split('_')
    if (userIds.length !== 2) return null
    
    // Return the other user's ID (not the current user's ID)
    return userIds.find(id => id !== currentUserId) || null
  }

  const handleSelectUser = (user: Profile) => {
    const newConversationId = createConversationId(currentUser!.id, user.id)
    router.push(`/chat/${newConversationId}`)
  }

  const handleToggleUserList = () => {
    setIsUserListCollapsed(!isUserListCollapsed)
  }

  // Parse conversation ID and find the other user
  useEffect(() => {
    if (currentUser && conversationId && profiles.length > 0) {
      const otherUserId = parseConversationId(conversationId, currentUser.id)
      
      if (otherUserId) {
        const user = profiles.find(p => p.id === otherUserId)
        if (user) {
          setSelectedUser(user)
          setOtherUserId(otherUserId)
        } else {
          // User not found, redirect to main chat
          router.push('/chat')
        }
      } else {
        // Invalid conversation ID format
        router.push('/chat')
      }
    }
  }, [currentUser, conversationId, profiles, router])

  if (userLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Please log in</h2>
            <p className="text-gray-500 mb-4">You need to be logged in to access the chat</p>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Go to Login
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Sidebar />
      
      {/* Top Header */}
      <div className="flex-shrink-0 bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 pl-16">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/chat')}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold">Chat App</h1>
          {selectedUser && (
            <span className="text-sm text-gray-500">
              - {selectedUser.username}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">Online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs">
                  {reconnectAttempts > 0 ? `Reconnecting (${reconnectAttempts}/5)` : 'Offline'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">
              Welcome, {currentUser.username}
            </span>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* User List Sidebar */}
        <div className="flex-shrink-0">
          <UserList
            profiles={profiles}
            currentUser={currentUser}
            onSelectUser={handleSelectUser}
            selectedUser={selectedUser}
            isCollapsed={isUserListCollapsed}
            onToggleCollapse={handleToggleUserList}
          />
        </div>
        
        {/* Chat Window */}
        <div className="flex-1 min-w-0">
          <ChatWindow
            messages={messages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            onSendMessage={sendMessage}
            markMessagesAsRead={markMessagesAsRead}
            loading={messagesLoading}
            isOnline={isOnline}
            reconnectAttempts={reconnectAttempts}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  )
}