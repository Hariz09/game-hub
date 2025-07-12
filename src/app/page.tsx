// app/page.tsx
'use client'
import Sidebar from '@/components/sidebar/Sidebar';
import { GameBoard } from '@/components/uno/GameBoard';

export default function Home() {

  return (
    <main className="w-full h-screen relative">
      <Sidebar />
      <GameBoard />
    </main>
  );
}