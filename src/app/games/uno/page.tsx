'use client'
import Sidebar from '@/components/sidebar/sidebar';
import { GameBoard } from '@/components/uno/game-board';

export default function UnoPage() {

  return (
    <main className="w-full h-screen relative">
      <Sidebar />
      <GameBoard />
    </main>
  );
}