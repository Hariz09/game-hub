'use client';

import React, { useState } from 'react';
import { useLeaderboard } from '@/hooks/games/use-leaderboard';
import { useGameLeaderboard, useGames } from '@/hooks/games/use-game-leaderboard';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Sidebar from '@/components/sidebar/sidebar';
import CleanBackground from '@/components/clean-background';
import { GameLeaderboardHeader, GameLeaderboardEntry, GameSelector } from '@/components/game-leaderboard';
import { 
    LeaderboardHeader,
    LeaderboardEntry,
    LeaderboardFooter,
    LeaderboardTabs,
    LoadingState,
    ErrorState,
    EmptyState } from '@/components/leaderboard';

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<'overall' | 'games'>('overall');
    const [selectedGame, setSelectedGame] = useState<string | null>(null);

    // Overall leaderboard
    const {
        leaderboard: overallLeaderboard,
        loading: overallLoading,
        error: overallError,
        limit: overallLimit,
        handleLimitChange: handleOverallLimitChange,
        refetch: refetchOverall
    } = useLeaderboard(10);

    // Games data
    const {
        games,
        loading: gamesLoading,
        error: gamesError,
        refetch: refetchGames
    } = useGames();

    // Game-specific leaderboard
    const {
        leaderboard: gameLeaderboard,
        loading: gameLoading,
        error: gameError,
        limit: gameLimit,
        handleLimitChange: handleGameLimitChange,
        refetch: refetchGameLeaderboard
    } = useGameLeaderboard(selectedGame || '', 10);

    const handleGameSelect = (gameName: string) => {
        setSelectedGame(gameName);
    };

    const handleBackToGames = () => {
        setSelectedGame(null);
    };

    const handleTabChange = (tab: 'overall' | 'games') => {
        setActiveTab(tab);
        setSelectedGame(null);
    };

    if (overallLoading && activeTab === 'overall') {
        return <LoadingState />;
    }

    if (overallError && activeTab === 'overall') {
        return <ErrorState error={overallError} onRetry={refetchOverall} />;
    }

    if (gamesError && activeTab === 'games') {
        return <ErrorState error={gamesError} onRetry={refetchGames} />;
    }

    return (
        <div className="min-h-screen">
            <CleanBackground />
            {/* Desktop sidebar - hidden on mobile */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            
            {/* Main content container */}
            <div className="w-full lg:max-w-6xl xl:max-w-7xl lg:mx-auto lg:pl-0">
                {/* Mobile padding, desktop margin adjustment */}
                <div className="px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                    <Card className="w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg sm:shadow-2xl border border-gray-200/50 dark:border-gray-800/50 overflow-hidden">
                        
                        {/* Overall Leaderboard */}
                        {activeTab === 'overall' && (
                            <>
                                <LeaderboardHeader
                                    limit={overallLimit}
                                    onLimitChange={handleOverallLimitChange}
                                />

                                <div className="px-4 py-6 sm:px-6 lg:px-8">
                                    {/* Tabs - responsive centering */}
                                    <div className="flex justify-center mb-6 sm:mb-8">
                                        <div className="w-full sm:w-auto">
                                            <LeaderboardTabs
                                                activeTab={activeTab}
                                                onTabChange={handleTabChange}
                                            />
                                        </div>
                                    </div>

                                    <Separator className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

                                    {overallLeaderboard.length === 0 ? (
                                        <EmptyState />
                                    ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                            {overallLeaderboard.map((player, index) => (
                                                <div 
                                                    key={player.user_id} 
                                                    className="animate-fade-in-up" 
                                                    style={{ animationDelay: `${index * 100}ms` }}
                                                >
                                                    <LeaderboardEntry player={player} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <LeaderboardFooter onRefresh={refetchOverall} />
                            </>
                        )}

                        {/* Game Leaderboards */}
                        {activeTab === 'games' && (
                            <>
                                {selectedGame ? (
                                    // Individual game leaderboard
                                    <>
                                        <GameLeaderboardHeader
                                            gameName={selectedGame}
                                            limit={gameLimit}
                                            onLimitChange={handleGameLimitChange}
                                            onBack={handleBackToGames}
                                        />

                                        <div className="px-4 py-6 sm:px-6 lg:px-8">
                                            <Separator className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

                                            {gameLoading ? (
                                                <LoadingState />
                                            ) : gameError ? (
                                                <ErrorState error={gameError} onRetry={refetchGameLeaderboard} />
                                            ) : gameLeaderboard.length === 0 ? (
                                                <EmptyState />
                                            ) : (
                                                <div className="space-y-3 sm:space-y-4">
                                                    {gameLeaderboard.map((player, index) => (
                                                        <div 
                                                            key={`${player.username}-${index}`} 
                                                            className="animate-fade-in-up" 
                                                            style={{ animationDelay: `${index * 100}ms` }}
                                                        >
                                                            <GameLeaderboardEntry player={player} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <LeaderboardFooter onRefresh={refetchGameLeaderboard} />
                                    </>
                                ) : (
                                    // Game selection screen
                                    <>
                                        {/* Header section - responsive design */}
                                        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-cyan-600 dark:from-purple-800 dark:via-purple-900 dark:to-cyan-800 text-white">
                                            <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                                                {/* Hero content - stacked on mobile, side-by-side on desktop */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-6 sm:mb-8">
                                                    {/* Icon - smaller on mobile */}
                                                    <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-0 text-center sm:text-left">
                                                        🎮
                                                    </div>
                                                    
                                                    {/* Text content */}
                                                    <div className="text-center sm:text-left">
                                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                                                            Game Leaderboards
                                                        </h1>
                                                        <p className="text-purple-100 text-sm sm:text-base lg:text-lg xl:text-xl font-medium">
                                                            Choose your battlefield and see who reigns supreme
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tabs - responsive positioning */}
                                                <div className="flex justify-center">
                                                    <div className="w-full sm:w-auto">
                                                        <LeaderboardTabs
                                                            activeTab={activeTab}
                                                            onTabChange={handleTabChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Game selector section */}
                                        <div className="px-4 py-6 sm:px-6 lg:px-8">
                                            <Separator className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

                                            <GameSelector
                                                games={games}
                                                selectedGame={selectedGame}
                                                onGameSelect={handleGameSelect}
                                                loading={gamesLoading}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}