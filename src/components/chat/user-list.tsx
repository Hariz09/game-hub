// components/Chat/UserList.tsx
import { Profile } from '@/types/database'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'

interface UserListProps {
  profiles: Profile[]
  currentUser: Profile | null
  onSelectUser: (user: Profile) => void
  selectedUser: Profile | null
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const UserList = ({ 
  profiles, 
  currentUser, 
  onSelectUser, 
  selectedUser, 
  isCollapsed, 
  onToggleCollapse 
}: UserListProps) => {
  const otherUsers = profiles.filter(profile => profile.id !== currentUser?.id)

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} border-r bg-gray-50 transition-all duration-200 ease-in-out overflow-hidden`}>
      {/* Header with toggle button */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Users</h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User list */}
      <div className="p-4 overflow-y-auto">
        <div className="space-y-2">
          {otherUsers.map((profile) => (
            <Button
              key={profile.id}
              variant={selectedUser?.id === profile.id ? "default" : "ghost"}
              className={`w-full justify-start h-auto ${
                isCollapsed ? 'p-2' : 'p-3'
              }`}
              onClick={() => onSelectUser(profile)}
              title={isCollapsed ? profile.username : undefined}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-left ml-3 min-w-0 flex-1">
                  <div className="font-medium truncate">{profile.username}</div>
                </div>
              )}
            </Button>
          ))}
          {otherUsers.length === 0 && !isCollapsed && (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No other users available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}