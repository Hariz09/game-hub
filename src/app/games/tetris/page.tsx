import Sidebar from '@/components/sidebar/Sidebar'
import TetrisGame from '@/components/Tetris/TetrisGame'
import CleanBackground from '@/components/CleanBackground'

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