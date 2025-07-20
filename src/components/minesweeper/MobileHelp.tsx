import React from 'react';

export const MobileHelp: React.FC = () => {
  return (
    <div className="md:hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
          <span className="text-white text-lg">📱</span>
        </div>
        <div>
          <h3 className="font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Mobile Controls
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Touch-optimized gameplay</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/30 backdrop-blur-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
            <span className="text-white text-sm">👆</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Single Tap</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Tap any cell to reveal what's underneath
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50/50 to-cyan-50/50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/30 backdrop-blur-sm">
          <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
            <span className="text-white text-sm">⏳</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Long Press</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Hold down to place or remove flags on suspected mines
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/30 dark:border-green-700/30 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 dark:text-green-400 text-lg">💡</span>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Pro Tip</span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
            For better precision, use landscape mode on phones and zoom in slightly for easier targeting
          </p>
        </div>
      </div>
    </div>
  );
};