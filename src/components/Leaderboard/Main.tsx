'use client';

import React, { useState } from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useGameLeaderboard, useGames } from '@/hooks/useGameLeaderboard';
import { LeaderboardHeader } from '@/components/Leaderboard/Header';
import { LeaderboardEntry } from '@/components/Leaderboard/Entry';
import { LeaderboardFooter } from '@/components/Leaderboard/Footer';
import { GameLeaderboardHeader } from '@/components/GameLeaderboard/Header';
import { GameLeaderboardEntry } from '@/components/GameLeaderboard/Entry';
import { GameSelector } from '@/components/GameLeaderboard/GameSelector';
import { LeaderboardTabs } from '@/components/Leaderboard/Tabs';
import { LoadingState, ErrorState, EmptyState } from '@/components/Leaderboard/States';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
        <div className="max-w-7xl mx-auto">
            <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">

                {/* Overall Leaderboard */}
                {activeTab === 'overall' && (
                    <>
                        <LeaderboardHeader
                            limit={overallLimit}
                            onLimitChange={handleOverallLimitChange}
                        />

                        <div className="p-6 lg:p-8">
                            <div className="flex justify-center mb-8">
                                <LeaderboardTabs
                                    activeTab={activeTab}
                                    onTabChange={handleTabChange}
                                />
                            </div>

                            <Separator className="mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

                            {overallLeaderboard.length === 0 ? (
                                <EmptyState />
                            ) : (
                                <div className="space-y-4">
                                    {overallLeaderboard.map((player, index) => (
                                        <div key={player.user_id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                            <LeaderboardEntry
                                                player={player}
                                            />
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

                                <div className="p-6 lg:p-8">
                                    <Separator className="mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

                                    {gameLoading ? (
                                        <LoadingState />
                                    ) : gameError ? (
                                        <ErrorState error={gameError} onRetry={refetchGameLeaderboard} />
                                    ) : gameLeaderboard.length === 0 ? (
                                        <EmptyState />
                                    ) : (
                                        <div className="space-y-4">
                                            {gameLeaderboard.map((player, index) => (
                                                <div key={`${player.username}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                                    <GameLeaderboardEntry
                                                        player={player}
                                                    />
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
                                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-cyan-600 dark:from-purple-800 dark:via-purple-900 dark:to-cyan-800 text-white p-8">
                                    <div className="flex items-center space-x-6 mb-6">
                                        <div className="text-6xl">🎮</div>
                                        <div>
                                            <h1 className="text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-200 to-purple-200 bg-clip-text text-transparent">
                                                Game Leaderboards
                                            </h1>
                                            <p className="text-purple-100 text-lg lg:text-xl font-medium">
                                                Choose your battlefield and see who reigns supreme
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <LeaderboardTabs
                                            activeTab={activeTab}
                                            onTabChange={handleTabChange}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 lg:p-8">
                                    <Separator className="mb-8 bg-gradient-to-r from-purple-200 to-cyan-200 dark:from-purple-700 dark:to-cyan-700" />

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
    );
}