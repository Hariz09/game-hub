// app/page.tsx
'use client'
import { GameBoard } from '@/components/uno/GameBoard';

export default function Home() {
  return (
    <main className="w-full h-screen">
      <GameBoard />
    </main>
  );
}