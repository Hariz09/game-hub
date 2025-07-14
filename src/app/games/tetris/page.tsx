import Sidebar from '@/components/sidebar/Sidebar'
import TetrisGame from '@/components/Tetris/TetrisGame'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Sidebar />
      <TetrisGame />
    </main>
  )
}