// components/Chat/UserList.tsx
import { Profile } from '@/types/database'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface UserListProps {
  profiles: Profile[]
  currentUser: Profile | null
  onSelectUser: (user: Profile) => void
  selectedUser: Profile | null
}

export const UserList = ({ profiles, currentUser, onSelectUser, selectedUser }: UserListProps) => {
  const otherUsers = profiles.filter(profile => profile.id !== currentUser?.id)

  return (
    <div className="w-80 border-r bg-gray-50 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Users</h2>
      <div className="space-y-2">
        {otherUsers.map((profile) => (
          <Button
            key={profile.id}
            variant={selectedUser?.id === profile.id ? "default" : "ghost"}
            className="w-full justify-start p-3 h-auto"
            onClick={() => onSelectUser(profile)}
          >
            <Avatar className="h-8 w-8 mr-3">
              <AvatarFallback>
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="font-medium">{profile.username}</div>
              <div className="text-sm text-gray-500">{profile.email}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}