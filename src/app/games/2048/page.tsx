import SquareMergeGame from "@/components/2048/square-merge-game"
import CleanBackground from "@/components/clean-background"
import Sidebar from "@/components/sidebar/sidebar"

export default function Home() {
  return (
    <>
    <CleanBackground />
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Sidebar />
        <SquareMergeGame />
      </div>
    </main>
    </>
  )
}