// Dynamic Header Component with Iconify icons and responsive design
'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface DynamicHeaderProps {
  sounds: {
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
  };
}

export function DynamicHeader({ sounds }: DynamicHeaderProps) {
  return (
    <header className="mb-4 sm:mb-6 lg:mb-8">
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 dark:from-black/20 dark:via-black/10 dark:to-black/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/30 dark:border-white/10 shadow-2xl shadow-purple-500/10">
        
        {/* Mobile Layout (up to sm) */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
                  <Icon icon="game-icons:mine-explosion" className="text-2xl text-white filter drop-shadow-lg" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-30"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 dark:from-purple-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Minesweeper
                </h1>
              </div>
            </div>
            
            {/* Mobile Audio Button */}
            <button
              onClick={() => sounds.setSoundEnabled(!sounds.soundEnabled)}
              className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg backdrop-blur-md border ${
                sounds.soundEnabled
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400/50 shadow-green-500/25'
                  : 'bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30'
              }`}
              title={`Sound ${sounds.soundEnabled ? 'enabled' : 'disabled'}`}
              aria-label={`Toggle sound ${sounds.soundEnabled ? 'off' : 'on'}`}
            >
              <Icon 
                icon={sounds.soundEnabled ? "ph:speaker-high-fill" : "ph:speaker-x-fill"} 
                className="text-xl transition-transform group-hover:scale-110" 
              />
            </button>
          </div>
          
          {/* Mobile subtitle and status */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Strategic puzzle game
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-black/10 rounded-full border border-white/20 dark:border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full ${sounds.soundEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {sounds.soundEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Tablet Layout (sm to lg) */}
        <div className="hidden sm:flex lg:hidden items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform hover:scale-105 transition-transform duration-300">
                <Icon icon="game-icons:mine-explosion" className="text-2xl text-white filter drop-shadow-lg" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30"></div>
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 dark:from-purple-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                Minesweeper
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Strategic puzzle game with enhanced features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/10 dark:bg-black/10 rounded-full border border-white/20 dark:border-white/10">
              <Icon 
                icon={sounds.soundEnabled ? "ph:speaker-high-fill" : "ph:speaker-x-fill"} 
                className={`text-sm ${sounds.soundEnabled ? 'text-green-400' : 'text-red-400'}`}
              />
              <div className={`w-2 h-2 rounded-full ${sounds.soundEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Audio {sounds.soundEnabled ? 'On' : 'Off'}
              </span>
            </div>
            <button
              onClick={() => sounds.setSoundEnabled(!sounds.soundEnabled)}
              className={`group relative p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl backdrop-blur-md border ${
                sounds.soundEnabled
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400/50 shadow-green-500/25 hover:shadow-green-500/40'
                  : 'bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30 shadow-gray-500/10'
              }`}
              title={`Sound ${sounds.soundEnabled ? 'enabled' : 'disabled'}`}
              aria-label={`Toggle sound ${sounds.soundEnabled ? 'off' : 'on'}`}
            >
              <Icon 
                icon={sounds.soundEnabled ? "ph:speaker-high-fill" : "ph:speaker-x-fill"} 
                className="text-xl transition-transform group-hover:scale-110" 
              />
            </button>
          </div>
        </div>

        {/* Desktop Layout (lg+) */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 transform group-hover:scale-105 transition-all duration-300">
                <Icon icon="game-icons:mine-explosion" className="text-3xl text-white filter drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              
              {/* Floating particles effect */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-70 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-cyan-600 to-indigo-600 dark:from-purple-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Minesweeper
                </h1>
                <div className="flex gap-1">
                  <Icon icon="ph:star-fill" className="text-yellow-400 text-lg animate-pulse" />
                  <Icon icon="ph:star-fill" className="text-yellow-400 text-lg animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <Icon icon="ph:star-fill" className="text-yellow-400 text-lg animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium flex items-center gap-2">
                <Icon icon="ph:game-controller" className="text-lg" />
                Strategic puzzle game with enhanced features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Audio status indicator */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 dark:bg-black/10 rounded-full border border-white/20 dark:border-white/10 backdrop-blur-md">
              <Icon 
                icon={sounds.soundEnabled ? "ph:waveform" : "ph:waveform-slash"} 
                className={`text-lg ${sounds.soundEnabled ? 'text-green-400 animate-pulse' : 'text-red-400'}`}
              />
              <div className={`w-2 h-2 rounded-full ${sounds.soundEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Audio {sounds.soundEnabled ? 'On' : 'Off'}
              </span>
            </div>

            {/* Enhanced audio toggle button */}
            <button
              onClick={() => sounds.setSoundEnabled(!sounds.soundEnabled)}
              className={`group relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-xl backdrop-blur-md border overflow-hidden ${
                sounds.soundEnabled
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-400/50 shadow-green-500/25 hover:shadow-green-500/40'
                  : 'bg-white/20 dark:bg-black/20 text-gray-600 dark:text-gray-300 border-white/30 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/30 shadow-gray-500/10'
              }`}
              title={`Sound ${sounds.soundEnabled ? 'enabled' : 'disabled'}`}
              aria-label={`Toggle sound ${sounds.soundEnabled ? 'off' : 'on'}`}
            >
              {/* Animated background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 transition-transform duration-700 ${sounds.soundEnabled ? 'translate-x-full group-hover:translate-x-full' : '-translate-x-full'}`}></div>
              
              <Icon 
                icon={sounds.soundEnabled ? "ph:speaker-high-fill" : "ph:speaker-x-fill"} 
                className="text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10" 
              />
              
              {/* Sound wave animation when enabled */}
              {sounds.soundEnabled && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                    <div className="w-0.5 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-0.5 h-4 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}