'use client'
import React, { useState } from 'react';
import { useCoffeeGame } from '@/hooks/useCoffeeGame';

// Import components
import { LoadingScreen } from '@/components/coffee/LoadingScreen';
import { GameHeader } from '@/components/coffee/Header';
import { BeanClicker } from '@/components/coffee/BeanClicker';
import { EquipmentSection } from '@/components/coffee/EquipmentSection';
import { UpgradesSection } from '@/components/coffee/UpgradesSection';
import { Modals } from '@/components/coffee/Modals';
import Sidebar from '@/components/sidebar/Sidebar';

const CoffeeBrewIdleGame: React.FC = () => {
  const {
    gameState,
    gameStats,
    authLoading,
    gameLoading,
    savingProgress,
    loadingLeaderboard,
    initializing,
    isReady,
    handleClick,
    buyEquipment,
    buyUpgrade,
    canPrestige,
    prestige,
    handleManualSave,
    loadLeaderboard,
    formatNumber,
    getPrestigeProgress
  } = useCoffeeGame();

  // UI state
  const [showPrestige, setShowPrestige] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userBest, setUserBest] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleLoadLeaderboard = async () => {
    try {
      const { leaderboard: leaderboardData, userBest: userBestData } = await loadLeaderboard();
      setLeaderboard(leaderboardData);
      setUserBest(userBestData);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Failed to load leaderboard');
    }
  };

  const handleManualSaveWithFeedback = async () => {
    setSaveStatus('Saving...');
    try {
      const success = await handleManualSave();
      setSaveStatus(success ? 'Saved!' : 'Save failed');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (error) {
      setSaveStatus('Save failed');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handlePrestige = () => {
    prestige();
    setShowPrestige(false);
  };

  // Show main loading screen while auth or game is loading
  if (authLoading || gameLoading || initializing) {
    return (
      <LoadingScreen 
        authLoading={authLoading}
        gameLoading={gameLoading}
        initializing={initializing}
      />
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:via-slate-800 dark:to-gray-900 p-4">     <div className="max-w-6xl mx-auto">
        <Sidebar />
        {/* Header */}
        <GameHeader
          gameState={gameState}
          gameStats={gameStats}
          savingProgress={savingProgress}
          isReady={isReady}
          saveStatus={saveStatus}
          formatNumber={formatNumber}
          onManualSave={handleManualSaveWithFeedback}
          onShowProfile={() => setShowProfile(true)}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coffee Bean Clicker */}
          <BeanClicker
            gameState={gameState}
            isReady={isReady}
            canPrestige={canPrestige}
            onHandleClick={handleClick}
            onShowPrestige={() => setShowPrestige(true)}
            formatNumber={formatNumber}
            getPrestigeProgress={getPrestigeProgress}
          />

          {/* Equipment */}
          <EquipmentSection
            gameState={gameState}
            isReady={isReady}
            formatNumber={formatNumber}
            buyEquipment={buyEquipment}
          />

          {/* Upgrades */}
          <UpgradesSection
            gameState={gameState}
            gameStats={gameStats}
            isReady={isReady}
            savingProgress={savingProgress}
            formatNumber={formatNumber}
            buyUpgrade={buyUpgrade}
          />
        </div>

        {/* Modals */}
        <Modals
          showPrestige={showPrestige}
          gameState={gameState}
          isReady={isReady}
          formatNumber={formatNumber}
          onClosePrestige={() => setShowPrestige(false)}
          onPrestige={handlePrestige}
        />
      </div>
    </div>
  );
};

export default CoffeeBrewIdleGame;