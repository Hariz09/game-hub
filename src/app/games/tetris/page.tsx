import Sidebar from '@/components/sidebar/sidebar'
import TetrisGame from '@/components/tetris/tetris-game'
import CleanBackground from '@/components/clean-background'

export default function Home() {
  return (
    <>
      {/* Background component - renders behind everything */}
      <CleanBackground />
      
      {/* Main content */}
      <main className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <Sidebar />
        <TetrisGame />
      </main>
    </>
  )
}