// app/page.tsx
'use client'
import { useState } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { GameBoard } from '@/components/uno/GameBoard';

export default function Home() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="w-full h-screen relative">
      {/* Sidebar Component */}
      <Sidebar />
      <GameBoard />
      {/* Game Board - Full screen */}
    </main>
  );
}