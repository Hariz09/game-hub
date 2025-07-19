import React, { useEffect, useState } from 'react';

interface Square {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  direction: 'down' | 'up';
  color: string;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

const CleanBackground: React.FC = () => {
  const [squares, setSquares] = useState<Square[]>([]);

  useEffect(() => {
    const colors = [
      'bg-purple-400 dark:bg-purple-400',
      'bg-purple-500 dark:bg-purple-500',
      'bg-purple-600 dark:bg-purple-600',
      'bg-cyan-400 dark:bg-cyan-400',
      'bg-cyan-500 dark:bg-cyan-500',
      'bg-cyan-600 dark:bg-cyan-600',
    ];

    // Initialize squares
    const initialSquares: Square[] = [];
    for (let i = 0; i < 15; i++) {
      initialSquares.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 25 + 15,
        speed: Math.random() * 0.5 + 0.3,
        direction: Math.random() > 0.5 ? 'down' : 'up',
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
      });
    }
    setSquares(initialSquares);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSquares(prevSquares =>
        prevSquares.map(square => {
          let newY = square.y;
          let newRotation = square.rotation + square.rotationSpeed;
          
          if (newRotation > 360) newRotation -= 360;
          if (newRotation < 0) newRotation += 360;

          if (square.direction === 'down') {
            newY += square.speed;
            if (newY > 110) {
              newY = -10;
            }
          } else {
            newY -= square.speed;
            if (newY < -10) {
              newY = 110;
            }
          }

          return {
            ...square,
            y: newY,
            rotation: newRotation,
          };
        })
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-black dark:via-slate-900 dark:to-black">

        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-cyan-200/30 to-purple-200/30 dark:from-purple-900/20 dark:via-cyan-900/20 dark:to-purple-900/20 animate-pulse"></div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* Floating squares */}
        {squares.map(square => (
          <div
            key={square.id}
            className={`absolute ${square.color} rounded-sm shadow-lg will-change-transform`}
            style={{
              left: `${square.x}%`,
              top: `${square.y}%`,
              width: `${square.size}px`,
              height: `${square.size}px`,
              opacity: square.opacity,
              transform: `rotate(${square.rotation}deg)`,
              boxShadow: square.color.includes('purple') 
                ? '0 0 15px rgba(139, 92, 246, 0.3)' 
                : '0 0 15px rgba(34, 211, 238, 0.3)',
            }}
          ></div>
        ))}

        {/* Central glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-300/20 via-cyan-300/10 to-transparent dark:from-purple-800/10 dark:via-cyan-800/5 dark:to-transparent rounded-full blur-3xl animate-pulse"></div>
        
        {/* Corner accent lights */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-300/30 to-transparent dark:from-purple-700/20 dark:to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-300/30 to-transparent dark:from-cyan-700/20 dark:to-transparent rounded-full blur-2xl"></div>
        
        {/* Light mode specific elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-50/50 to-cyan-50/50 dark:hidden"></div>
        
        {/* Additional light mode ambiance */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-cyan-200/15 to-transparent dark:hidden rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-radial from-purple-200/15 to-transparent dark:hidden rounded-full blur-2xl animate-pulse"></div>
      </div>
  );
};

export default CleanBackground;