// app/chat/page.tsx
'use client'

import { useState } from 'react'
import { Profile } from '@/types/database'
import { useProfiles, useMessages, useCurrentUser } from '@/hooks/useChat'
import { UserList } from '@/components/Chat/UserList'
import { ChatWindow } from '@/components/Chat/ChatWindow'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import Sidebar from '@/components/sidebar/Sidebar'


export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)
  const { user: currentUser, loading: userLoading } = useCurrentUser()
  const { profiles } = useProfiles()
  const { messages, loading: messagesLoading, sendMessage } = useMessages(
    currentUser?.id || '',
    selectedUser?.id || ''
  )

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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Sidebar />
      <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 pl-16">
          <MessageCircle className="h-6 w-6 text-blue-500" />
          <h1 className="text-xl font-semibold">Chat App</h1>
        </div>
        <div className="flex items-center gap-4">
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

      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        <UserList
          profiles={profiles}
          currentUser={currentUser}
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
        
        <ChatWindow
          messages={messages}
          currentUser={currentUser}
          selectedUser={selectedUser}
          onSendMessage={sendMessage}
          loading={messagesLoading}
        />
      </div>
    </div>
  )
}