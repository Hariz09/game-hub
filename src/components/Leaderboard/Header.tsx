import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Crown, Sparkles, Star, Zap, Medal, Target } from 'lucide-react';

interface LeaderboardHeaderProps {
  limit: number;
  onLimitChange: (newLimit: number) => void;
}

export const LeaderboardHeader: React.FC<LeaderboardHeaderProps> = ({ 
  limit, 
  onLimitChange 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative bg-gradient-to-br from-gray-100 via-blue-100 to-gray-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Dynamic animated background - optimized for mobile */}
      <div className="absolute inset-0 opacity-20 dark:opacity-15">
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 animate-float">
          <Crown className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-yellow-500 dark:text-yellow-400" />
        </div>
        <div className="absolute top-8 right-6 sm:top-16 sm:right-16 animate-spin-slow">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-500 dark:text-cyan-400" />
        </div>
        <div className="absolute bottom-12 left-1/4 animate-bounce-slow">
          <Trophy className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-purple-500 dark:text-purple-400" />
        </div>
        <div className="absolute top-1/2 right-1/4 animate-pulse">
          <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-pink-500 dark:text-pink-400" />
        </div>
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 animate-float">
          <Zap className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-orange-500 dark:text-orange-400" />
        </div>
      </div>

      {/* Gradient orbs - smaller on mobile */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-gradient-to-br from-blue-400/15 to-purple-400/15 dark:from-purple-500/20 dark:to-pink-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-gradient-to-br from-purple-400/10 to-blue-400/10 dark:from-cyan-500/15 dark:to-blue-500/15 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 xl:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Mobile-first: Stack everything vertically, then horizontal on larger screens */}
          <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-8">
            
            {/* Header section - centered on mobile, left-aligned on desktop */}
            <div className="text-center lg:text-left lg:flex-1">
              {/* Trophy and title - stack on mobile */}
              <div className="flex flex-col items-center lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
                <div className="relative group">
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-600 dark:to-cyan-600 rounded-full blur-md sm:blur-lg opacity-40 dark:opacity-60 group-hover:opacity-70 dark:group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="relative text-4xl sm:text-5xl lg:text-6xl xl:text-7xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                    🏆
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 animate-ping">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-yellow-400 rounded-full opacity-75"></div>
                  </div>
                </div>
                
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent leading-tight">
                      Game Hub
                    </h1>
                    <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-700 dark:text-purple-200">
                      Champions League
                    </h2>
                  </div>
                  
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 font-medium max-w-sm lg:max-w-md mx-auto lg:mx-0">
                    Where legends are forged and champions rise to immortality
                  </p>
                </div>
              </div>
            </div>
            
            {/* Controls section - optimized for mobile */}
            <div 
              className="flex justify-center lg:justify-end lg:flex-shrink-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Card className={`w-full max-w-xs sm:max-w-sm lg:max-w-none bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-300/50 dark:border-white/20 shadow-lg sm:shadow-xl lg:shadow-2xl transition-all duration-300 transform ${isHovered ? 'scale-105 shadow-blue-500/20 dark:shadow-purple-500/20' : ''}`}>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="relative inline-block">
                      <Medal className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-yellow-500 dark:text-yellow-400 mx-auto mb-2 sm:mb-3" />
                      <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <label className="text-base sm:text-lg font-bold text-gray-900 dark:text-white block mb-1">
                      Leaderboard Size
                    </label>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      Choose your battleground
                    </p>
                  </div>
                  
                  <div className="w-full">
                    <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
                      <SelectTrigger className="w-full h-10 py-8  sm:h-12 bg-white/60 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white border-gray-300/50 dark:border-white/30 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 focus:border-transparent rounded-lg sm:rounded-xl font-medium transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/30 ">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl">
                        <SelectItem value="5" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md m-1 cursor-pointer py-2 sm:py-3 lg:py-4">
                          <span className="text-base sm:text-lg lg:text-xl mr-2 sm:mr-3">🥇</span>
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm sm:text-base">Top 5 Elite</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block lg:text-sm">Masters only</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="10" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md m-1 cursor-pointer py-2 sm:py-3 lg:py-4">
                          <span className="text-base sm:text-lg lg:text-xl mr-2 sm:mr-3">🏆</span>
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm sm:text-base">Top 10 Champions</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block lg:text-sm">Pro league</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="25" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md m-1 cursor-pointer py-2 sm:py-3 lg:py-4">
                          <span className="text-base sm:text-lg lg:text-xl mr-2 sm:mr-3">⭐</span>
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm sm:text-base">Top 25 Players</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block lg:text-sm">Rising stars</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="50" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md m-1 cursor-pointer py-2 sm:py-3 lg:py-4">
                          <span className="text-base sm:text-lg lg:text-xl mr-2 sm:mr-3">🎮</span>
                          <div className="flex flex-col">
                            <div className="font-semibold text-sm sm:text-base">Top 50 Gamers</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block lg:text-sm">Full roster</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 dark:via-purple-500 to-transparent"></div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};