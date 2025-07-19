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

  const colors = [
    'bg-purple-400',
    'bg-purple-500',
    'bg-purple-600',
    'bg-cyan-400',
    'bg-cyan-500',
    'bg-cyan-600',
  ];

  useEffect(() => {
    // Initialize squares
    const initialSquares: Square[] = [];
    for (let i = 0; i < 15; i++) { // Reduced count to minimize glitches
      initialSquares.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 25 + 15, // More consistent sizing
        speed: Math.random() * 0.5 + 0.3, // More controlled speed
        direction: Math.random() > 0.5 ? 'down' : 'up',
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.2, // Better opacity range
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5, // Slower rotation
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

          // Keep rotation within bounds to prevent overflow
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
    }, 60); // Slightly slower update rate for smoother animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-purple-900/20 animate-pulse"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Falling squares */}
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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-800/10 via-cyan-800/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
      
      {/* Corner accent lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-700/20 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-700/20 to-transparent rounded-full blur-2xl"></div>
    </div>
  );
};

export default CleanBackground;