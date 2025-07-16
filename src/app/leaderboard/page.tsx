import Sidebar from '@/components/sidebar/Sidebar'
import LeaderboardPage from '@/components/Leaderboard/Main'

export default function Home() {
  return (
    <div className="min-h-screen bg-white/90 dark:bg-gray-900 p-2 lg:p-4 flex items-center justify-center">
      <Sidebar />
      <LeaderboardPage />
    </div>
  )
}