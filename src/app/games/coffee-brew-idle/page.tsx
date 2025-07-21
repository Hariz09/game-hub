'use client'
import React, { useState } from 'react';
import { useCoffeeGame } from '@/hooks/games/coffee/use-coffee-game';

// Import components
import { 
  LoadingScreen, 
  GameHeader, 
  BeanClicker, 
  EquipmentSection, 
  UpgradesSection, 
  Modals} from '@/components/coffee';
import Sidebar from '@/components/sidebar/sidebar';
import CleanBackground from '@/components/clean-background';

const CoffeeBrewIdleGame: React.FC = () => {
  const {
    gameState,
    gameStats,
    authLoading,
    gameLoading,
    savingProgress,
    initializing,
    isReady,
    handleClick,
    buyEquipment,
    buyUpgrade,
    canPrestige,
    prestige,
    handleManualSave,
    formatNumber,
    getPrestigeProgress
  } = useCoffeeGame();

  // UI state
  const [showPrestige, setShowPrestige] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleManualSaveWithFeedback = async () => {
  setSaveStatus('Saving...');
  try {
    console.log('Manual save triggered');
    console.log('Current game state:', gameState);
    console.log('Is authenticated:', gameState.isAuthenticated);
    
    const success = await handleManualSave();
    
    if (success) {
      setSaveStatus('Saved!');
      console.log('✅ Manual save successful');
    } else {
      setSaveStatus('Save failed - Check console');
      console.log('❌ Manual save failed - check logs above');
    }
    
    setTimeout(() => setSaveStatus(''), 3000); // Show message longer
  } catch (error) {
    console.error('❌ Manual save exception:', error);
    setSaveStatus('Save failed - Exception');
    setTimeout(() => setSaveStatus(''), 3000);
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
    <>
      {/* Background component - renders behind everything */}
      <CleanBackground />
      
      {/* Main game content */}
      <div className="min-h-screen p-4 relative z-10">
        <div className="max-w-6xl mx-auto">
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
    </>
  );
};

export default CoffeeBrewIdleGame;