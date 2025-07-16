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
      {/* Dynamic animated background */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 animate-float">
            <Crown className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div className="absolute top-20 right-20 animate-spin-slow">
            <Sparkles className="h-6 w-6 text-blue-500 dark:text-cyan-400" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce-slow">
            <Trophy className="h-10 w-10 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="absolute top-1/2 right-1/4 animate-pulse">
            <Star className="h-7 w-7 text-pink-500 dark:text-pink-400" />
          </div>
          <div className="absolute bottom-10 right-10 animate-float">
            <Zap className="h-8 w-8 text-orange-500 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Gradient orbs for depth */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-purple-500/30 dark:to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-blue-400/15 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* Left side - Title and info */}
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-600 dark:to-cyan-600 rounded-full blur-lg opacity-50 dark:opacity-70 group-hover:opacity-80 dark:group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-7xl lg:text-8xl transform group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                  🏆
                </div>
                <div className="absolute -top-3 -right-3 animate-ping">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-75"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-300 dark:via-purple-300 dark:to-pink-300 bg-clip-text text-transparent leading-tight">
                    Game Hub
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-bold text-purple-700 dark:text-purple-200">
                    Champions League
                  </h2>
                </div>
                
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium max-w-md">
                  Where legends are forged and champions rise to immortality
                </p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/40 dark:bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-200/50 dark:border-white/20">
                    <Users className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-cyan-200">
                      {limit} Elite Warriors
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/40 dark:bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-gray-200/50 dark:border-white/20">
                    <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-700 dark:text-purple-200">
                      Live Rankings
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Controls */}
            <div 
              className="flex flex-col items-center space-y-6"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Card className={`bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-300/50 dark:border-white/20 shadow-2xl transition-all duration-300 transform ${isHovered ? 'scale-105 shadow-blue-500/25 dark:shadow-purple-500/25' : ''}`}>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <Medal className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mx-auto mb-3" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <label className="text-lg font-bold text-gray-900 dark:text-white block mb-1">
                      Leaderboard Size
                    </label>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Choose your battleground
                    </p>
                  </div>
                  
                  <div className='items-center'>
                  <Select value={limit.toString()} onValueChange={(value) => onLimitChange(Number(value))}>
                    <SelectTrigger className="w-[220px] h-12 bg-white/60 dark:bg-white/20 backdrop-blur-sm text-gray-900 dark:text-white border-gray-300/50 dark:border-white/30 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-400 focus:border-transparent rounded-xl font-medium transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl">
                      <SelectItem value="5" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg m-1 cursor-pointer">
                        <div className="flex items-center space-x-3 py-1">
                          <span className="text-xl">🥇</span>
                          <div>
                            <div className="font-semibold">Top 5 Elite</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Masters only</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="10" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg m-1 cursor-pointer">
                        <div className="flex items-center space-x-3 py-1">
                          <span className="text-xl">🏆</span>
                          <div>
                            <div className="font-semibold">Top 10 Champions</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Pro league</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="25" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg m-1 cursor-pointer">
                        <div className="flex items-center space-x-3 py-1">
                          <span className="text-xl">⭐</span>
                          <div>
                            <div className="font-semibold">Top 25 Players</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Rising stars</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="50" className="text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg m-1 cursor-pointer">
                        <div className="flex items-center space-x-3 py-1">
                          <span className="text-xl">🎮</span>
                          <div>
                            <div className="font-semibold">Top 50 Gamers</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Full roster</div>
                          </div>
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
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
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