import React from 'react';
import { GameState } from "@/types/minesweeper";

interface GameMessagesProps {
  gameState: GameState;
  timer: number;
  onClose?: () => void; // Add onClose prop
}

export const GameMessages: React.FC<GameMessagesProps> = ({ gameState, timer, onClose }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  if (gameState === 'won') {
    return (
      <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-lg flex items-center justify-center z-[9999] p-4 overflow-y-auto" 
        role="alert"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 max-w-md w-full text-center animate-in zoom-in duration-700 relative z-[10000] my-auto min-h-fit max-h-full">
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200/50 hover:bg-gray-300/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-colors duration-200 group"
              aria-label="Close"
            >
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 text-lg leading-none">×</span>
            </button>
          )}
          
          <div className="relative">
            {/* Celebration particles effect */}
            <div className="absolute -inset-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
            
            <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50">
              <span className="text-4xl animate-bounce">🎉</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-3">
            Victory!
          </h2>
          <p className="text-green-600 dark:text-green-400 font-semibold text-lg mb-6">
            🏆 Congratulations! You cleared the minefield!
          </p>
          
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">⏱️</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
                {formatTime(timer)}
              </span>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Final Time
            </p>
          </div>
          
          {/* Action button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (gameState === 'lost') {
    return (
      <div 
        className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-lg flex items-center justify-center z-[9999] p-4 overflow-y-auto" 
        role="alert"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 max-w-md w-full text-center animate-in zoom-in duration-700 relative z-[10000] my-auto min-h-fit max-h-full">
          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200/50 hover:bg-gray-300/50 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-colors duration-200 group"
              aria-label="Close"
            >
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 text-lg leading-none">×</span>
            </button>
          )}
          
          <div className="relative">
            {/* Explosion particles effect */}
            <div className="absolute -inset-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: '1.5s'
                  }}
                />
              ))}
            </div>
            
            <div className="relative w-24 h-24 bg-gradient-to-r from-red-400 via-rose-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
              <span className="text-4xl animate-pulse">💥</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent mb-3">
            Game Over
          </h2>
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg mb-6">
            💣 You hit a mine! Better luck next time.
          </p>
          
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50 shadow-lg mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">⏱️</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
                {formatTime(timer)}
              </span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Time Played
            </p>
          </div>
          
          {/* Action button */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return null;
};