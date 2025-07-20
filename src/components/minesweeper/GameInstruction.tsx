import React from 'react';

export const GameInstructions: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-xl">🎯</span>
        </div>
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            How to Play
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Master the minefield</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Desktop Controls */}
        <div className="hidden md:flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-purple-200/30 dark:border-purple-700/30">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm">🖱️</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Desktop Controls</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">Left-click</span> to reveal cells • <span className="font-medium">Right-click</span> to flag mines
            </p>
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-start gap-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 backdrop-blur-sm rounded-2xl border border-cyan-200/30 dark:border-cyan-700/30">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm">📱</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Touch Controls</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">Tap</span> to reveal cells • <span className="font-medium">Long-press</span> to flag mines
            </p>
          </div>
        </div>

        {/* Keyboard Controls */}
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 backdrop-blur-sm rounded-2xl border border-emerald-200/30 dark:border-emerald-700/30">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm">⌨️</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Keyboard Navigation</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <span className="font-medium">Arrow keys</span> to navigate • <span className="font-medium">Space/Enter</span> to reveal • <span className="font-medium">F key</span> to flag
            </p>
          </div>
        </div>

        {/* Victory Condition */}
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 backdrop-blur-sm rounded-2xl border border-amber-200/30 dark:border-amber-700/30">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white text-sm">🏆</span>
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Victory Goal</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Reveal all safe cells without hitting any mines to win
            </p>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20 backdrop-blur-sm rounded-2xl border border-rose-200/30 dark:border-rose-700/30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">💡</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">Pro Tips</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>• Numbers show how many mines are adjacent to that cell</p>
          <p>• Use flags to mark suspected mine locations</p>
          <p>• Start with corners and edges for better odds</p>
        </div>
      </div>
    </div>
  );
};